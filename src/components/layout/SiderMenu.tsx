import { Layout, Menu } from "antd"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { RouteConfig } from "../../router"

const { Sider } = Layout;
const tabArr = RouteConfig.filter((v) => v.menus);

export const SiderMenu = () => {
    const location = useLocation();
    const [selectedKeys, setSelectedKeys] = useState<string[]>(['/']);

    const renderMenu = () => tabArr.map((v) => {
        let path = v.path;
        if (v.redirect) {
            path = v.redirect;
        }
        return (
            <Menu.Item key={v.path} title={v.label} onClick={() => { setSelectedKeys([v.path]) }} style={{ margin: 0 }}>
                <Link to={path}>{v.label}</Link>
            </Menu.Item>
        )
    });

    useEffect(() => {
        tabArr.forEach((v) => {
            if (`${location.pathname.split('/')[1]}` === v.path) {
                setSelectedKeys([v.path]);
            }
        });
    }, [location]);

    return (
        <Sider width="100" theme="light">
            <Menu mode="inline" theme="dark" selectedKeys={selectedKeys} className="fullHeight">
                {renderMenu()}
            </Menu>
        </Sider>
    );
}
