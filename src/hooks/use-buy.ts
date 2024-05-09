/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { useAccount, useReadContracts, useWriteContract } from 'wagmi';
import BigNumber from 'bignumber.js';
import { useQueryClient } from '@tanstack/react-query';
import { maxUint256 } from 'viem';
import { formatEther } from 'ethers';

import { abiUSDB, abiUSDT } from '../abi';
import { NAME_TYPE_BUY, NAME_TYPE_SELL, TOKEN_USDB, TOKEN_USDT } from '../constants';
import { useNotification } from './use-notification';
import { publicClient } from '../client';
import { TOKENS } from '../types';

interface ResultTokenType {
    balance_USDT: string;
    allowance_USDT: unknown;
    balance_USDB: string;
    allowance_USDB: unknown;
}

const token_USDT: TOKENS = {
    name: "USDT",
    address: TOKEN_USDT,
    type: NAME_TYPE_BUY
}

const token_USDB: TOKENS = {
    name: "USDB",
    address: TOKEN_USDB,
    type: NAME_TYPE_SELL
}

export const useBuy = () => {
    const contractAsync = useWriteContract();
    const account = useAccount();
    const queryClient = useQueryClient()
    const { handleNotificationError, handleNotificationSuccess } = useNotification();
    const [loading, setLoading] = React.useState(false);
    const [loadingMintUSDT, setLoadingMintUSDT] = React.useState(false);

    const [arrayToken, setArrayToken] = React.useState<TOKENS[]>([token_USDT, token_USDB]);
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
                const [balance_USDT, allowance_USDT, balance_USDB, allowance_USDB] = data;
                return {
                    balance_USDT: new BigNumber(formatEther(balance_USDT.result as string)).decimalPlaces(5, 1).toString(),
                    allowance_USDT: allowance_USDT.result,
                    balance_USDB: new BigNumber(formatEther(balance_USDB.result as string)).decimalPlaces(5, 1).toString(),
                    allowance_USDB: allowance_USDB.result
                }
            }
        }
    });

    const allowance = React.useMemo(() => {
        if (resultToken.status === "pending" || !resultToken.data) return 0;
        return formToken.type === NAME_TYPE_BUY ? resultToken.data.allowance_USDT : resultToken.data.balance_USDB;
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
                handleNotificationSuccess(tx, `Mint ${amount} USDT successfully`)
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

    const handleBuySell = React.useCallback(async (amount: number, type: string, uti: string) => {
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
                handleNotificationSuccess(tx, `${type === NAME_TYPE_BUY ? "Buy" : "Sell"} ${amount} ${uti} successfully`)
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
        balanceOfUSDT: resultToken.data?.balance_USDT || 0,
        balanceOfUSDB: resultToken.data?.balance_USDB || 0,
        address: account.address,
        isPending: loading,
        allowance,
        formToken,
        toToken,
        loadingMintUSDT,
        handleApprove,
        handleBuySell,
        handleSwap,
        handelMintUSDT
    }
}
