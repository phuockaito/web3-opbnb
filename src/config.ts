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
import { opBNBTestnet } from "viem/chains";

import { iconOpBNBTestnet } from "./assets";

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

export const config = createConfig({
    chains: [
        {
            ...opBNBTestnet,
            iconUrl: iconOpBNBTestnet,
        },
    ],
    connectors,
    client({ chain }) {
        return createClient({ chain, transport: http() });
    },
});
