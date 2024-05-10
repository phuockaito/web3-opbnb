import { Form, InputNumber } from "antd";
import BigNumber from "bignumber.js";

import { formatNumberPayment, NAME_TYPE_STAKE } from "@/constants";
import { useStake } from "@/hooks";

import { ButtonConnect } from "./button-connect";

import { MdOutlineSwapVert } from "react-icons/md";

export function TabStake() {
    const [form] = Form.useForm();

    const {
        formToken,
        toToken,
        balanceOfUSDB,
        balanceOfSUSDB,
        isPending,
        allowance,
        handleSwap,
        handleApprove,
        handleStakeUnStake,
    } = useStake();

    const balanceFormToken = formToken.name === "USDB" ? balanceOfUSDB : balanceOfSUSDB;
    const balanceToToken = toToken.name === "SUSDB" ? balanceOfSUSDB : balanceOfUSDB;

    const onFinish = async ({ amount }: { amount: number }) => {
        const isAllowance = new BigNumber(allowance as string).isGreaterThan(new BigNumber(amount));
        if (!isAllowance) {
            await handleApprove(formToken.address, toToken.address);
            await handleStakeUnStake(amount, formToken.type, formToken.name);
            form.resetFields();
        } else {
            await handleStakeUnStake(amount, formToken.type, formToken.name);
            form.resetFields();
        }
    };

    return (
        <div className="flex flex-col justify-center gap-5 mx-auto max-w-[400px]">
            <div className="px-6 py-5 border rounded-lg shadow-lg">
                <h1 className="text-2xl font-semibold text-center">
                    {formToken.type === NAME_TYPE_STAKE ? "Stake USDB" : "Unstake SUSDB"}
                </h1>
                <Form onFinish={onFinish} className="!mt-5" size="large" form={form} layout="vertical">
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
                                validator(_, value) {
                                    setFieldValue("USDB", value);
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <div className="grid gap-4">
                            <div className="flex items-center justify-between gap-10">
                                <div className="flex items-center gap-0.5">
                                    <p className="text-red-600">*</p>
                                    <h1>{formToken.name}</h1>
                                </div>
                                <p>{`Balance: ${formatNumberPayment(balanceFormToken)}`}</p>
                            </div>
                            <InputNumber max={balanceFormToken} placeholder="0" controls={false} className="!w-full" />
                        </div>
                    </Form.Item>
                    <div className="flex justify-center">
                        <MdOutlineSwapVert size={23} onClick={handleSwap} className="cursor-pointer" />
                    </div>
                    <div>
                        <div className="flex items-center justify-between gap-10 mb-2">
                            <p>{toToken.name}</p>
                            <p>{`Balance: ${formatNumberPayment(balanceToToken)}`}</p>
                        </div>
                        <Form.Item label="" name="USDB">
                            <InputNumber placeholder="0" disabled readOnly controls={false} className="!w-full" />
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <ButtonConnect
                            loading={isPending}
                            title={formToken.type === NAME_TYPE_STAKE ? "Stake" : "Unstake"}
                        />
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
