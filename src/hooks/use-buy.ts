import * as React from "react";

import { useQueryClient } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { formatEther } from "ethers";
import { maxUint256 } from "viem";
import type { Address } from "viem";
import { useAccount, useChainId, usePublicClient, useReadContracts, useWriteContract } from "wagmi";

import { abiUSDB, abiUSDT } from "@/abi";
import { wagmiConfig } from "@/config";
import { bigintReplacer, NAME_METHOD_BUY, NAME_METHOD_SELL } from "@/constants";
import type { TokenType } from "@/types";
import { RENDER_TOKEN } from "@/utils";

import { useNotification } from "./use-notification";

interface ResultTokenType {
    balance_USDT: number;
    allowance_USDT: unknown;
    balance_USDB: number;
    allowance_USDB: unknown;
    messageError: string | undefined;
}

export const useBuy = () => {
    const publicClient = usePublicClient({ config: wagmiConfig });
    const contractAsync = useWriteContract({ config: wagmiConfig });

    const account = useAccount();
    const queryClient = useQueryClient();
    const chainId = useChainId();

    const { handleNotificationError, handleNotificationSuccess } = useNotification();
    const renderToken = RENDER_TOKEN(chainId);

    const token_USDT: TokenType = {
        name: renderToken["USDT"].name,
        address: renderToken["USDT"].address,
        method: NAME_METHOD_BUY,
    };

    const token_USDB: TokenType = {
        name: renderToken["USDB"].name,
        address: renderToken["USDB"].address,
        method: NAME_METHOD_SELL,
    };

    const [loading, setLoading] = React.useState(false);
    const [loadingMintUSDT, setLoadingMintUSDT] = React.useState(false);
    const [arrayToken, setArrayToken] = React.useState<TokenType[]>([token_USDT, token_USDB]);

    const formToken = arrayToken[0];
    const toToken = arrayToken[1];

    const resultToken = useReadContracts({
        contracts: [
            {
                abi: abiUSDT,
                address: renderToken["USDT"].address,
                functionName: "balanceOf",
                args: [account.address],
            },
            {
                abi: abiUSDT,
                address: renderToken["USDT"].address,
                functionName: "allowance",
                args: [account.address, renderToken["USDB"].address],
            },
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
                args: [account.address, renderToken["USDT"].address],
            },
        ],
        query: {
            retry: 0,
            enabled: !!account.address,
            select: (data): ResultTokenType => {
                const [balance_USDT, allowance_USDT, balance_USDB, allowance_USDB] = data;
                const balanceUSDT =
                    balance_USDT.status === "success"
                        ? new BigNumber(formatEther(balance_USDT.result as string)).decimalPlaces(5, 1).toNumber()
                        : 0;
                const balanceUSDB =
                    balance_USDB.status === "success"
                        ? new BigNumber(formatEther(balance_USDB.result as string)).decimalPlaces(5, 1).toNumber()
                        : 0;
                const allowanceUSDT = allowance_USDT.status === "success" ? allowance_USDT.result : "0";
                const allowanceUSDB = allowance_USDB.status === "success" ? allowance_USDB.result : "0";

                const filterError = data.find((i) => i.error);
                const stringify = JSON.stringify(filterError?.error || "", bigintReplacer);
                const parseError = JSON.parse(stringify);

                return {
                    balance_USDT: balanceUSDT,
                    allowance_USDT: allowanceUSDT,
                    balance_USDB: balanceUSDB,
                    allowance_USDB: allowanceUSDB,
                    messageError: parseError?.shortMessage,
                };
            },
        },
    });

    const allowance: unknown = React.useMemo(() => {
        if (resultToken.status === "pending" || !resultToken.data) return 0;
        return formToken.method === NAME_METHOD_BUY ? resultToken.data.allowance_USDT : resultToken.data.balance_USDB;
    }, [formToken.method, resultToken]);

    const handleApprove: (token: Address, spender: Address) => Promise<boolean> = React.useCallback(
        async (token: Address, spender: Address) => {
            try {
                setLoading(true);
                const tx = await contractAsync.writeContractAsync({
                    address: token,
                    abi: abiUSDT,
                    functionName: "approve",
                    args: [spender, maxUint256],
                });
                if (tx) {
                    await publicClient?.waitForTransactionReceipt({ hash: tx });
                    queryClient.invalidateQueries();
                    handleNotificationSuccess(tx, "Approve success");
                }
                setLoading(false);
                return false;
            } catch (error: any) {
                setLoading(false);
                const stringify = JSON.stringify(error, bigintReplacer);
                const parseError = JSON.parse(stringify);
                handleNotificationError(parseError?.shortMessage);
                console.log(parseError);
                return true;
            }
        },
        [contractAsync, publicClient, queryClient, handleNotificationSuccess, handleNotificationError]
    );

    const handleBuySell = React.useCallback(
        async (amount: number, method: typeof NAME_METHOD_BUY | typeof NAME_METHOD_SELL, symbol: string) => {
            try {
                setLoading(true);
                const amountUSDT = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(18)).toString();
                const tx = await contractAsync.writeContractAsync({
                    address: renderToken["USDB"].address,
                    abi: abiUSDB,
                    functionName: method.toLocaleLowerCase(),
                    args: [renderToken["USDT"].address, amountUSDT],
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
        [contractAsync, handleNotificationError, handleNotificationSuccess, publicClient, queryClient, renderToken]
    );

    const handelMintUSDT = React.useCallback(
        async (amount: number) => {
            try {
                setLoadingMintUSDT(true);
                const amountUSDT = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(18)).toString();
                const tx = await contractAsync.writeContractAsync({
                    address: renderToken["USDT"].address,
                    abi: abiUSDT,
                    functionName: "mint",
                    args: [account.address, amountUSDT],
                });
                if (tx) {
                    await publicClient?.waitForTransactionReceipt({ hash: tx });
                    await queryClient.invalidateQueries();
                    handleNotificationSuccess(tx, `Mint ${amount} USDT successfully`);
                }
                setLoadingMintUSDT(false);
            } catch (error: any) {
                const stringify = JSON.stringify(error, bigintReplacer);
                const parseError = JSON.parse(stringify);
                handleNotificationError(parseError?.shortMessage);
                console.log(parseError);
                setLoadingMintUSDT(false);
            }
        },
        [
            account.address,
            contractAsync,
            handleNotificationError,
            handleNotificationSuccess,
            publicClient,
            queryClient,
            renderToken,
        ]
    );
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
        handelMintUSDT,
        messageError: resultToken.data?.messageError,
        renderToken,
    };
};
