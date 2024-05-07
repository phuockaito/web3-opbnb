import BigNumber from "bignumber.js"

export const TOKEN_USDT = "0x799C7692010919983F0a6916bAfE1981054F314E"
export const TOKEN_USDB = "0x9449ff3E4d658018e183FD5aF304c14913bD8c25"
export const MAX_INT = "115792089237316195423570985008687907853269984665640564039457584007913129639935"
export const NUMBER_ALLOWANCE = "115792089237316195423570985008687907853269984665640564039457584007913129639935n"

export const formatNumberPayment = (price: number | string, minimum = 0, maximum = 0) => {
    if (!price) return 0;
    return Number(new BigNumber(price).decimalPlaces(5, 1).toString()).toLocaleString('en-US', { minimumFractionDigits: minimum, maximumFractionDigits: maximum })
}

export function handleTruncateHex(hexStr: any, keepFirst = 8, keepLast = 8) {
    if (!hexStr) return;
    if (hexStr.length < keepFirst + keepLast) {
        throw new Error("Hexadecimal string is too short.");
    }

    const firstPart = hexStr.substring(0, keepFirst);
    const lastPart = hexStr.substring(hexStr.length - keepLast);

    return `${firstPart}....${lastPart}`;
}
