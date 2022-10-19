import { AgreementMgr, KeywordMgr, VideoMgr } from '@/pages/video/config'
import { VideoContentAdd } from '@/pages/video/content/VideoContentAdd'
import { VideoContentDetail } from '@/pages/video/content/VideoContentDetail'
import { VideoContentDrama } from '@/pages/video/content/VideoContentDrama'
import { VideoContentList } from '@/pages/video/content/VideoContentList'
import { StatisticsUser, StatisticsVideo } from '@/pages/video/dashboard'
import { VideoSearchList } from '@/pages/video/search'
import { VideoSiteList } from '@/pages/video/site/VideoSiteList'
import { VideoIPList } from '@/pages/video/user/VideoIPList'
import { VideoUserList } from '@/pages/video/user/VideoUserList'
import { Outlet } from 'react-router'
import { ContentSortList, ContentSortSetting } from '@/pages/video/site'
import { VideoUserDetail } from '@/pages/video/user/VideoUserDetail'

const videoRouer = [
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
                label: '视频分析',
                path: 'StatisticsVideo',
                submenus: true,
                element: <StatisticsVideo />
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
                        element: <VideoUserList />
                    },
                    {
                        label: '用户详情',
                        // path: ':id',
                        path: 'Detail',
                        element: <VideoUserDetail />
                    }
                ]
            },
            {
                label: 'IP记录',
                path: 'IPRecord',
                submenus: true,
                element: <VideoIPList />
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
                element: <VideoContentList />
            },
            {
                label: '视频详情',
                path: 'Detail',
                element: <VideoContentDetail />
            },
            {
                label: '新增内容',
                path: 'Add',
                element: <VideoContentAdd />
            },
            {
                label: '编辑内容',
                path: 'Edit',
                element: <VideoContentAdd />
            },
            {
                label: '剧集管理',
                path: 'Drama',
                submenus: true,
                element: <VideoContentDrama />
            }
        ]
    },
    {
        label: '配置管理',
        path: 'ConfigMgr',
        submenus: true,
        next: true,
        children: [
            {
                label: '视频类型配置',
                path: 'VideoMgr',
                submenus: true,
                element: <VideoMgr />
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
                element: <VideoSiteList />
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
        element: <VideoSearchList />
    }
]

export default videoRouer
