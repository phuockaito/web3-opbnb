import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { Button } from "antd";
import { useAccount } from "wagmi";

interface ButtonConnectType {
    title: string;
    loading: boolean;
}

export const ButtonConnect = ({ title, loading }: ButtonConnectType) => {
    const { address, chain } = useAccount();
    const { openConnectModal } = useConnectModal();
    const { openChainModal } = useChainModal();

    if (!address)
        return (
            <Button className="!w-full" onClick={openConnectModal} type="primary">
                Connect Wallet
            </Button>
        );
    if (!chain)
        return (
            <Button className="!w-full" onClick={openChainModal} type="primary" danger>
                Switch Network
            </Button>
        );
    return (
        <Button className="!w-full !capitalize" loading={loading} type="primary" htmlType="submit">
            {title}
        </Button>
    );
};
