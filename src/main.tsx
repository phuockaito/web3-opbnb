import React from "react";

import ReactDOM from "react-dom/client";

import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";

import { BrowserRouter } from "react-router-dom";

import { WagmiProvider } from "wagmi";

import { opBNBTestnet } from "viem/chains";

import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";

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
        </BrowserRouter>
    </React.StrictMode>
);
