import { AgreementMgr, KeywordMgr, NovelTypesMgr, NovelTypesSub, PaySetting, VipSetting } from '@/pages/novel/config'
import { StatisticsUser, StatisticsNovel } from '@/pages/novel/dashboard'
import { NovelSearchList } from '@/pages/novel/search'
import { ContentSortList, ContentSortSetting, NovelSiteList } from '@/pages/novel/site'
import { VipOrder } from '@/pages/novel/orderMgr'
import { Outlet } from 'react-router'
import { NovelContentAdd, NovelContentChapter, NovelContentList } from '@/pages/novel/content'
import { NovelIPList, NovelUserDetail, NovelUserList } from '@/pages/novel/user'

const novelRouter = [
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
                label: '小说分析',
                path: 'StatisticsNovel',
                submenus: true,
                element: <StatisticsNovel />
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
                        element: <NovelUserList />
                    },
                    {
                        label: '用户详情',
                        path: 'Detail',
                        element: <NovelUserDetail />
                    }
                ]
            },
            {
                label: 'IP记录',
                path: 'IPRecord',
                submenus: true,
                element: <NovelIPList />
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
                element: <NovelContentList />
            },
            {
                label: '新增内容',
                path: 'Add',
                element: <NovelContentAdd />
            },
            {
                label: '编辑内容',
                path: 'Edit',
                element: <NovelContentAdd />
            },
            {
                label: '章节管理',
                path: 'Chapter',
                element: <NovelContentChapter />
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
                label: '小说类型配置',
                path: 'NovelTypesMgr',
                submenus: true,
                element: <Outlet />,
                children: [
                    {
                        index: true,
                        element: <NovelTypesMgr />
                    },
                    {
                        label: '子类型管理',
                        path: 'SubMgr',
                        element: <NovelTypesSub />
                    }
                ]
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
                element: <NovelSiteList />
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
        element: <NovelSearchList />
    }
]

export default novelRouter
