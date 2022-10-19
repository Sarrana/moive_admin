import sysRouter from './sys'
import videoRouter from './video'
import videoRouter2 from './video_2'
import dboRouter from './dbo'
import novelRouter from './novel'
import cartoonRouter from "./cartoon"
import { Navigate } from "react-router-dom"
import { Login } from "@/pages/login/Login"
import { ContainerSub } from "@/components/layout/ContainerSub"
import React from 'react'

export interface RouteType {
    label?: string;
    path?: string;
    /** 主菜单 */
    menus?: boolean;
    /** 下级菜单 */
    submenus?: boolean;
    redirect?: string;
    index?: boolean,
    /** 是否有下级菜单 */
    next?: boolean,
    element?: React.ReactElement;
    children?: RouteType[];
}

export const RouteConfig: RouteType[] = [
    {
        label: '首页',
        path: '/',
        // redirect: "/Video/Static/StatisticsUser",
        // element: <Navigate to="/Video/Static/StatisticsUser" replace={false} />
        redirect: "/Video2/Static/StatisticsUser",
        element: <Navigate to="/Video2/Static/StatisticsUser" replace={false} />
    },
    {
        label: '登录',
        path: 'Login',
        element: <Login />
    },
    // {
    //     label: "视频",
    //     path: "Video",
    //     menus: true,
    //     next: true,
    //     redirect: "/Video/Static/StatisticsUser",
    //     element: <ContainerSub />,
    //     children: videoRouter
    // },
    {
        label: "视频",
        path: "Video2",
        menus: true,
        next: true,
        redirect: "/Video2/Static/StatisticsUser",
        element: <ContainerSub />,
        children: videoRouter2
    },
    {
        label: "小说",
        path: "Novel",
        menus: true,
        next: true,
        redirect: "/Novel/Static/StatisticsUser",
        element: <ContainerSub />,
        children: novelRouter
    },
    {
        label: "漫画",
        path: "Cartoon",
        menus: true,
        next: true,
        redirect: "/Cartoon/Static/StatisticsUser",
        element: <ContainerSub />,
        children: cartoonRouter
    },
    {
        label: "系统",
        path: "Sys",
        menus: true,
        next: true,
        redirect: "/Sys/UserMgr",
        element: <ContainerSub />,
        children: sysRouter
    },
    {
        label: "运营",
        path: "Dbo",
        menus: true,
        next: true,
        redirect: "/Dbo/VideoAdvert",
        element: <ContainerSub />,
        children: dboRouter
    }
    // {
    //   label: '404',
    //   path: '*',
    //   component: NotFound,
    // },
]
