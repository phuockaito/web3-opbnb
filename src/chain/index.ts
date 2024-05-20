import { Chain } from "@rainbow-me/rainbowkit";

import { iconOnusTestnet } from "@/assets";

export const onusTestnet: Chain = {
    id: 1945,
    name: "Onus Testnet",
    nativeCurrency: { name: "ONUS", symbol: "ONUS", decimals: 18 },
    rpcUrls: {
        public: {
            http: ["https://rpc-testnet.onuschain.io"],
        },
        default: {
            http: ["https://rpc-testnet.onuschain.io"],
        },
    },
    blockExplorers: {
        default: {
            name: "ONUSExplorer",
            url: "https://explorer-testnet.onuschain.io",
        },
    },
    testnet: true,
    iconUrl: iconOnusTestnet,
} as const;
