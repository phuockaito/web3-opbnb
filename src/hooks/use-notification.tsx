import { notification } from 'antd'
import React from 'react'
import { handleTruncateHex } from '../constants'

export const useNotification = () => {

    const handleNotificationSuccess = React.useCallback((tx: string, message?: string) => {
        return notification["success"]({
            message: message || 'Notification Title',
            description:
                <a href={`https://testnet.opbnbscan.com/tx/${tx}`} target='_blank'>
                    {`Tx: ${handleTruncateHex(tx)}`}
                </a>
        })
    }, []);

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
