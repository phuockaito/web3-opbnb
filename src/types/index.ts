import { NAME_TYPE_BUY, NAME_TYPE_SELL, NAME_TYPE_STAKE, NAME_TYPE_UN_STAKE } from "@/constants";
import type { Address } from "viem";

export interface TokenType {
    name: string;
    address: Address;
    type: typeof NAME_TYPE_STAKE | typeof NAME_TYPE_UN_STAKE | typeof NAME_TYPE_BUY | typeof NAME_TYPE_SELL;
}

export interface TOKEN {
    name: string;
    address: Address;
    symbol: string;
    decimals: number;
}

export interface RenderTokenType {
    [token_name: string]: TOKEN;
}
