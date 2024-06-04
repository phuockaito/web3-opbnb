import { useAccount } from "wagmi";

import { Button, Form, InputNumber } from "antd";
import BigNumber from "bignumber.js";

import { formatNumberPayment, NAME_METHOD_BUY, NAME_METHOD_SELL } from "@/constants";
import { useBuy } from "@/hooks";

import { ButtonConnect } from "./button-connect";

import { MdOutlineSwapVert } from "react-icons/md";

export function TabBuy() {
    const { chain } = useAccount();

    const {
        balanceOfUSDT,
        balanceOfUSDB,
        allowance,
        isPending,
        formToken,
        toToken,
        renderToken,
        handleSwap,
        handleApprove,
        handleBuySell,
        handelMintUSDT,
        loadingMintUSDT,
        messageError,
    } = useBuy();
    const [form] = Form.useForm();

    const onFinish = async ({ amount }: { amount: number }) => {
        const isAllowance = new BigNumber(allowance as string).isGreaterThan(new BigNumber(amount));
        const method = formToken.method as typeof NAME_METHOD_BUY | typeof NAME_METHOD_SELL;
        if (!isAllowance) {
            const error = await handleApprove(formToken.address, toToken.address);
            if (!error) {
                const errorBuySell = await handleBuySell(amount, method, formToken.name);
                if (!errorBuySell) {
                    form.resetFields();
                }
            }
        } else {
            const error = await handleBuySell(amount, method, formToken.name);
            if (!error) {
                form.resetFields();
            }
        }
    };

    const balanceFormToken = formToken.name === renderToken["USDT"].name ? balanceOfUSDT : balanceOfUSDB;
    const balanceToToken = toToken.name === renderToken["USDB"].name ? balanceOfUSDB : balanceOfUSDT;
    return (
        <div className="flex flex-col justify-center gap-5 mx-auto max-w-[400px]">
            <div className="px-6 py-5 border rounded-lg shadow-lg">
                <h1 className="text-2xl font-semibold text-center">
                    {formToken.method === NAME_METHOD_BUY
                        ? `${NAME_METHOD_BUY} ${renderToken["USDT"].name}`
                        : `${NAME_METHOD_SELL} ${renderToken["USDB"].name}`}
                </h1>
                <Form
                    disabled={isPending || !!messageError}
                    className="!mt-5"
                    size="large"
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        className=""
                        label=""
                        name="amount"
                        rules={[
                            {
                                required: true,
                                message: `Please input your ${formToken.name}!`,
                            },
                            ({ setFieldValue }) => ({
                                validator(_, value: number) {
                                    const amount = Number(value) > 99 ? 99 : value;
                                    setFieldValue("USDB", amount);
                                    setFieldValue("amount", amount);
                                    if (!balanceFormToken && value)
                                        return Promise.reject(new Error("Balance not enough!"));
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between gap-10">
                                <div className="flex items-center gap-0.5">
                                    <p className="text-red-600">*</p>
                                    <h1 className="font-semibold">{formToken.name}</h1>
                                </div>
                                <p>{`Balance: ${formatNumberPayment(balanceFormToken)}`}</p>
                            </div>
                            <InputNumber
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                                min={1}
                                max={99}
                                placeholder="0"
                                controls={false}
                                className="!w-full"
                            />
                        </div>
                    </Form.Item>
                    <div className="flex justify-center">
                        <MdOutlineSwapVert onClick={handleSwap} className="cursor-pointer" size={23} />
                    </div>
                    <div>
                        <div className="flex items-center justify-between gap-10 mb-2">
                            <h3 className="font-semibold">{toToken.name}</h3>
                            <p>{`Balance: ${formatNumberPayment(balanceToToken)}`}</p>
                        </div>
                        <Form.Item label="" name="USDB">
                            <InputNumber placeholder="0" readOnly disabled controls={false} className="!w-full" />
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <ButtonConnect loading={isPending} title={formToken.method} />
                                {messageError && (
                                    <p className="mt-2 text-xs font-medium text-red-600">{`Error: ${messageError}`}</p>
                                )}
                            </div>
                            <Button
                                onClick={() => handelMintUSDT(90)}
                                type="dashed"
                                disabled={!chain || isPending || !!messageError}
                                className="!w-full !capitalize"
                                loading={loadingMintUSDT}
                            >
                                Mint USDT
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
                <p className="text-base text-center">
                    Note: <span className="text-sm">Only active on opBNB Testnet</span>
                </p>
            </div>
        </div>
    );
}
