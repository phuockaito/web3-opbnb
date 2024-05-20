import { Chain } from "@rainbow-me/rainbowkit";
import { bsc, mainnet } from "viem/chains";

export const chainMainnet: [Chain, ...Chain[]] = [mainnet, bsc];
