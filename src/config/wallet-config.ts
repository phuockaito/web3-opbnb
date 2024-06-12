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
    metaMaskWallet,
    rainbowWallet,
    walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { particleGoogleWallet, particleTwitterWallet, particleWallet } from "../particle-wallet";
import { PROJECT_ID } from "@/constants";

export const walletConfig = connectorsForWallets(
    [
        {
            groupName: "Recommended",
            wallets: [metaMaskWallet, walletConnectWallet, coinbaseWallet],
        },
        {
            groupName: "Social network",
            wallets: [particleGoogleWallet, particleTwitterWallet, particleWallet],
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
                rainbowWallet,
            ],
        },
    ],
    {
        appName: "My RainbowKit App",
        projectId: PROJECT_ID,
    }
);
