/* eslint-disable @typescript-eslint/no-explicit-any */
import { notification } from 'antd'
import React from 'react'
import { useWalletClient } from 'wagmi'

import { handleTruncateHex } from '../constants'

export const useNotification = () => {
    const walletClient = useWalletClient()

    const handleTx = React.useCallback((tx: string) => {
        if (!walletClient.data) return;
        return `${walletClient?.data?.chain?.blockExplorers?.default?.url}/tx/${tx}`;
    }, [walletClient]);

    const handleNotificationSuccess = React.useCallback((tx: string, message?: string) => {
        return notification["success"]({
            message: message || 'Notification Title',
            description:
                <a href={handleTx(tx)} target='_blank'>
                    {`Tx: ${handleTruncateHex(tx)}`}
                </a>
        })
    }, [handleTx]);

    const handleNotificationError = React.useCallback((error: any) => {
        return notification["error"]({
            message: 'Error',
            description: <div dangerouslySetInnerHTML={{ __html: error || "" }} />,
        })
    }, [])

    return {
        handleNotificationSuccess,
        handleNotificationError
    }
}
