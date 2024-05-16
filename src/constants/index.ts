import BigNumber from "bignumber.js";

export const NAME_TYPE_STAKE = "Stake";
export const NAME_TYPE_UN_STAKE = "Unstake";
export const NAME_TYPE_BUY = "Buy";
export const NAME_TYPE_SELL = "Sell";

export enum ChainId {
    OP_BNB = 5611,
    BSC_TESTNET = 97,
}

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

export function bigintReplacer(key: any, value: any) {
    return typeof value === "bigint" ? value.toString() : value;
}
