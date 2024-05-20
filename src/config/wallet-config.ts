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
    safeWallet,
    walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

export const walletConfig = connectorsForWallets(
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
                rainbowWallet,
            ],
        },
    ],
    {
        appName: "My RainbowKit App",
        projectId: "YOUR_PROJECT_ID",
    }
);
