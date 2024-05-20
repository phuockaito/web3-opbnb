import { createClient, http } from "viem";
import { createConfig } from "wagmi";

import { chainTestnet } from "@/chain/chain-testnet";

import { walletConfig } from "./wallet-config";

export const wagmiConfig = createConfig({
    chains: chainTestnet,
    connectors: walletConfig,
    ssr: true,
    multiInjectedProviderDiscovery: false,

    client({ chain }) {
        return createClient({
            chain,
            transport: http(undefined, {
                retryCount: 0,
            }),
        });
    },
});
