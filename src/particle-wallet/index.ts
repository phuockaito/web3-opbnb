import { createConnector } from "wagmi";

import type { Wallet, WalletDetailsParams } from "@rainbow-me/rainbowkit";

import { iconDiscord, iconFacebook, iconGithub, iconGmail, iconGoogle, iconLinkedin, iconTwitter } from "@/assets";

import { particleWagmiWallet } from "./particle-wagmi-wallet";

export const particleWallet = (): Wallet => ({
    id: "particle",
    name: "Email",
    iconUrl: async () => iconGmail,
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

export const particleFacebookWallet = (): Wallet => ({
    id: "particle_facebook",
    name: "Facebook",
    iconUrl: async () => iconFacebook,
    iconBackground: "#fff",
    installed: true,
    createConnector: (walletDetails: WalletDetailsParams) =>
        createConnector(
            (config) =>
                ({
                    ...particleWagmiWallet({ socialType: "facebook" })(config),
                    ...walletDetails,
                }) as any
        ),
});

export const particleDiscordWallet = (): Wallet => ({
    id: "particle_discord",
    name: "Discord",
    iconUrl: async () => iconDiscord,
    iconBackground: "#fff",
    installed: true,
    createConnector: (walletDetails: WalletDetailsParams) =>
        createConnector(
            (config) =>
                ({
                    ...particleWagmiWallet({ socialType: "discord" })(config),
                    ...walletDetails,
                }) as any
        ),
});

export const particleGithubWallet = (): Wallet => ({
    id: "particle_github",
    name: "Github",
    iconUrl: async () => iconGithub,
    iconBackground: "#fff",
    installed: true,
    createConnector: (walletDetails: WalletDetailsParams) =>
        createConnector(
            (config) =>
                ({
                    ...particleWagmiWallet({ socialType: "github" })(config),
                    ...walletDetails,
                }) as any
        ),
});

export const particleLinkedinWallet = (): Wallet => ({
    id: "particle_linkedin",
    name: "Linkedin",
    iconUrl: async () => iconLinkedin,
    iconBackground: "#fff",
    installed: true,
    createConnector: (walletDetails: WalletDetailsParams) =>
        createConnector(
            (config) =>
                ({
                    ...particleWagmiWallet({ socialType: "linkedin" })(config),
                    ...walletDetails,
                }) as any
        ),
});

export * from "./particle-wagmi-wallet";
