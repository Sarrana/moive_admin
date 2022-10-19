import { Layout, Menu } from "antd"
import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { RouteConfig, RouteType } from "../../router"

const { Sider } = Layout;
const { SubMenu } = Menu;

export const SiderSubMenu = () => {
    const location = useLocation();
    const pathnameArr = location.pathname.split('/');
    const routeArr = RouteConfig.filter((v) => `${pathnameArr[1]}` == v.path);
    const menuArr = routeArr[0] ? routeArr[0].children : [];
    const [rootSubmenuKeys, setRootSubmenuKeys] = useState<string[]>(['']);
    const [openKeys, setOpenKeys] = useState<string[]>(['']);
    const [selectedKeys, setSelectedKeys] = useState<string[]>(['']);
    const [menuTreeNode, setMenuTreeNode] = useState<React.ReactElement[]>([null]);

    const renderMenu = (basePath: string, routeTable: RouteType[]) => {
        if (routeTable && routeTable.length) {
            return (routeTable.map((v) => {
                const newBasePath = `${basePath}/${v.path}`;
                if (v.submenus) {
                    if (v.next && v.children && v.children.length) {
                        rootSubmenuKeys.push(v.path);
                        setRootSubmenuKeys(Array.from(new Set(rootSubmenuKeys)));
                        if (`${pathnameArr[2]}` === v.path) {
                            setOpenKeys([`${newBasePath}`]);
                        }
                        return (
                            <SubMenu key={newBasePath} title={v.label}>
                                {renderMenu(newBasePath, v.children)}
                            </SubMenu>
                        )
                    } if (!v.next && v.children && v.children.length) {
                        if (location.pathname.indexOf(newBasePath) > -1) {
                            setSelectedKeys([newBasePath]);
                        }
                        return (
                            <Menu.Item key={newBasePath} title={v.label} onClick={() => { setSelectedKeys([newBasePath]) }}>
                                <Link to={newBasePath}>{v.label}</Link>
                            </Menu.Item>
                        )
                    }

                    if (location.pathname === newBasePath) {
                        setSelectedKeys([newBasePath]);
                    }
                    return (
                        <Menu.Item key={newBasePath} title={v.label} onClick={() => { setSelectedKeys([newBasePath]) }}>
                            <Link to={newBasePath}>{v.label}</Link>
                        </Menu.Item>
                    )
                }
                return null
            }))
        }
        return []
    }

    const onOpenChange = (keys: string[]) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1)
        if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : ['']);
        }
    }

    useEffect(() => {
        const menuTreeNodeCache = renderMenu(`/${pathnameArr[1]}`, menuArr);
        setMenuTreeNode(menuTreeNodeCache);
    }, [location])

    return (
        <Sider width={150} theme="light">
            <Menu mode="inline" theme="light" openKeys={openKeys} selectedKeys={selectedKeys} onOpenChange={onOpenChange} className="fullHeight">
                {menuTreeNode}
            </Menu>
        </Sider>
    )
}
