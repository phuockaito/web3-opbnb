import { Chain } from "@rainbow-me/rainbowkit";
import {
    arbitrumGoerli,
    baseSepolia,
    blastSepolia,
    bsc,
    mainnet,
    modeTestnet,
    opBNBTestnet,
    optimismGoerli,
    zkSyncSepoliaTestnet,
} from "viem/chains";

import { iconModeTestnet, iconOpBNBTestnet, iconZkSyncSepoliaTestnet } from "@/assets";
import { onusTestnet } from "@/chain";

export const chainConfig: [Chain, ...Chain[]] = [
    {
        ...opBNBTestnet,
        iconUrl: iconOpBNBTestnet,
    },
    {
        ...arbitrumGoerli,
        rpcUrls: {
            default: {
                http: ["https://arbitrum-goerli.public.blastapi.io"],
            },
        },
    },
    baseSepolia,
    blastSepolia,
    {
        ...modeTestnet,
        iconUrl: iconModeTestnet,
    },
    {
        ...optimismGoerli,
        rpcUrls: {
            default: {
                http: ["https://optimism-goerli.public.blastapi.io"],
            },
        },
    },
    {
        ...zkSyncSepoliaTestnet,
        iconUrl: iconZkSyncSepoliaTestnet,
    },
    onusTestnet,
    mainnet,
    bsc,
] as const;
