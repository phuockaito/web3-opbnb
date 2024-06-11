import { useEffect } from "react";

import { useConnect, useDisconnect, WagmiProvider } from "wagmi";

import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";

import {
    AuthCoreEvent,
    getLatestAuthType,
    isSocialAuthType,
    particleAuth,
    type SocialAuthType,
} from "@particle-network/auth-core";
import { AuthCoreContextProvider, useConnect as useParticleConnect } from "@particle-network/auth-core-modal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";

import { iconLogo } from "@/assets";
import { chainConfig, wagmiConfig } from "@/config";

import { APP_ID, CLIENT_KEY, INITIAL_CHAIN, PROJECT_ID } from "./constants";
import { particleWagmiWallet } from "./particle-wallet/particle-wagmi-wallet";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,
            retry: 0,
        },
    },
});

export function ProvidersRainbowKit({ children }: { children: React.ReactNode }) {
    return (
        <AuthCoreContextProvider
            options={{
                projectId: PROJECT_ID,
                clientKey: CLIENT_KEY,
                appId: APP_ID,
                customStyle: {
                    zIndex: 2147483650,
                    logo: iconLogo,
                    projectName: "Web3 Authorization",
                    modalBorderRadius: 16,
                },
                wallet: {
                    visible: true, //show wallet entrance when connect success.
                    customStyle: {
                        supportChains: chainConfig,
                    },
                },
            }}
        >
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitProvider
                        initialChain={INITIAL_CHAIN}
                        theme={lightTheme({
                            borderRadius: "medium",
                            overlayBlur: "small",
                        })}
                    >
                        <SocialAuthConnect>{children}</SocialAuthConnect>
                        <Analytics />
                    </RainbowKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </AuthCoreContextProvider>
    );
}

const SocialAuthConnect = ({ children }: { children: React.ReactNode }) => {
    const { connect } = useConnect();
    const { connectionStatus } = useParticleConnect();
    const { disconnect } = useDisconnect();

    useEffect(() => {
        if (connectionStatus === "connected" && isSocialAuthType(getLatestAuthType())) {
            connect({
                connector: particleWagmiWallet({ socialType: getLatestAuthType() as SocialAuthType }),
            });
        }
        const onDisconnect = () => {
            disconnect();
        };
        particleAuth.on(AuthCoreEvent.ParticleAuthDisconnect, onDisconnect);
        return () => {
            particleAuth.off(AuthCoreEvent.ParticleAuthDisconnect, onDisconnect);
        };
    }, [connect, connectionStatus, disconnect]);

    return <>{children}</>;
};
