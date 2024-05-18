import { opBNBTestnet } from "viem/chains";

import { bscTestnetToken, opBNBTestnetToken } from "@/chain-id";
import { RenderTokenType } from "@/types";

export const renderTokenUsdt = (chainId: number) => {
    if (chainId === opBNBTestnet.id) return opBNBTestnetToken.USDT;
    return bscTestnetToken.USDT;
};

export const renderTokenUsdb = (chainId: number) => {
    if (chainId === opBNBTestnet.id) return opBNBTestnetToken.USDB;
    return bscTestnetToken.USDB;
};

export const renderTokenSusdb = (chainId: number) => {
    if (chainId === opBNBTestnet.id) return opBNBTestnetToken.SUSDB;
    return bscTestnetToken.SUSDB;
};

export const RENDER_TOKEN = (chainId: number): RenderTokenType => {
    switch (chainId) {
        case opBNBTestnet.id:
            return opBNBTestnetToken;
        default:
            return bscTestnetToken;
    }
};
