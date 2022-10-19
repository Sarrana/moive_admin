import { StatisticsUser, StatisticsCartoon } from '@/pages/cartoon/dashboard'
import { CartoonIPList, CartoonUserDetail, CartoonUserList } from '@/pages/cartoon/user'
import { CartoonContentList, CartoonContentAdd, CartoonContentChapter } from '@/pages/cartoon/content'
import { AgreementMgr, CartoonTypesMgr, KeywordMgr } from '@/pages/cartoon/config'
import { Outlet } from 'react-router'
import { CartoonSiteList, ContentSortList, ContentSortSetting } from '@/pages/cartoon/site'
import { CartoonSearchList } from '@/pages/cartoon/search'

const cartoonRouter = [
    {
        label: '统计分析',
        path: 'Static',
        submenus: true,
        next: true,
        children: [
            {
                label: '用户分析',
                path: 'StatisticsUser',
                submenus: true,
                element: <StatisticsUser />
            },
            {
                label: '漫画分析',
                path: 'StatisticsCartoon',
                submenus: true,
                element: <StatisticsCartoon />
            }
        ]
    },
    {
        label: '用户管理',
        path: 'UserMgr',
        submenus: true,
        next: true,
        children: [
            {
                label: '用户列表',
                path: 'UserList',
                submenus: true,
                element: <Outlet />,
                children: [
                    {
                        index: true,
                        element: <CartoonUserList />
                    },
                    {
                        label: '用户详情',
                        path: 'Detail',
                        element: <CartoonUserDetail />
                    }
                ]
            },
            {
                label: 'IP记录',
                path: 'IPRecord',
                submenus: true,
                element: <CartoonIPList />
            }
        ]
    },
    {
        label: '内容管理',
        path: 'ContentMgr',
        submenus: true,
        element: <Outlet />,
        children: [
            {
                index: true,
                element: <CartoonContentList />
            },
            {
                label: '新增内容',
                path: 'Add',
                element: <CartoonContentAdd />
            },
            {
                label: '编辑内容',
                path: 'Edit',
                element: <CartoonContentAdd />
            },
            {
                label: '章节管理',
                path: 'Chapter',
                element: <CartoonContentChapter />
            }
        ]
    },
    // {
    //     label: '订单管理',
    //     path: 'OrderMgr',
    //     submenus: true,
    //     next: true,
    //     children: [
    //         {
    //             label: 'VIP订单',
    //             path: 'VipOrder',
    //             submenus: true,
    //             element: <VipOrder />
    //         }
    //     ]
    // },
    {
        label: '配置管理',
        path: 'ConfigMgr',
        submenus: true,
        next: true,
        children: [
            {
                label: '漫画类型配置',
                path: 'CartoonTypesMgr',
                submenus: true,
                element: <CartoonTypesMgr />
            },
            {
                label: '协议管理',
                path: 'AgreementMgr',
                submenus: true,
                element: <AgreementMgr />
            },
            {
                label: '关键字搜索',
                path: 'KeywordMgr',
                submenus: true,
                element: <KeywordMgr />
            }
            // {
            //     label: '付费控制',
            //     path: 'PaySetting',
            //     submenus: true,
            //     element: <PaySetting />
            // },
            // {
            //     label: 'VIP配置',
            //     path: 'VipSetting',
            //     submenus: true,
            //     element: <VipSetting />
            // }
        ]
    },
    {
        label: '网站管理',
        path: 'SiteMgr',
        submenus: true,
        next: true,
        children: [
            {
                label: '网站列表',
                path: 'SiteList',
                submenus: true,
                element: <CartoonSiteList />
            },
            {
                label: '内容排序',
                path: 'ContentSortList',
                submenus: true,
                element: <Outlet />,
                children: [
                    {
                        index: true,
                        element: <ContentSortList />
                    },
                    {
                        label: '排序管理',
                        path: 'Setting',
                        element: <ContentSortSetting />
                    }
                ]
            }
        ]
    },
    {
        label: '搜索记录',
        path: 'SearchMgr',
        submenus: true,
        element: <CartoonSearchList />
    }
]

export default cartoonRouter
