/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { useAccount, useReadContracts, useWalletClient, useWriteContract } from 'wagmi';
import { abiUSDB, abiUSDT } from '../abi';
import { MAX_INT, TOKEN_USDB, TOKEN_USDT } from '../constants';
import BigNumber from 'bignumber.js';
import { useQueryClient } from '@tanstack/react-query';
import { useNotification } from './use-notification';
import { publicClient } from '../client';

interface TOKENS {
    name: string;
    address: string;
    type: string;
}

const tokenUsdt = {
    name: "USDT",
    address: TOKEN_USDT,
    type: "buy"
}

const tokenUsdb: TOKENS = {
    name: "USDB",
    address: TOKEN_USDB,
    type: "sell"
}

export const useBuy = () => {
    const contractAsync = useWriteContract();
    const account = useAccount();
    const queryClient = useQueryClient()
    const walletClient = useWalletClient()
    const { handleNotificationError, handleNotificationSuccess } = useNotification();
    const [loading, setLoading] = React.useState(false);
    const [loadingMintUSDT, setLoadingMintUSDT] = React.useState(false);

    const [arrayToken, setArrayToken] = React.useState<TOKENS[]>([tokenUsdt, tokenUsdb]);
    const formToken = arrayToken[0];
    const toToken = arrayToken[1];

    const resultUSDT = useReadContracts({
        contracts: [
            {
                abi: abiUSDT,
                address: TOKEN_USDT,
                functionName: 'balanceOf',
                args: [account.address],
            },
            {
                abi: abiUSDT,
                address: TOKEN_USDT,
                functionName: 'decimals',
            },
            {
                abi: abiUSDT,
                address: TOKEN_USDT,
                functionName: 'allowance',
                args: [account.address, TOKEN_USDB],
            }
        ],
        query: {
            enabled: !!account.address,
        }
    });

    const resultUSDB = useReadContracts({
        contracts: [
            {
                abi: abiUSDB,
                address: TOKEN_USDB,
                functionName: 'balanceOf',
                args: [account.address],
            },
            {
                abi: abiUSDB,
                address: TOKEN_USDB,
                functionName: 'decimals',
            },
            {
                abi: abiUSDB,
                address: TOKEN_USDB,
                functionName: 'allowance',
                args: [account.address, TOKEN_USDT],
            },
        ],
        query: {
            enabled: !!account.address,
        }
    });

    const balanceOfUSDT = React.useMemo(() => {
        if (resultUSDT.status === "pending" || !resultUSDT.data?.length) return 0;
        const [balance, decimals] = resultUSDT.data;
        const amount = new BigNumber(balance.result as string).dividedBy(new BigNumber(10).pow(decimals.result as string)).toString();
        return new BigNumber(amount).decimalPlaces(5, 1).toString();
    }, [resultUSDT.status, resultUSDT.data]);

    const balanceOfUSDB = React.useMemo(() => {
        if (resultUSDB.status === "pending" || !resultUSDB.data?.length) return 0;
        const [balance, decimals] = resultUSDB.data;
        const amount = new BigNumber(balance.result as string).dividedBy(new BigNumber(10).pow(decimals.result as string)).toString();
        return new BigNumber(amount).decimalPlaces(5, 1).toString();
    }, [resultUSDB.status, resultUSDB.data]);

    const allowance = React.useMemo(() => {
        if (resultUSDT.status === "pending" || !resultUSDT.data?.length || resultUSDB.status === "pending" || !resultUSDB.data?.length) return 0;
        return formToken.type === "buy" ? resultUSDT.data[2].result : resultUSDB.data[2].result;
    }, [formToken.type, resultUSDB.data, resultUSDB.status, resultUSDT.data, resultUSDT.status]);

    const handleTx = React.useCallback((tx: string) => {
        if (!walletClient.data) return;
        return `${walletClient?.data?.chain?.blockExplorers?.default?.url}/tx/${tx}`;
    }, [walletClient]);

    const handleApprove = React.useCallback(async (token: string, spender: string) => {
        try {
            setLoading(true);
            const tx = await contractAsync.writeContractAsync({
                address: token as `0x${string}`,
                abi: abiUSDT,
                functionName: 'approve',
                args: [spender, MAX_INT],
            });
            if (tx) {
                await publicClient.waitForTransactionReceipt({ hash: tx });
                queryClient.invalidateQueries();
                handleNotificationSuccess(tx, "Approve success")
            }
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            return handleNotificationError(error)
        }
    }, [handleNotificationError, handleNotificationSuccess, queryClient, contractAsync]);

    const handelMintUSDT = React.useCallback(async (amount: number) => {
        try {
            setLoadingMintUSDT(true);
            const amountUSDT = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(18)).toString();
            const tx = await contractAsync.writeContractAsync({
                address: TOKEN_USDT,
                abi: abiUSDT,
                functionName: "mint",
                args: [account.address, amountUSDT],
            });
            if (tx) {
                await publicClient.waitForTransactionReceipt({ hash: tx });
                await queryClient.invalidateQueries()
                handleNotificationSuccess(tx, `Mint ${amount} USDT success`)
            }
            setLoadingMintUSDT(false);
        } catch (error) {
            handleNotificationError(error)
            setLoadingMintUSDT(false);
        }
    }, [account.address, handleNotificationError, handleNotificationSuccess, queryClient, contractAsync]);

    const handleBuy = React.useCallback(async (amount: number, type: string) => {
        try {
            setLoading(true);
            const amountUSDT = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(18)).toString();
            const tx = await contractAsync.writeContractAsync({
                address: TOKEN_USDB,
                abi: abiUSDB,
                functionName: type,
                args: [TOKEN_USDT, amountUSDT],
            });
            if (tx) {
                await publicClient.waitForTransactionReceipt({ hash: tx });
                await queryClient.invalidateQueries()
                handleNotificationSuccess(tx, `Buy ${amount} USDT success`)
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            handleNotificationError(error)
        }
    }, [handleNotificationError, handleNotificationSuccess, queryClient, contractAsync]);

    const handleSwap = () => {
        const newData = [...arrayToken];
        setArrayToken(newData.reverse());
    };

    return {
        balanceOfUSDT,
        balanceOfUSDB,
        address: account.address,
        isPending: loading,
        allowance,
        formToken,
        toToken,
        loadingMintUSDT,
        handleTx,
        handleApprove,
        handleBuy,
        handleSwap,
        handelMintUSDT
    }
}
