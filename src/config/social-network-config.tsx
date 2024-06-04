import { createConnector as createWagmiConnector } from "wagmi";

import { opBNBTestnet } from "viem/chains";

import { CHAIN_NAMESPACES, UX_MODE, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";

import { Wallet, WalletDetailsParams } from "@rainbow-me/rainbowkit";

import { iconOpBNBTestnet } from "@/assets";

// get from https://dashboard.web3auth.io
const clientId = "BF7nCV5_tuyPbr0aqKJeHtysoiELBUBsdLxUAq0VFnhrcO17lKzw8LlrEEIHswBRviTPKTkEfaoMzemh0D7mjgs";

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x61",
    rpcTarget: opBNBTestnet.rpcUrls.default.http[0],
    displayName: opBNBTestnet.name,
    blockExplorerUrl: opBNBTestnet.blockExplorers.default.url,
    ticker: "OpBNB",
    tickerName: opBNBTestnet.name,
    logo: iconOpBNBTestnet,
};

const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

const web3AuthInstance = new Web3Auth({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.MAINNET,
    privateKeyProvider,
    uiConfig: {
        mode: "dark",
        useLogoLoader: true,
        logoLight: iconOpBNBTestnet,
        logoDark: iconOpBNBTestnet,
        defaultLanguage: "en",
        theme: {
            primary: "#768729",
        },
        uxMode: UX_MODE.REDIRECT,
        modalZIndex: "2147483647",
    },
});

export const socialNetworkConfig = (): Wallet => ({
    id: "web3auth",
    name: "Web3 Auth",
    rdns: "web3auth",
    iconUrl: "https://web3auth.io/images/web3authlog.png",
    iconBackground: "#fff",
    installed: true,
    downloadUrls: {},
    createConnector: (walletDetails: WalletDetailsParams) =>
        createWagmiConnector((config) => ({
            ...Web3AuthConnector({
                web3AuthInstance,
            })(config),
            ...walletDetails,
        })),
});
