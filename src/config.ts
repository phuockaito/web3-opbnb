import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
    argentWallet,
    bifrostWallet,
    bitgetWallet,
    bitskiWallet,
    bitverseWallet,
    bloomWallet,
    coin98Wallet,
    coinbaseWallet,
    rainbowWallet,
    safeWallet,
    walletConnectWallet,
    metaMaskWallet
} from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http } from "@wagmi/core";
import { createClient } from "viem";
import {
    arbitrumGoerli,
    baseSepolia,
    blastSepolia,
    modeTestnet,
    opBNBTestnet,
    optimismGoerli,
    zkSyncSepoliaTestnet,
} from "viem/chains";

import { iconModeTestnet, iconOnusTestnet, iconOpBNBTestnet, iconZkSyncSepoliaTestnet } from "@/assets";
import { onusTestnet } from "@/chain";

const connectors = connectorsForWallets(
    [
        {
            groupName: "Recommended",
            wallets: [metaMaskWallet, walletConnectWallet, safeWallet, coinbaseWallet],
        },
        {
            groupName: "Others",
            wallets: [
                argentWallet,
                bitgetWallet,
                bifrostWallet,
                bitskiWallet,
                bitverseWallet,
                bloomWallet,
                coin98Wallet,
                rainbowWallet
            ],
        },
    ],
    {
        appName: "My RainbowKit App",
        projectId: "YOUR_PROJECT_ID",
    }
);

export const walletConfig = createConfig({
    chains: [
        {
            ...opBNBTestnet,
            iconUrl: iconOpBNBTestnet,
        },
        arbitrumGoerli,
        baseSepolia,
        blastSepolia,
        {
            ...modeTestnet,
            iconUrl: iconModeTestnet,
        },
        optimismGoerli,
        {
            ...zkSyncSepoliaTestnet,
            iconUrl: iconZkSyncSepoliaTestnet,
        },
        {
            ...onusTestnet,
            iconUrl: iconOnusTestnet,
        },
    ],
    connectors,
    ssr: true,
    multiInjectedProviderDiscovery: false,

    client({ chain }) {
        return createClient({
            chain,
            transport: http(undefined, {
                retryCount: 0,
            }),
        });
    },
});
