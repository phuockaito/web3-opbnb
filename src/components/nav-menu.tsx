import { ConnectButton } from "@rainbow-me/rainbowkit";

import { iconLogo } from "@/assets";

export const NavMenu = () => {
    return (
        <div className="flex items-center justify-between gap-5">
            <img src={iconLogo} alt={iconLogo} />
            <ConnectButton />
        </div>
    );
};
