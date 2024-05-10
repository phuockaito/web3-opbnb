import { TOKEN } from "@/types";

interface TokenMap {
    [key: string]: TOKEN;
}

export const opBNBTestnetToken: TokenMap = {
    SUSDB: {
        name: "SUSDB",
        address: "0x115066a4CCCCc42055147F94C38126A54f2F5fda",
        symbol: "SUSDB",
        decimals: 18,
    },
    USDB: {
        name: "USDB",
        address: "0x9449ff3E4d658018e183FD5aF304c14913bD8c25",
        symbol: "USDB",
        decimals: 18,
    },
    USDT: {
        name: "USDT",
        address: "0x799C7692010919983F0a6916bAfE1981054F314E",
        symbol: "USDT",
        decimals: 18,
    },
};

export default opBNBTestnetToken;
