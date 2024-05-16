import React from "react";

import ReactDOM from "react-dom/client";

import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { opBNBTestnet } from "viem/chains";
import { WagmiProvider } from "wagmi";

import { walletConfig } from "@/config";

import App from "./App";

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
        <WagmiProvider config={walletConfig}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider coolMode initialChain={opBNBTestnet}>
                    <div className="max-w-6xl p-5 m-auto">
                        <App />
                    </div>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    </React.StrictMode>
);
