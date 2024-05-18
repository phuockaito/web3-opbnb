import { opBNBTestnet } from "viem/chains";

import { bscTestnetToken, opBNBTestnetToken } from "@/chain-id";
import type { RenderTokenType } from "@/types";

export const RENDER_TOKEN = (chainId: number): RenderTokenType => {
    switch (chainId) {
        case opBNBTestnet.id:
            return opBNBTestnetToken;
        default:
            return bscTestnetToken;
    }
};
