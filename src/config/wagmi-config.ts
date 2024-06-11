import { createConfig } from "wagmi";

import { createClient, http } from "viem";

import { chainConfig } from "./chains-config";
import { walletConfig } from "./wallet-config";

export const wagmiConfig = createConfig({
    chains: chainConfig,
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
