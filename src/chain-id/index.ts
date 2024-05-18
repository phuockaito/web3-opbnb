import type { RenderTokenType } from "@/types";

export * from "./5611";
export * from "./97";

export const getTokenChainId = async (chainId: number): Promise<RenderTokenType> => {
    try {
        const farms = (await import(`./${chainId}.ts`)).default;
        return farms;
    } catch (_) {
        return {} as RenderTokenType;
    }
};
