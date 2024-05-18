import { Address } from "viem";

export interface TokenType {
    name: string;
    address: Address;
    type: string;
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
