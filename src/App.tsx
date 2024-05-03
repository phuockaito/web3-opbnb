/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConnectButton, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { Button, Form, InputNumber, notification } from 'antd';
import BigNumber from 'bignumber.js';

import { useAccount, useDisconnect, useReadContract, useWalletClient, useWriteContract } from 'wagmi'
import { abiUSDB, abiUSDT } from './abi';
import { useQueryClient } from '@tanstack/react-query';

const TOKEN_USDT = "0x799C7692010919983F0a6916bAfE1981054F314E"
const TOKEN_USDB = "0x9449ff3E4d658018e183FD5aF304c14913bD8c25"
const MAX_INT = "115792089237316195423570985008687907853269984665640564039457584007913129639935"
const NUMBER_ALLOWANCE = "115792089237316195423570985008687907853269984665640564039457584007913129639935n"
interface Props {
    USDB: number;
    USDT: number;
}

function App() {
    const { openConnectModal } = useConnectModal();
    const { disconnect } = useDisconnect()
    const { openChainModal } = useChainModal();

    const result = useWalletClient()
    const queryClient = useQueryClient()
    const account = useAccount();

    const [form] = Form.useForm<Props>();

    const allowance = useReadContract({
        abi: abiUSDT,
        address: TOKEN_USDT,
        functionName: 'allowance',
        args: [account.address, TOKEN_USDB],
    })

    const {
        isPending,
        writeContractAsync
    } = useWriteContract()

    const onFinish = async ({ USDB }: Props) => {
        if (!allowance.data) {
            try {
                const tx = await writeContractAsync({
                    address: TOKEN_USDT,
                    abi: abiUSDT,
                    functionName: 'approve',
                    args: [TOKEN_USDB, MAX_INT],
                });
                if (tx) {
                    queryClient.setQueryData(allowance.queryKey, NUMBER_ALLOWANCE);
                    notification["success"]({
                        message: 'Notification Title',
                        description:
                            <a href={`${result.data?.chain.blockExplorers?.default.url}/tx/${tx}`} target='_blank'>
                                {`Tx: ${truncateHex(tx)}`}
                            </a>
                    })
                }
            } catch (error: any) {
                notification["error"]({
                    message: 'Notification Title',
                    description: <div dangerouslySetInnerHTML={{ __html: error || "" }} />,
                })
            }
        } else {
            const amountUSDT = new BigNumber(USDB).multipliedBy(new BigNumber(10).pow(18)).toString();
            try {
                const tx = await writeContractAsync({
                    address: TOKEN_USDB,
                    abi: abiUSDB,
                    functionName: "buy",
                    args: [TOKEN_USDT, amountUSDT],
                });
                if (tx) {
                    form.resetFields();
                    notification["success"]({
                        message: 'Notification Title',
                        description:
                            <a href={`${result.data?.chain.blockExplorers?.default.url}/tx/${tx}`} target='_blank'>
                                {`Tx: ${truncateHex(tx)}`}
                            </a>
                    })
                }
            } catch (error: any) {
                notification["error"]({
                    message: 'Notification Title',
                    description: <div dangerouslySetInnerHTML={{ __html: error || "" }} />,
                })
            }
        }
    }

    const handleResetAllowance = async () => {
        const tx = await writeContractAsync({
            address: TOKEN_USDT,
            abi: abiUSDT,
            functionName: 'approve',
            args: [TOKEN_USDB, 0],
        });
        if (tx) {
            queryClient.setQueryData(allowance.queryKey, 0)
        }
    }

    return (
        <div className='max-w-6xl p-5 m-auto'>
            <div className='float-right'>
                <ConnectButton
                    showBalance={false}
                    accountStatus={{
                        smallScreen: 'avatar',
                        largeScreen: 'full',
                    }}
                />
            </div>
            <div className='flex flex-col justify-center min-h-screen gap-5 mx-auto max-w-44 '>
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout='vertical'
                >
                    <Form.Item
                        label="USDT"
                        name="USDT"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your USDT!',
                            },
                            ({ setFieldValue }) => ({
                                validator(_, value) {
                                    setFieldValue("USDB", value)
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <InputNumber controls={false} />
                    </Form.Item>
                    <Form.Item
                        label="USDB"
                        name="USDB"
                    >
                        <InputNumber readOnly controls={false} />
                    </Form.Item>
                    <Form.Item>
                        {
                            !account.address
                                ? <Button onClick={openConnectModal} type="primary"> Connect Wallet</Button>
                                : <div className='flex gap-5'>
                                    <Button
                                        loading={isPending}
                                        type="primary" htmlType="submit">
                                        {
                                            !allowance.data ? "Approve" : "Buy"
                                        }
                                    </Button>
                                    <Button type="primary" danger onClick={() => disconnect()}>
                                        Disconnect
                                    </Button>
                                    <Button onClick={openChainModal}>
                                        Switch Networks
                                    </Button>
                                </div>
                        }

                    </Form.Item>
                </Form>
                {
                    allowance.data ?
                        <Button loading={isPending} type="primary" htmlType="submit" onClick={handleResetAllowance}>
                            reset allowance
                        </Button>
                        : ""
                }
            </div>
        </div>
    )
}

export default App

function truncateHex(hexStr: any, keepFirst = 8, keepLast = 8) {
    if (!hexStr) return;
    if (hexStr.length < keepFirst + keepLast) {
        throw new Error("Hexadecimal string is too short.");
    }

    const firstPart = hexStr.substring(0, keepFirst);
    const lastPart = hexStr.substring(hexStr.length - keepLast);

    return `${firstPart}....${lastPart}`;
}
