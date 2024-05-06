import * as React from 'react'
import { useAccount, useReadContracts, useWaitForTransactionReceipt, useWalletClient, useWriteContract } from 'wagmi';
import { abiUSDB, abiUSDT } from '../abi';
import { formatNumberPayment, MAX_INT, TOKEN_USDB, TOKEN_USDT } from '../constants';
import BigNumber from 'bignumber.js';
import { useQueryClient } from '@tanstack/react-query';
import { useNotification } from './use-notification';
import { publicClient } from '../client';
import { getContract } from 'viem';

export const useBuy = () => {
    const { handleNotificationError, handleNotificationSuccess } = useNotification();
    const account = useAccount();
    const queryClient = useQueryClient()
    const walletClient = useWalletClient()
    const [loading, setLoading] = React.useState(false);

    const contract = getContract({ address: TOKEN_USDT, abi: abiUSDT, client: publicClient });


    const { data: resultBalanceOfUSDT, status } = useReadContracts({
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

    const resultBalanceOfUSDB = useReadContracts({
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
        ],
        query: {
            enabled: !!account.address,
        }
    });

    const { writeContractAsync } = useWriteContract();

    const balanceOfUSDT = React.useMemo(() => {
        if (status === "pending" || !resultBalanceOfUSDT?.length) return 0;
        const [balance, decimals] = resultBalanceOfUSDT;
        const amountUSDT = new BigNumber(balance.result as string).dividedBy(new BigNumber(10).pow(decimals.result as string)).toString();
        return amountUSDT;
    }, [status, resultBalanceOfUSDT]);

    const balanceOfUSDB = React.useMemo(() => {
        if (resultBalanceOfUSDB.status === "pending" || !resultBalanceOfUSDB.data?.length) return 0;
        const [balance, decimals] = resultBalanceOfUSDB.data;
        const amountUSDT = new BigNumber(balance.result as string).dividedBy(new BigNumber(10).pow(decimals.result as string)).toString();
        return amountUSDT;
    }, [status, resultBalanceOfUSDT]);

    const allowance = React.useMemo(() => {
        if (status === "pending" || !resultBalanceOfUSDT?.length) return 0;
        return resultBalanceOfUSDT[2].result;
    }, [status, resultBalanceOfUSDT]);

    const handleTx = React.useCallback((tx: string) => {
        if (!walletClient.data) return;
        return `${walletClient?.data?.chain?.blockExplorers?.default?.url}/tx/${tx}`;
    }, [walletClient]);

    const handleApprove = React.useCallback(async () => {
        try {
            setLoading(true);
            const tx = await writeContractAsync({
                address: TOKEN_USDT,
                abi: abiUSDT,
                functionName: 'approve',
                args: [TOKEN_USDB, MAX_INT],
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
    }, []);

    const handleBuy = React.useCallback(async (amount: number) => {
        try {
            setLoading(true);
            const amountUSDT = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(18)).toString();
            const tx = await writeContractAsync({
                address: TOKEN_USDB,
                abi: abiUSDB,
                functionName: "buy",
                args: [TOKEN_USDT, amountUSDT],
            });
            if (tx) {
                await publicClient.waitForTransactionReceipt({ hash: tx });
                queryClient.invalidateQueries()
                handleNotificationSuccess(tx, `Buy ${amount} USDT success`)
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            handleNotificationError(error)
        }
    }, [])

    return {
        balanceOfUSDT: formatNumberPayment(balanceOfUSDT),
        balanceOfUSDB: formatNumberPayment(balanceOfUSDB),
        address: account.address,
        isPending: loading,
        allowance,
        writeContractAsync,
        handleTx,
        handleApprove,
        handleBuy
    }
}
