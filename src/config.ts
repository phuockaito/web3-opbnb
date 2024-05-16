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
    injectedWallet,
    rainbowWallet,
    safeWallet,
    walletConnectWallet,
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
            wallets: [rainbowWallet, walletConnectWallet, injectedWallet, safeWallet, coinbaseWallet],
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
    client({ chain }) {
        return createClient({
            chain,
            transport: http(undefined, {
                retryCount: 0,
            }),
        });
    },
});
