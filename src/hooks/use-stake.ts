import * as React from "react";

import { useQueryClient } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { formatEther } from "ethers";
import { maxUint256 } from "viem";
import type { Address } from "viem";
import { useAccount, useChainId, usePublicClient, useReadContracts, useWriteContract } from "wagmi";

import { abiSUSDB, abiUSDB } from "@/abi";
import { walletConfig } from "@/config";
import { bigintReplacer, NAME_TYPE_STAKE, NAME_TYPE_UN_STAKE } from "@/constants";
import type { TokenType } from "@/types";
import { renderTokenSusdb, renderTokenUsdb } from "@/utils";

import { useNotification } from "./use-notification";

interface ResultTokenType {
    balance_USDB: number;
    allowance_USDB: unknown;
    balance_SUSDB: number;
    allowance_SUSDB: unknown;
}

export const useStake = () => {
    const publicClient = usePublicClient({ config: walletConfig });
    const contractAsync = useWriteContract({ config: walletConfig });
    const queryClient = useQueryClient();
    const account = useAccount();
    const chainId = useChainId();

    const tokenUsdbRender = renderTokenUsdb(chainId);
    const tokenSusdbRender = renderTokenSusdb(chainId);

    const TOKEN_SUSDB = tokenSusdbRender.address;
    const TOKEN_USDB = tokenUsdbRender.address;

    const token_USDB: TokenType = {
        name: tokenUsdbRender.name,
        address: TOKEN_USDB,
        type: NAME_TYPE_STAKE,
    };

    const token_SUSDB: TokenType = {
        name: tokenSusdbRender.name,
        address: TOKEN_SUSDB,
        type: NAME_TYPE_UN_STAKE,
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
                address: TOKEN_USDB,
                functionName: "balanceOf",
                args: [account.address],
            },
            {
                abi: abiUSDB,
                address: TOKEN_USDB,
                functionName: "allowance",
                args: [account.address, TOKEN_SUSDB],
            },
            {
                abi: abiSUSDB,
                address: TOKEN_SUSDB,
                functionName: "balanceOf",
                args: [account.address],
            },
            {
                abi: abiSUSDB,
                address: TOKEN_SUSDB,
                functionName: "allowance",
                args: [account.address, TOKEN_USDB],
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
                return {
                    balance_USDB: balanceUSDB,
                    allowance_USDB: allowanceUSDB,
                    balance_SUSDB: balanceSUSDB,
                    allowance_SUSDB: allowanceSUSDB,
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
                    await publicClient.waitForTransactionReceipt({ hash: tx });
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
        async (amount: number, type: string, uti: string) => {
            try {
                setLoading(true);
                const quantity = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(18)).toString();
                const tx = await contractAsync.writeContractAsync({
                    address: TOKEN_SUSDB,
                    abi: abiSUSDB,
                    functionName: type.toLocaleLowerCase(),
                    args: [quantity],
                });
                if (tx) {
                    await publicClient.waitForTransactionReceipt({ hash: tx });
                    await queryClient.invalidateQueries();
                    handleNotificationSuccess(tx, `${type} ${amount} ${uti} successfully`);
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
        [contractAsync, TOKEN_SUSDB, publicClient, queryClient, handleNotificationSuccess, handleNotificationError]
    );

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
        tokenSusdbRender,
        tokenUsdbRender,
        handleSwap,
        handleApprove,
        handleStakeUnStake,
    };
};
