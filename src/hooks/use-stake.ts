/* eslint-disable @typescript-eslint/no-explicit-any */
import * as  React from 'react'
import { useAccount, useReadContracts, useWriteContract } from 'wagmi';
import { TOKENS } from '../types';
import { NAME_TYPE_STAKE, NAME_TYPE_UN_STAKE, TOKEN_SUSDB, TOKEN_USDB } from '../constants';
import { abiSUSDB, abiUSDB } from '../abi';
import BigNumber from 'bignumber.js';
import { formatEther } from 'ethers';
import { useNotification } from './use-notification';
import { publicClient } from '../client';
import { useQueryClient } from '@tanstack/react-query';
import { maxUint256 } from 'viem';

interface ResultTokenType {
    balance_USDB: string;
    allowance_USDB: unknown;
    balance_SUSDB: string;
    allowance_SUSDB: unknown;
}

const token_USDB: TOKENS = {
    name: "USDB",
    address: TOKEN_USDB,
    type: NAME_TYPE_STAKE
}

const token_SUSDB: TOKENS = {
    name: "SUSDB",
    address: TOKEN_SUSDB,
    type: NAME_TYPE_UN_STAKE
}


export const useStake = () => {
    const queryClient = useQueryClient()
    const account = useAccount();
    const contractAsync = useWriteContract();
    const [arrayToken, setArrayToken] = React.useState<TOKENS[]>([token_USDB, token_SUSDB]);
    const [loading, setLoading] = React.useState(false);
    const { handleNotificationError, handleNotificationSuccess } = useNotification();


    const formToken = arrayToken[0];
    const toToken = arrayToken[1];

    const resultToken = useReadContracts({
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
                functionName: 'allowance',
                args: [account.address, TOKEN_SUSDB],
            },
            {
                abi: abiSUSDB,
                address: TOKEN_SUSDB,
                functionName: 'balanceOf',
                args: [account.address],
            },
            {
                abi: abiSUSDB,
                address: TOKEN_SUSDB,
                functionName: 'allowance',
                args: [account.address, TOKEN_USDB],
            },
        ],
        query: {
            enabled: !!account.address,
            select: (data): ResultTokenType => {
                const [balance_USDB, allowance_USDB, balance_SUSDB, allowance_SUSDB] = data;
                return {
                    balance_USDB: new BigNumber(formatEther(balance_USDB.result as string)).decimalPlaces(5, 1).toString(),
                    allowance_USDB: allowance_USDB.result,
                    balance_SUSDB: new BigNumber(formatEther(balance_SUSDB.result as string)).decimalPlaces(5, 1).toString(),
                    allowance_SUSDB: allowance_SUSDB.result
                }
            }
        }
    });

    const handleApprove = React.useCallback(async (token: string, spender: string) => {
        try {
            setLoading(true);
            const tx = await contractAsync.writeContractAsync({
                address: token as `0x${string}`,
                abi: abiUSDB,
                functionName: 'approve',
                args: [spender, maxUint256],
            });
            if (tx) {
                await publicClient.waitForTransactionReceipt({ hash: tx });
                queryClient.invalidateQueries();
                handleNotificationSuccess(tx, "Approve successfully")
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

    const handleStakeUnstake = React.useCallback(async (amount: number, type: string, uti: string) => {
        try {
            setLoading(true);
            const quantity = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(18)).toString();
            const tx = await contractAsync.writeContractAsync({
                address: TOKEN_SUSDB,
                abi: abiSUSDB,
                functionName: type,
                args: [quantity],
            });
            if (tx) {
                await publicClient.waitForTransactionReceipt({ hash: tx });
                await queryClient.invalidateQueries()
                handleNotificationSuccess(tx, `${type === NAME_TYPE_STAKE ? "Stake" : "Unstake"} ${amount} ${uti} successfully`)
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


    const allowance = React.useMemo(() => {
        if (resultToken.status === "pending" || !resultToken.data) return 0;
        return formToken.type === NAME_TYPE_STAKE ? resultToken.data.allowance_USDB : resultToken.data.allowance_SUSDB;
    }, [formToken.type, resultToken]);

    const handleSwap = () => {
        const newData = [...arrayToken];
        setArrayToken(newData.reverse());
    };

    return {
        address: account.address,
        isPending: loading,
        balanceOfUSDB: resultToken.data?.balance_USDB || 0,
        balanceOfSUSDB: resultToken.data?.balance_SUSDB || 0,
        formToken,
        toToken,
        resultToken,
        allowance,
        handleSwap,
        handleApprove,
        handleStakeUnstake
    }
}
