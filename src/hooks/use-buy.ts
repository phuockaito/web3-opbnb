import * as React from "react";

import { useQueryClient } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { formatEther } from "ethers";
import { maxUint256 } from "viem";
import type { Address } from "viem";
import { useAccount, useChainId, usePublicClient, useReadContracts, useWriteContract } from "wagmi";

import { abiUSDB, abiUSDT } from "@/abi";
import { walletConfig } from "@/config";
import { bigintReplacer, NAME_TYPE_BUY, NAME_TYPE_SELL } from "@/constants";
import type { TokenType } from "@/types";
import { renderTokenUsdb, renderTokenUsdt } from "@/utils";

import { useNotification } from "./use-notification";

interface ResultTokenType {
    balance_USDT: number;
    allowance_USDT: unknown;
    balance_USDB: number;
    allowance_USDB: unknown;
}

export const useBuy = () => {
    const publicClient = usePublicClient({ config: walletConfig });
    const contractAsync = useWriteContract({ config: walletConfig });
    const account = useAccount();
    const queryClient = useQueryClient();
    const { handleNotificationError, handleNotificationSuccess } = useNotification();
    const chainId = useChainId();

    const tokenUsdtRender = renderTokenUsdt(chainId);
    const tokenUsdbRender = renderTokenUsdb(chainId);

    const TOKEN_USDT = tokenUsdtRender.address;
    const TOKEN_USDB = tokenUsdbRender.address;

    const token_USDT: TokenType = {
        name: tokenUsdtRender.name,
        address: TOKEN_USDT,
        type: NAME_TYPE_BUY,
    };

    const token_USDB: TokenType = {
        name: tokenUsdbRender.name,
        address: TOKEN_USDB,
        type: NAME_TYPE_SELL,
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
                address: TOKEN_USDT,
                functionName: "balanceOf",
                args: [account.address],
            },
            {
                abi: abiUSDT,
                address: TOKEN_USDT,
                functionName: "allowance",
                args: [account.address, TOKEN_USDB],
            },
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
                args: [account.address, TOKEN_USDT],
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
                return {
                    balance_USDT: balanceUSDT,
                    allowance_USDT: allowanceUSDT,
                    balance_USDB: balanceUSDB,
                    allowance_USDB: allowanceUSDB,
                };
            },
        },
    });

    const allowance = React.useMemo(() => {
        if (resultToken.status === "pending" || !resultToken.data) return 0;
        return formToken.type === NAME_TYPE_BUY ? resultToken.data.allowance_USDT : resultToken.data.balance_USDB;
    }, [formToken.type, resultToken]);

    const handleApprove = React.useCallback(
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
        async (amount: number, type: string, uti: string) => {
            try {
                setLoading(true);
                const amountUSDT = new BigNumber(amount).multipliedBy(new BigNumber(10).pow(18)).toString();
                const tx = await contractAsync.writeContractAsync({
                    address: TOKEN_USDB,
                    abi: abiUSDB,
                    functionName: type.toLocaleLowerCase(),
                    args: [TOKEN_USDT, amountUSDT],
                });
                if (tx) {
                    // await walletConfig.getTransactionReceipt({ hash: tx });
                    await publicClient?.waitForTransactionReceipt({ hash: tx });
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
        [
            contractAsync,
            TOKEN_USDB,
            TOKEN_USDT,
            publicClient,
            queryClient,
            handleNotificationSuccess,
            handleNotificationError,
        ]
    );

    const handelMintUSDT = React.useCallback(
        async (amount: number) => {
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
            contractAsync,
            TOKEN_USDT,
            account.address,
            publicClient,
            queryClient,
            handleNotificationSuccess,
            handleNotificationError,
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
        tokenUsdtRender,
        tokenUsdbRender,
        handleApprove,
        handleBuySell,
        handleSwap,
        handelMintUSDT,
    };
};
