import { NavMenu, TabBuy, TabStake } from "./components"
import { Tabs } from 'antd';
import { SketchOutlined, DollarOutlined } from '@ant-design/icons';


function App() {

    return (
        <>
            <NavMenu />
            <Tabs
                size="large"
                centered
                defaultActiveKey="1"
                items={
                    [
                        {
                            key: '1',
                            label: 'Buy',
                            children: <TabBuy />,
                            icon: <DollarOutlined />
                        },
                        {
                            key: '2',
                            label: 'Stake',
                            children: <TabStake />,
                            icon: <SketchOutlined />
                        },
                    ]
                } />
        </>
    )
}

export default App