import * as React from "react";

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
import { ConfigProvider, notification } from "antd";

import { iconLogo } from "@/assets";
import { themeAntd, wagmiConfig } from "@/config";
import { particleWagmiWallet } from "@/particle-wallet";

import { APP_ID, CLIENT_KEY, INITIAL_CHAIN, PROJECT_ID } from "./constants";

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

    React.useEffect(() => {
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

    React.useEffect(() => {
        const handleOnline = () => {
            notification.success({
                message: "Success",
                description: "You are now online",
                key: "success",
                placement: "bottomRight"
            })
        }
        const handleOffline = () => {
            notification.error({
                message: "Error",
                description: "Please check your internet connection",
                key: "error",
                placement: "bottomRight"
            })
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, []);

    return <ConfigProvider theme={themeAntd}>{children}</ConfigProvider>;
};
