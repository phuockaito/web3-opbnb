import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { bscTestnet, opBNBTestnet } from "viem/chains";

export const config = getDefaultConfig({
    appName: "My RainbowKit App",
    projectId: "YOUR_PROJECT_ID",
    chains: [opBNBTestnet, bscTestnet],
});
