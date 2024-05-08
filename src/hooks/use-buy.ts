/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { useAccount, useReadContracts, useWriteContract } from 'wagmi';
import BigNumber from 'bignumber.js';
import { useQueryClient } from '@tanstack/react-query';
import { maxUint256 } from 'viem';
import { formatEther } from 'ethers';

import { abiUSDB, abiUSDT } from '../abi';
import { TOKEN_USDB, TOKEN_USDT } from '../constants';
import { useNotification } from './use-notification';
import { publicClient } from '../client';

interface TOKENS {
    name: string;
    address: string;
    type: string;
}

interface ResultTokenType {
    balanceUsdt: string;
    allowanceUsdt: unknown;
    balanceUsdb: string;
    allowanceUsdb: unknown;
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
                functionName: 'balanceOf',
                args: [account.address],
            },
            {
                abi: abiUSDT,
                address: TOKEN_USDT,
                functionName: 'allowance',
                args: [account.address, TOKEN_USDB],
            },
            {
                abi: abiUSDB,
                address: TOKEN_USDB,
                functionName: 'balanceOf',
                args: [account.address],
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
            select: (data): ResultTokenType => {
                const [balanceUsdt, allowanceUsdt, balanceUsdb, allowanceUsdb] = data;
                return {
                    balanceUsdt: new BigNumber(formatEther(balanceUsdt.result as string)).decimalPlaces(5, 1).toString(),
                    allowanceUsdt: allowanceUsdt.result,
                    balanceUsdb: new BigNumber(formatEther(balanceUsdb.result as string)).decimalPlaces(5, 1).toString(),
                    allowanceUsdb: allowanceUsdb.result
                }
            }
        }
    });

    const allowance = React.useMemo(() => {
        if (resultToken.status === "pending" || !resultToken.data) return 0;
        return formToken.type === "buy" ? resultToken.data.allowanceUsdt : resultToken.data.balanceUsdb;
    }, [formToken.type, resultToken]);

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
            const stringify = JSON.stringify(error);
            const parseError = JSON.parse(stringify);
            console.log(parseError)
            handleNotificationError(parseError?.shortMessage)
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
            const stringify = JSON.stringify(error);
            const parseError = JSON.parse(stringify);
            console.log(parseError)
            handleNotificationError(parseError?.shortMessage)
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
            const stringify = JSON.stringify(error);
            const parseError = JSON.parse(stringify);
            console.log(parseError)
            handleNotificationError(parseError?.shortMessage)
            setLoading(false);
        }
    }, [handleNotificationError, handleNotificationSuccess, queryClient, contractAsync]);

    const handleSwap = () => {
        const newData = [...arrayToken];
        setArrayToken(newData.reverse());
    };

    return {
        balanceOfUSDT: resultToken.data?.balanceUsdt || 0,
        balanceOfUSDB: resultToken.data?.balanceUsdb || 0,
        address: account.address,
        isPending: loading,
        allowance,
        formToken,
        toToken,
        loadingMintUSDT,
        handleApprove,
        handleBuy,
        handleSwap,
        handelMintUSDT
    }
}
