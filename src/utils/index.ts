import { opBNBTestnet } from "viem/chains";

import { bscTestnetToken, onusTestnetToken, opBNBTestnetToken } from "@/chain-id";
import type { RenderTokenType } from "@/types";
import { onusTestnet } from "@/chain";

export const RENDER_TOKEN = (chainId: number): RenderTokenType => {
    switch (chainId) {
        case opBNBTestnet.id:
            return opBNBTestnetToken;
        case onusTestnet.id:
            return onusTestnetToken;
        default:
            return bscTestnetToken;
    }
};
