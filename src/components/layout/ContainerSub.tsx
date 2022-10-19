import { Layout } from 'antd'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { SiderSubMenu } from './SiderSubMenu';

const { Content } = Layout;

export const ContainerSub: React.FC = () => (
    <>
        <SiderSubMenu />
        <Content style={{ margin: 20 }}>
            <Outlet />
        </Content>
    </>
)
