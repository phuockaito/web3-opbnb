import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Button, Form, InputNumber } from 'antd';

import { NavMenu } from './components';
import { useBuy } from './hooks';


interface Props {
    USDB: number;
    USDT: number;
}

function App() {
    const { openConnectModal } = useConnectModal();
    const { balanceOfUSDT, balanceOfUSDB, allowance, address, isPending, handleApprove, handleBuy } = useBuy();
    const [form] = Form.useForm<Props>();

    const onFinish = async ({ USDB }: Props) => {
        if (!allowance) {
            handleApprove()
        }
        else {
            await handleBuy(USDB);
            form.resetFields();
        };
    }

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
                            <div className='grid gap-4'>
                                <div className='flex items-center justify-between gap-10'>
                                    <div className='flex items-center gap-0.5'>
                                        <p className='text-red-600'>*</p>
                                        <h1>USDT</h1>
                                    </div>
                                    <p>{`Balance: ${balanceOfUSDT}`}</p>
                                </div>
                                <InputNumber placeholder='0' controls={false} className='!w-full' />
                            </div>
                        </Form.Item>
                        <div>
                            <div className='flex items-center justify-between gap-10 mb-2'>
                                <p>USDB</p>
                                <p>{`Balance: ${balanceOfUSDB}`}</p>
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
                                        : <Button className='!w-full'
                                            loading={isPending}
                                            type="primary" htmlType="submit">
                                            {
                                                !allowance ? "Approve" : "Buy"
                                            }
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