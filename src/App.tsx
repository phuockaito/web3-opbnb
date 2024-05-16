import React from "react";

import { DollarOutlined, SketchOutlined } from "@ant-design/icons";
import { Tabs, Typography } from "antd";
import { FaGithub } from "react-icons/fa";
import { NavMenu, TabBuy, TabStake } from "@/components";

function App() {
    const [expanded, setExpanded] = React.useState(false);

    return (
        <>
            <NavMenu />
            <Tabs
                size="large"
                centered
                defaultActiveKey="1"
                items={[
                    {
                        key: "1",
                        label: "Buy",
                        children: <TabBuy />,
                        icon: <DollarOutlined />,
                    },
                    {
                        key: "2",
                        label: "Stake",
                        children: <TabStake />,
                        icon: <SketchOutlined />,
                    },
                ]}
            />
            <div className="flex justify-center py-4">
                <a href="https://github.com/phuockaito/web3-opbnb" target="_blank">
                    <FaGithub size={25} />
                </a>
            </div>
            <div>
                <Typography.Paragraph
                    title="title"
                    ellipsis={{
                        rows: 2,
                        expandable: "collapsible",
                        expanded,
                        symbol: (expanded: boolean) => (expanded ? "Ẩn bớt" : "Xem thêm"),
                        onExpand: (_, info) => setExpanded(info.expanded),
                    }}
                >
                    <Typography.Text className="text-base text-justify">
                        Ethena is a synthetic dollar protocol built on Ethereum that provides a crypto-native solution
                        for money not reliant on traditional banking system infrastructure, alongside a globally
                        accessible dollar denominated instrument - the 'Internet Bond'.
                    </Typography.Text>
                    <Typography.Text className="inline-block pt-2 text-base text-justify">
                        Ethena's synthetic dollar, USDe, provides the crypto-native, scalable solution for money
                        achieved by delta-hedging Ethereum and Bitcoin collateral. USDe is fully-backed (subject to the
                        discussion in the Risks section regarding events potentially resulting in loss of backing) and
                        free to compose throughout CeFi & DeFi.{" "}
                    </Typography.Text>
                    <Typography.Text className="inline-block pt-2 text-base text-justify">
                        USDe peg stability is supported through the use of delta hedging derivatives positions against
                        protocol-held collateral.
                    </Typography.Text>
                    <Typography.Text className="pt-2 text-base text-justify">
                        The 'Internet Bond' combines yield derived from staked assets (e.g., staked Ethereum), to the
                        extent used as backing assets, as well as the funding & basis spread from perpetual and futures
                        markets, to create the first onchain crypto-native solution for money.
                    </Typography.Text>
                </Typography.Paragraph>
            </div>
        </>
    );
}

export default App;
