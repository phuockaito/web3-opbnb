import { useEffect } from "react";

import { useConnect, useDisconnect, WagmiProvider } from "wagmi";

import { opBNBTestnet } from "viem/chains";

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

import { wagmiConfig } from "./config";
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
                projectId: "82b3a1a0-ecb9-47af-a03d-1bfd44694b94",
                clientKey: "cdJPVDSGlMgBZgWeUnuYKC3JaQIWAIjn3Cjs6pmh",
                appId: "b7207178-6693-45f6-97eb-8384b9fd51f7",
                customStyle: {
                    zIndex: 2147483650, // must greater than 2147483646
                },
            }}
        >
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitProvider
                        initialChain={opBNBTestnet}
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
