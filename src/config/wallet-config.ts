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

import {
    particleDiscordWallet,
    particleFacebookWallet,
    particleGithubWallet,
    particleGoogleWallet,
    particleLinkedinWallet,
    particleTwitterWallet,
    particleWallet,
} from "../particle-wallet";

export const walletConfig = connectorsForWallets(
    [
        {
            groupName: "Recommended",
            wallets: [metaMaskWallet, walletConnectWallet, coinbaseWallet],
        },
        {
            groupName: "Social network",
            wallets: [
                particleWallet,
                particleGoogleWallet,
                particleTwitterWallet,
                particleFacebookWallet,
                particleDiscordWallet,
                particleGithubWallet,
                particleLinkedinWallet,
            ],
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
        projectId: "015aa01a4286450fd218f078b8da24bd",
    }
);
