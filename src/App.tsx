import { DollarOutlined, SketchOutlined } from "@ant-design/icons";
import { Tabs } from "antd";

import { NavMenu, TabBuy, TabStake } from "@/components";

function App() {
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
        </>
    );
}

export default App;
