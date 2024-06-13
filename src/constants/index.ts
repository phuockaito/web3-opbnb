import { Chain, opBNBTestnet } from "viem/chains";

export type NAME_TOKEN_TYPE = "SUSDB" | "USDB" | "USDT";

export const INITIAL_CHAIN: Chain = opBNBTestnet;
export const NAME_METHOD_STAKE: string = "Stake";
export const NAME_METHOD_UN_STAKE: string = "Unstake";
export const NAME_METHOD_BUY: string = "Buy";
export const NAME_METHOD_SELL: string = "Sell";
export const ENVIRONMENTAL_CHAIN: boolean = true; // false: mainnet, true: testnet

export const PROJECT_ID: string = "82b3a1a0-ecb9-47af-a03d-1bfd44694b94";
export const CLIENT_KEY: string = "cdJPVDSGlMgBZgWeUnuYKC3JaQIWAIjn3Cjs6pmh";
export const APP_ID: string = "b7207178-6693-45f6-97eb-8384b9fd51f7";
