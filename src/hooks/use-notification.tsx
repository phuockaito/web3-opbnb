import React from "react";

import { useAccount } from "wagmi";

import { notification } from "antd";

import { handleTruncateHex } from "@/utils";

export const useNotification = () => {
    const { chain } = useAccount();

    const handleTx = React.useCallback(
        (tx: string) => {
            if (!chain) return;
            return `${chain.blockExplorers?.default.url}/tx/${tx}`;
        },
        [chain]
    );

    const handleNotificationSuccess = React.useCallback(
        (tx: string, message?: string) => {
            return notification["success"]({
                message: message || "Notification Title",
                placement: "topLeft",
                description: (
                    <a href={handleTx(tx)} target="_blank">
                        {`Tx: ${handleTruncateHex(tx)}`}
                    </a>
                ),
            });
        },
        [handleTx]
    );

    const handleNotificationError = React.useCallback((error: React.ReactNode) => {
        return notification["error"]({
            placement: "topLeft",
            message: "Error",
            description: <p>{error}</p>,
        });
    }, []);

    return {
        handleNotificationSuccess,
        handleNotificationError,
    };
};
