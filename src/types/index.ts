import type { Address } from "viem";

import { NAME_METHOD_BUY, NAME_METHOD_SELL, NAME_METHOD_STAKE, NAME_METHOD_UN_STAKE, NAME_TOKEN_TYPE } from "@/constants";

export interface TokenType {
    name: string;
    address: Address;
    method: typeof NAME_METHOD_STAKE | typeof NAME_METHOD_UN_STAKE | typeof NAME_METHOD_BUY | typeof NAME_METHOD_SELL;
}

export interface TOKEN {
    name: string;
    address: Address;
    symbol: string;
    decimals: number;
}

export type RenderTokenType = {
    [K in NAME_TOKEN_TYPE]: TOKEN;
};
