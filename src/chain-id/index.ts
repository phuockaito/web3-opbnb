export * from "./5611";
export * from "./97";

// export const getTokenChainId = async (chainId: number): Promise<Record<string, TOKEN>> => {
//     try {
//         const farms = (await import(`./${chainId}.ts`)).default;
//         return farms;
//     } catch (_) {
//         return {} as Record<string, TOKEN>;
//     }
// };
