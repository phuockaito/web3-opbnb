import { opBNBTestnet } from "viem/chains";

import BigNumber from "bignumber.js";

import { onusTestnet } from "@/chain";
import { bscTestnetToken, onusTestnetToken, opBNBTestnetToken } from "@/chain-id";
import type { RenderTokenType } from "@/types";

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

export const formatNumberPayment = (price: number | string, minimum = 0, maximum = 0) => {
    if (!price) return 0;
    return Number(new BigNumber(price).decimalPlaces(5, 1).toString()).toLocaleString("en-US", {
        minimumFractionDigits: minimum,
        maximumFractionDigits: maximum,
    });
};

export function handleTruncateHex(hexStr: string, keepFirst = 12, keepLast = 12) {
    if (!hexStr) return;
    if (hexStr.length < keepFirst + keepLast) {
        throw new Error("Hexadecimal string is too short.");
    }

    const firstPart = hexStr.substring(0, keepFirst);
    const lastPart = hexStr.substring(hexStr.length - keepLast);
    return `${firstPart}....${lastPart}`;
}

export function bigintReplacer(_: any, value: any) {
    return typeof value === "bigint" ? value.toString() : value;
}
