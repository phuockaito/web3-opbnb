import { Chain } from "@rainbow-me/rainbowkit";
import { createClient, http } from "viem";
import { createConfig } from "wagmi";

import { chainConfig } from "./chains-config";
import { walletConfig } from "./wallet-config";

export const wagmiConfig = createConfig({
    chains: chainConfig.filter((i: Chain) => i.testnet) as [Chain, ...Chain[]],
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
