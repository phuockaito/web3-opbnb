/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { useAccount, useReadContracts, useWalletClient, useWriteContract } from 'wagmi';
import { abiUSDB, abiUSDT } from '../abi';
import { TOKEN_USDB, TOKEN_USDT } from '../constants';
import BigNumber from 'bignumber.js';
import { useQueryClient } from '@tanstack/react-query';
import { useNotification } from './use-notification';
import { publicClient } from '../client';
import { maxUint256 } from 'viem';

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

    const resultToken = useReadContracts({
        contracts: [
            {
                abi: abiUSDT,
                address: TOKEN_USDT,
                functionName: 'balanceOf', // 0
                args: [account.address],
            },
            {
                abi: abiUSDT,
                address: TOKEN_USDT,
                functionName: 'decimals', // 1
            },
            {
                abi: abiUSDT,
                address: TOKEN_USDT,
                functionName: 'allowance', // 2
                args: [account.address, TOKEN_USDB],
            },
            {
                abi: abiUSDB,
                address: TOKEN_USDB,
                functionName: 'balanceOf', // 3
                args: [account.address],
            },
            {
                abi: abiUSDB,
                address: TOKEN_USDB,
                functionName: 'decimals', // 4
            },
            {
                abi: abiUSDB,
                address: TOKEN_USDB,
                functionName: 'allowance', // 5
                args: [account.address, TOKEN_USDT],
            },
        ],
        query: {
            enabled: !!account.address,
        }
    });


    const balanceOfUSDT = React.useMemo(() => {
        if (resultToken.status === "pending" || !resultToken.data?.length) return 0;
        const amount = new BigNumber(resultToken.data[0].result as string).dividedBy(new BigNumber(10).pow(resultToken.data[1].result as string)).toString();
        return new BigNumber(amount).decimalPlaces(5, 1).toString();
    }, [resultToken.status, resultToken.data]);

    const balanceOfUSDB = React.useMemo(() => {
        if (resultToken.status === "pending" || !resultToken.data?.length) return 0;
        const amount = new BigNumber(resultToken.data[3].result as string).dividedBy(new BigNumber(10).pow(resultToken.data[4].result as string)).toString();
        return new BigNumber(amount).decimalPlaces(5, 1).toString();
    }, [resultToken.status, resultToken.data]);

    const allowance = React.useMemo(() => {
        if (resultToken.status === "pending" || !resultToken.data?.length) return 0;
        return formToken.type === "buy" ? resultToken.data[2].result : resultToken.data[5].result;
    }, [formToken.type, resultToken.data, resultToken.status]);

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
                args: [spender, maxUint256],
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
