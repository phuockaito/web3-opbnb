import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, opBNBTestnet } from "viem/chains";

export const config = getDefaultConfig({
    appName: "My RainbowKit App",
    projectId: "YOUR_PROJECT_ID",
    chains: [opBNBTestnet, mainnet],
});
