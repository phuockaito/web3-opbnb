import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@rainbow-me/rainbowkit/styles.css';


import {
    getDefaultConfig,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    opBNBTestnet,
    mainnet
} from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0
        },
    },
});


const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [opBNBTestnet, mainnet],
});


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider >
                    <App />
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    </React.StrictMode>,
)
