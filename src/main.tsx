import React from "react";

import ReactDOM from "react-dom/client";

import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";

import { BrowserRouter } from "react-router-dom";

import { WagmiProvider } from "wagmi";

import { opBNBTestnet } from "viem/chains";

import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { AuthCoreContextProvider } from "@particle-network/auth-core-modal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";

import { wagmiConfig } from "@/config";
import { Pages } from "@/pages";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,
            retry: 0,
        },
    },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
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
                            <Pages />
                            <Analytics />
                        </RainbowKitProvider>
                    </QueryClientProvider>
                </WagmiProvider>
            </AuthCoreContextProvider>
        </BrowserRouter>
    </React.StrictMode>
);
