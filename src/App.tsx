/* eslint-disable @typescript-eslint/no-explicit-any */
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Button, Form, InputNumber } from 'antd';

import { NavMenu } from './components';
import { useBuy } from './hooks';
import { MdOutlineSwapVert } from "react-icons/md";
import BigNumber from 'bignumber.js';


function App() {
    const { openConnectModal } = useConnectModal();
    const { balanceOfUSDT, balanceOfUSDB, allowance, address, isPending, formToken, toToken, handleSwap, handleApprove, handleBuy } = useBuy();
    const [form] = Form.useForm();

    const onFinish = async ({ amount }: any) => {
        const isAllowance = new BigNumber(allowance as string).isGreaterThan(new BigNumber(amount));
        if (!isAllowance) {
            await handleApprove(formToken.address, toToken.address)
            await handleBuy(amount, formToken.type);
            form.resetFields();
        }
        else {
            await handleBuy(amount, formToken.type);
            form.resetFields();
        }
    }

    const balanceFormToken = formToken.name === "USDT" ? balanceOfUSDT : balanceOfUSDB;
    const balanceToToken = toToken.name === "USDB" ? balanceOfUSDB : balanceOfUSDT;

    return (
        <>
            <NavMenu />
            <div className='flex flex-col justify-center gap-5 mx-auto max-w-[400px] min-h-[80vh]'>
                <div className='px-5 py-6 border rounded-lg shadow-lg'>
                    <h1 className='text-xl font-medium text-center'>Buy USDb</h1>
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
                                    <p>{`Balance: ${balanceFormToken}`}</p>
                                </div>
                                <InputNumber placeholder='0' controls={false} className='!w-full' />
                            </div>
                        </Form.Item>
                        <div className='flex justify-center cursor-pointer'>
                            <MdOutlineSwapVert onClick={handleSwap} size={23} />
                        </div>
                        <div>
                            <div className='flex items-center justify-between gap-10 mb-2'>
                                <p>{toToken.name}</p>
                                <p>{`Balance: ${balanceToToken}`}</p>
                            </div>
                            <Form.Item
                                label=""
                                name="USDB"
                            >
                                <InputNumber placeholder='0' readOnly controls={false} className='!w-full' />
                            </Form.Item>
                        </div>
                        <Form.Item>
                            <div className='text-center'>
                                {
                                    !address
                                        ? <Button className='!w-full' onClick={openConnectModal} type="primary"> Connect Wallet</Button>
                                        : <Button className='!w-full !capitalize'
                                            loading={isPending}
                                            type="primary" htmlType="submit">
                                            {formToken.type}
                                        </Button>
                                }
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default App