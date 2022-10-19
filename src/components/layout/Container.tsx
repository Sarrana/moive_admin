import { Layout } from 'antd'
import React from 'react'
import { useRoutes } from 'react-router-dom'
import { RouteConfig } from '../../router'

export const Container: React.FC = () => {
    const e = useRoutes(RouteConfig);
    return (
        <Layout>
            {e}
        </Layout>
    );
}
