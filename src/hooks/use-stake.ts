import * as React from "react";

import { useAccount, useChainId, usePublicClient, useReadContracts, useWriteContract } from "wagmi";

import { maxUint256 } from "viem";
import type { Address } from "viem";

import { useQueryClient } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { formatEther } from "ethers";

import { abiSUSDB, abiUSDB } from "@/abi";
import { wagmiConfig } from "@/config";
import { NAME_METHOD_STAKE, NAME_METHOD_UN_STAKE } from "@/constants";
import type { TokenType } from "@/types";
import { bigintReplacer, RENDER_TOKEN } from "@/utils";

import { useNotification } from "./use-notification";

interface ResultTokenType {
    balance_USDB: number;
    allowance_USDB: unknown;
    balance_SUSDB: number;
    allowance_SUSDB: unknown;
    messageError: string | undefined;
}

export const useStake = () => {
    const publicClient = usePublicClient({ config: wagmiConfig });
    const contractAsync = useWriteContract({ config: wagmiConfig });
    const queryClient = useQueryClient();
    const account = useAccount();
    const chainId = useChainId();
    const renderToken = RENDER_TOKEN(chainId);

    const token_USDB: TokenType = {
        name: renderToken["USDB"].name,
        address: renderToken["USDB"].address,
        method: NAME_METHOD_STAKE,
    };

    const token_SUSDB: TokenType = {
        name: renderToken["SUSDB"].name,
        address: renderToken["SUSDB"].address,
        method: NAME_METHOD_UN_STAKE,
    };

    const [arrayToken, setArrayToken] = React.useState<TokenType[]>([token_USDB, token_SUSDB]);
    const [loading, setLoading] = React.useState(false);
    const { handleNotificationError, handleNotificationSuccess } = useNotification();

    const formToken = arrayToken[0];
    const toToken = arrayToken[1];

    const resultToken = useReadContracts({
        contracts: [
            {
                abi: abiUSDB,
                address: renderToken["USDB"].address,
                functionName: "balanceOf",
                args: [account.address],
            },
            {
                abi: abiUSDB,
                address: renderToken["USDB"].address,
                functionName: "allowance",
                args: [account.address, renderToken["SUSDB"].address],
            },
            {
                abi: abiSUSDB,
                address: renderToken["SUSDB"].address,
                functionName: "balanceOf",
                args: [account.address],
            },
            {
                abi: abiSUSDB,
                address: renderToken["SUSDB"].address,
                functionName: "allowance",
                args: [account.address, renderToken["SUSDB"].address],
            },
        ],
        query: {
            enabled: !!account.address,
            select: (data): ResultTokenType => {
                const [balance_USDB, allowance_USDB, balance_SUSDB, allowance_SUSDB] = data;
                const balanceUSDB =
                    balance_USDB.status === "success"
                        ? new BigNumber(formatEther(balance_USDB.result as string)).decimalPlaces(5, 1).toNumber()
                        : 0;
                const allowanceUSDB = allowance_USDB.status === "success" ? allowance_USDB.result : "0";
                const balanceSUSDB =
                    balance_SUSDB.status === "success"
                        ? new BigNumber(formatEther(balance_SUSDB.result as string)).decimalPlaces(5, 1).toNumber()
                        : 0;
                const allowanceSUSDB = allowance_SUSDB.status === "success" ? allowance_SUSDB.result : "0";

                const filterError = data.find((i) => i.error);
                const stringify = JSON.stringify(filterError?.error || "", bigintReplacer);
                const parseError = JSON.parse(stringify);

                return {
                    balance_USDB: balanceUSDB,
                    allowance_USDB: allowanceUSDB,
                    balance_SUSDB: balanceSUSDB,
                    allowance_SUSDB: allowanceSUSDB,
                    messageError: parseError?.shortMessage,
                };
            },
        },
    });

    const handleApprove = React.useCallback(
        async (token: Address, spender: Address) => {
            try {
                setLoading(true);
                const tx = await contractAsync.writeContractAsync({
                    address: token,
                    abi: abiUSDB,
                    functionName: "approve",
                    args: [spender, maxUint256],
                });
                if (tx) {
                    await publicClient?.waitForTransactionReceipt({ hash: tx });
                    queryClient.invalidateQueries();
                    handleNotificationSuccess(tx, "Approve successfully");
                }
                setLoading(false);
                return false;
            } catch (error: any) {
                setLoading(false);
                const stringify = JSON.stringify(error, bigintReplacer);
                const parseError = JSON.parse(stringify);
                console.log(parseError);
                handleNotificationError(parseError?.shortMessage);
                return true;
            }
        },
        [contractAsync, publicClient, queryClient, handleNotificationSuccess, handleNotificationError]
    );

    const handleStakeUnStake = React.useCallback(
        async (amount: number, method: typeof NAME_METHOD_STAKE | typeof NAME_METHOD_UN_STAKE, symbol: string) => {
            try {
                setLoading(true);
                const quantity = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(18)).toString();
                const tx = await contractAsync.writeContractAsync({
                    address: renderToken["SUSDB"].address,
                    abi: abiSUSDB,
                    functionName: method.toLocaleLowerCase(),
                    args: [quantity],
                });
                if (tx) {
                    await publicClient?.waitForTransactionReceipt({ hash: tx });
                    await queryClient.invalidateQueries();
                    handleNotificationSuccess(tx, `${method} ${amount} ${symbol} successfully`);
                }
                setLoading(false);
                return false;
            } catch (error: any) {
                const stringify = JSON.stringify(error, bigintReplacer);
                const parseError = JSON.parse(stringify);
                console.log(parseError);
                handleNotificationError(parseError?.shortMessage);
                setLoading(false);
                return true;
            }
        },
        [contractAsync, renderToken, publicClient, queryClient, handleNotificationSuccess, handleNotificationError]
    );

    const allowance = React.useMemo(() => {
        if (resultToken.status === "pending" || !resultToken.data) return 0;
        return formToken.method === NAME_METHOD_STAKE
            ? resultToken.data.allowance_USDB
            : resultToken.data.allowance_SUSDB;
    }, [formToken.method, resultToken]);

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
        renderToken,
        handleSwap,
        handleApprove,
        handleStakeUnStake,
        messageError: resultToken.data?.messageError,
    };
};
