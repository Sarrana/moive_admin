import { ActorMgr, AgreementMgr, KeywordMgr, VideoMgr } from '@/pages/video_2/config'
import { VideoContentAdd } from '@/pages/video_2/content/VideoContentAdd'
import { VideoContentDetail } from '@/pages/video_2/content/VideoContentDetail'
import { VideoContentDrama } from '@/pages/video_2/content/VideoContentDrama'
import { VideoContentList } from '@/pages/video_2/content/VideoContentList'
import { VideoContentTime } from '@/pages/video_2/content/VideoContentTime'
import { StatisticsUser, StatisticsVideo, StatisticsContent } from '@/pages/video_2/dashboard'
import { VideoSearchList } from '@/pages/video_2/search'
import { VideoSiteList } from '@/pages/video_2/site/VideoSiteList'
import { VideoIPList } from '@/pages/video_2/user/VideoIPList'
import { VideoUserList } from '@/pages/video_2/user/VideoUserList'
import { Outlet } from 'react-router'
import { ContentSortList, ContentSortSetting } from '@/pages/video_2/content/contentSort'
import { VideoUserDetail } from '@/pages/video_2/user/VideoUserDetail'
import { ActorAdd } from '@/pages/video_2/config/actor/actorAdd'
import { WantSee, ErrorFb } from '@/pages/video_2/operation'
import { VideoGold } from '@/pages/video_2/operation/gold'
import { VideoExamineList } from '@/pages/video_2/content/examine/VideoExamineList'
import PlayerPage from '@/pages/video_2/preview'
import Announcement from '@/pages/video_2/config/announcement'
import MediaStatistics from '@/pages/video_2/dashboard/mediaStatistics'
import VideoSeries from '@/pages/video_2/content/VideoSeries'
import { VideoCmtList } from '@/pages/video_2/comment/VideoCmtList'
import { VideoFeedbackList } from '@/pages/video_2/feedback/VideoFeedbackList'
import { VersionMgr } from '@/pages/video_2/config/version'

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
            },
            {
                label: '视频上传统计',
                path: 'mediaStatistics',
                submenus: true,
                element: <MediaStatistics />
            },
            {
                label: '内容分析',
                path: 'StatisticsContent',
                submenus: true,
                element: <StatisticsContent />
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
        next: true,
        children: [
            {
                label: '内容列表',
                path: 'ContentList',
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
                label: '内容审核',
                path: 'ExamineMgr',
                submenus: true,
                element: <VideoExamineList />
            },
            {
                label: '内容预发',
                path: 'TimeTask',
                submenus: true,
                element: <VideoContentTime />
            },
            {
                label: '视频预览',
                path: 'Preview',
                element: <PlayerPage />
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
            },
            {
                label: '系列影片',
                path: 'Series',
                submenus: true,
                element: <VideoSeries />
            }
        ]
    },
   /*  {
        label: '评论管理',
        path: 'CommentMgr',
        submenus: true,
        next: true,
        children: [
            {
                label: '评论管理',
                path: 'CommentList',
                submenus: true,
                element: <Outlet />,
                children: [
                    {
                        index: true,
                        element: <VideoContentList />
                    },
                ]
            }
        ]
    }, */

    {
        label: '运营管理',
        path: 'operationMgr',
        submenus: true,
        next: true,
        children: [
            {
                label: '我想看',
                path: 'VideWantSee',
                submenus: true,
                element: <WantSee />
            },
            {
                label: '金币订单记录',
                path: 'VideoGold',
                submenus: true,
                element: <VideoGold />
            },
            {
                label: '错误反馈',
                path: 'ErrorFb',
                submenus: true,
                element: <ErrorFb />
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
            },
            {
                label: '明星管理',
                path: 'ActorMgr',
                submenus: true,
                element: <Outlet />,
                children: [
                    {
                        index: true,
                        element: <ActorMgr />
                    },
                    {
                        label: '明星添加',
                        path: 'Add',
                        element: <ActorAdd />
                    },
                    {
                        label: '明星编辑',
                        path: 'Edit',
                        element: <ActorAdd />
                    }
                ]
            },
            {
                label: '系统公告',
                path: 'Announcement',
                submenus: true,
                element: <Announcement />
            },
            {
                label: '版本管理',
                path: 'VersionMgr',
                submenus: true,
                element: <VersionMgr />
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
            }
        ]
    },
    {
        label: '搜索记录',
        path: 'SearchMgr',
        submenus: true,
        element: <VideoSearchList />
    },
    {
        label: '评论管理',
        path: 'CommentMgr',
        submenus: true,
        element: <VideoCmtList />
    },
    {
        label: '工单管理',
        path: 'FeedbackMgr',
        submenus: true,
        element: <VideoFeedbackList />
    }
]

export default videoRouer
