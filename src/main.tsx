import React from "react";

import ReactDOM from "react-dom/client";

import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { opBNBTestnet } from "viem/chains";
import { WagmiProvider } from "wagmi";

import { Pages } from "@/pages";

import { wagmiConfig } from "./config";

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
                    <RainbowKitProvider coolMode initialChain={opBNBTestnet}>
                        <Pages />
                    </RainbowKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </BrowserRouter>
    </React.StrictMode>
);
