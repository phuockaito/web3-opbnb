import { createConnector } from "wagmi";

import type { Wallet, WalletDetailsParams } from "@rainbow-me/rainbowkit";

import { iconGoogle, iconParticleWallet, iconTwitter } from "@/assets";

import { particleWagmiWallet } from "./particle-wagmi-wallet";

export const particleWallet = (): Wallet => ({
    id: "particle",
    name: "Particle Wallet",
    iconUrl: async () => iconParticleWallet,
    iconBackground: "#fff",
    installed: true,
    createConnector: (walletDetails: WalletDetailsParams) =>
        createConnector(
            (config) =>
                ({
                    ...particleWagmiWallet()(config),
                    ...walletDetails,
                }) as any
        ),
});

export const particleGoogleWallet = (): Wallet => ({
    id: "particle_google",
    name: "Google",
    iconUrl: async () => iconGoogle,
    iconBackground: "#fff",
    installed: true,
    createConnector: (walletDetails: WalletDetailsParams) =>
        createConnector(
            (config) =>
                ({
                    ...particleWagmiWallet({ socialType: "google" })(config),
                    ...walletDetails,
                }) as any
        ),
});

export const particleTwitterWallet = (): Wallet => ({
    id: "particle_twitter",
    name: "Twitter",
    iconUrl: async () => iconTwitter,
    iconBackground: "#fff",
    installed: true,
    createConnector: (walletDetails: WalletDetailsParams) =>
        createConnector(
            (config) =>
                ({
                    ...particleWagmiWallet({ socialType: "twitter" })(config),
                    ...walletDetails,
                }) as any
        ),
});

export * from "./particle-wagmi-wallet";
