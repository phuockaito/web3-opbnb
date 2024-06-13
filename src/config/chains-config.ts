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

import { Chain } from "@rainbow-me/rainbowkit";

import { iconModeTestnet, iconOpBNBTestnet, iconZkSyncSepoliaTestnet } from "@/assets";
import { onusTestnet } from "@/chain";
import { ENVIRONMENTAL_CHAIN } from "@/constants";

const chain: [Chain, ...Chain[]] = [
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

export const chainConfig = chain.filter((i: Chain) => (ENVIRONMENTAL_CHAIN ? i.testnet : !i.testnet)) as [
    Chain,
    ...Chain[],
];
