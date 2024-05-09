/* eslint-disable @typescript-eslint/no-explicit-any */
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Button, Form, InputNumber } from 'antd';

import { MdOutlineSwapVert } from "react-icons/md";
import BigNumber from 'bignumber.js';
import { formatNumberPayment, NAME_TYPE_BUY } from '../constants';
import { useBuy } from '../hooks';

export function TabBuy() {
    const { openConnectModal } = useConnectModal();
    const { balanceOfUSDT, balanceOfUSDB, allowance, address, isPending, formToken, toToken, handleSwap, handleApprove, handleBuySell, handelMintUSDT, loadingMintUSDT } = useBuy();
    const [form] = Form.useForm();

    const onFinish = async ({ amount }: any) => {
        const isAllowance = new BigNumber(allowance as string).isGreaterThan(new BigNumber(amount));
        if (!isAllowance) {
            await handleApprove(formToken.address, toToken.address)
            await handleBuySell(amount, formToken.type, formToken.name);
            form.resetFields();
        }
        else {
            await handleBuySell(amount, formToken.type, formToken.name);
            form.resetFields();
        }
    }

    const balanceFormToken = formToken.name === "USDT" ? balanceOfUSDT : balanceOfUSDB;
    const balanceToToken = toToken.name === "USDB" ? balanceOfUSDB : balanceOfUSDT;

    return (
        <div className='flex flex-col justify-center gap-5 mx-auto max-w-[400px]'>
            <div className='px-6 py-5 border rounded-lg shadow-lg'>
                <h1 className='text-2xl font-semibold text-center'>{formToken.type === NAME_TYPE_BUY ? "Buy USDT" : "Sell USDB"} </h1>
                <Form
                    disabled={isPending}
                    className='!mt-5'
                    size='large'
                    form={form}
                    onFinish={onFinish}
                    layout='vertical'
                >
                    <Form.Item
                        className=''
                        label=""
                        name="amount"
                        rules={[
                            {
                                required: true,
                                message: `Please input your ${formToken.name}!`,
                            },
                            ({ setFieldValue }) => ({
                                validator(_, value) {
                                    setFieldValue("USDB", value)
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <div className='grid gap-4'>
                            <div className='flex items-center justify-between gap-10'>
                                <div className='flex items-center gap-0.5'>
                                    <p className='text-red-600'>*</p>
                                    <h1>{formToken.name}</h1>
                                </div>
                                <p>{`Balance: ${formatNumberPayment(balanceFormToken)}`}</p>
                            </div>
                            <InputNumber
                                max={balanceFormToken}
                                placeholder='0'
                                controls={false}
                                className='!w-full'
                            />
                        </div>
                    </Form.Item>
                    <div className='flex justify-center'>
                        <MdOutlineSwapVert onClick={handleSwap} className='cursor-pointer' size={23} />
                    </div>
                    <div>
                        <div className='flex items-center justify-between gap-10 mb-2'>
                            <p>{toToken.name}</p>
                            <p>{`Balance: ${formatNumberPayment(balanceToToken)}`}</p>
                        </div>
                        <Form.Item
                            label=""
                            name="USDB"
                        >
                            <InputNumber placeholder='0' readOnly disabled controls={false} className='!w-full' />
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <div className='text-center'>
                            {
                                !address
                                    ? <Button className='!w-full' onClick={openConnectModal} type="primary"> Connect Wallet</Button>
                                    : <div className='flex flex-col gap-4'>
                                        <Button
                                            className='!w-full !capitalize'
                                            loading={isPending}
                                            type="primary" htmlType="submit"
                                        >
                                            {formToken.type}
                                        </Button>
                                        <Button
                                            onClick={() => handelMintUSDT(100)}
                                            type='dashed'
                                            className='!w-full !capitalize'
                                            loading={loadingMintUSDT}
                                        >
                                            Mint USDT
                                        </Button>
                                    </div>
                            }
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
