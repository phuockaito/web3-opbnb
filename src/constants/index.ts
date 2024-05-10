import BigNumber from "bignumber.js";

export const TOKEN_USDT = "0x799C7692010919983F0a6916bAfE1981054F314E";
export const TOKEN_USDB = "0x9449ff3E4d658018e183FD5aF304c14913bD8c25";
export const TOKEN_SUSDB = "0x115066a4CCCCc42055147F94C38126A54f2F5fda";
export const NAME_TYPE_STAKE = "stake";
export const NAME_TYPE_BUY = "buy";
export const NAME_TYPE_SELL = "sell";
export const NAME_TYPE_UN_STAKE = "unstake";

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
