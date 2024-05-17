import { bscTestnetToken, opBNBTestnetToken } from "@/chain-id";
import { opBNBTestnet } from "viem/chains";

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
