import { bscTestnetToken, opBNBTestnetToken } from "@/chain-id";
import { ChainId } from "@/constants";

export const renderTokenUsdt = (chainId: number) => {
    if (chainId === ChainId.OP_BNB) return opBNBTestnetToken.USDT;
    return bscTestnetToken.USDT;
};

export const renderTokenUsdb = (chainId: number) => {
    if (chainId === ChainId.OP_BNB) return opBNBTestnetToken.USDB;
    return bscTestnetToken.USDB;
};

export const renderTokenSusdb = (chainId: number) => {
    if (chainId === ChainId.OP_BNB) return opBNBTestnetToken.SUSDB;
    return bscTestnetToken.SUSDB;
};
