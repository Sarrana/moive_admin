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
import MediaStatistics from '@/pages/video_2/dashboard/mediaStatistics'
import VideoSeries from '@/pages/video_2/content/VideoSeries'
import { VideoCmtList } from '@/pages/video_2/comment/VideoCmtList'
import { VideoFeedbackList } from '@/pages/video_2/feedback/VideoFeedbackList'
import { VersionMgr } from '@/pages/video_2/config/version'
import { PayTypeList } from '@/pages/video_2/payment/PayTypeList'
import { PayGatewayList } from '@/pages/video_2/payment/PayGatewayList'
import { ProductList } from '@/pages/video_2/product/ProductList'
import { ProductPayList } from '@/pages/video_2/product/ProductPayList'
import { OrderList } from '@/pages/video_2/order'
import { Announcement } from '@/pages/video_2/config/announcement'
import { NewUploadList } from '@/pages/video_2/content/newUpload/NewUploadList'
import { AppAnalyze } from '@/pages/video_2/dashboard/appAnalyze/AppAnalyze'

const videoRouer = [
    {
        label: '????????????',
        path: 'Static',
        submenus: true,
        next: true,
        children: [
            {
                label: '????????????',
                path: 'StatisticsUser',
                submenus: true,
                element: <StatisticsUser />
            },
            {
                label: 'APP????????????',
                path: 'AppAnalyze',
                submenus: true,
                element: <AppAnalyze />
            },
            {
                label: '????????????',
                path: 'StatisticsVideo',
                submenus: true,
                element: <StatisticsVideo />
            },
            {
                label: '??????????????????',
                path: 'mediaStatistics',
                submenus: true,
                element: <MediaStatistics />
            },
            {
                label: '????????????',
                path: 'StatisticsContent',
                submenus: true,
                element: <StatisticsContent />
            }
        ]
    },
    {
        label: '????????????',
        path: 'UserMgr',
        submenus: true,
        next: true,
        children: [
            {
                label: '????????????',
                path: 'UserList',
                submenus: true,
                element: <Outlet />,
                children: [
                    {
                        index: true,
                        element: <VideoUserList />
                    },
                    {
                        label: '????????????',
                        // path: ':id',
                        path: 'Detail',
                        element: <VideoUserDetail />
                    }
                ]
            },
            {
                label: 'IP??????',
                path: 'IPRecord',
                submenus: true,
                element: <VideoIPList />
            }
        ]
    },
    {
        label: '????????????',
        path: 'ContentMgr',
        submenus: true,
        next: true,
        children: [
            {
                label: '????????????',
                path: 'ContentList',
                submenus: true,
                element: <Outlet />,
                children: [
                    {
                        index: true,
                        element: <VideoContentList />
                    },
                    {
                        label: '????????????',
                        path: 'Detail',
                        element: <VideoContentDetail />
                    },
                    {
                        label: '????????????',
                        path: 'Add',
                        element: <VideoContentAdd />
                    },
                    {
                        label: '????????????',
                        path: 'Edit',
                        element: <VideoContentAdd />
                    },
                    {
                        label: '????????????',
                        path: 'Drama',
                        submenus: true,
                        element: <VideoContentDrama />
                    }
                ]
            },
            {
                label: '????????????',
                path: 'ExamineMgr',
                submenus: true,
                element: <VideoExamineList />
            },
            {
                label: '????????????',
                path: 'NewUploadMgr',
                submenus: true,
                element: <NewUploadList />
            },
            {
                label: '????????????',
                path: 'TimeTask',
                submenus: true,
                element: <VideoContentTime />
            },
            {
                label: '????????????',
                path: 'Preview',
                element: <PlayerPage />
            },
            {
                label: '????????????',
                path: 'ContentSortList',
                submenus: true,
                element: <Outlet />,
                children: [
                    {
                        index: true,
                        element: <ContentSortList />
                    },
                    {
                        label: '????????????',
                        path: 'Setting',
                        element: <ContentSortSetting />
                    }
                ]
            },
            {
                label: '????????????',
                path: 'Series',
                submenus: true,
                element: <VideoSeries />
            }
        ]
    },
    {
        label: '????????????',
        path: 'operationMgr',
        submenus: true,
        next: true,
        children: [
            {
                label: '?????????',
                path: 'VideWantSee',
                submenus: true,
                element: <WantSee />
            },
            {
                label: '??????????????????',
                path: 'VideoGold',
                submenus: true,
                element: <VideoGold />
            },
            {
                label: '????????????',
                path: 'ErrorFb',
                submenus: true,
                element: <ErrorFb />
            }
        ]
    },
    {
        label: '????????????',
        path: 'ConfigMgr',
        submenus: true,
        next: true,
        children: [
            {
                label: '??????????????????',
                path: 'VideoMgr',
                submenus: true,
                element: <VideoMgr />
            },
            {
                label: '????????????',
                path: 'AgreementMgr',
                submenus: true,
                element: <AgreementMgr />
            },
            {
                label: '???????????????',
                path: 'KeywordMgr',
                submenus: true,
                element: <KeywordMgr />
            },
            {
                label: '????????????',
                path: 'ActorMgr',
                submenus: true,
                element: <Outlet />,
                children: [
                    {
                        index: true,
                        element: <ActorMgr />
                    },
                    {
                        label: '????????????',
                        path: 'Add',
                        element: <ActorAdd />
                    },
                    {
                        label: '????????????',
                        path: 'Edit',
                        element: <ActorAdd />
                    }
                ]
            },
            {
                label: '????????????',
                path: 'Announcement',
                submenus: true,
                element: <Announcement />,
            },
            {
                label: '????????????',
                path: 'VersionMgr',
                submenus: true,
                element: <VersionMgr />
            }
        ]
    },
    {
        label: '????????????',
        path: 'SiteMgr',
        submenus: true,
        next: true,
        children: [
            {
                label: '????????????',
                path: 'SiteList',
                submenus: true,
                element: <VideoSiteList />
            }
        ]
    },
    {
        label: '????????????',
        path: 'SearchMgr',
        submenus: true,
        element: <VideoSearchList />
    },
    {
        label: '????????????',
        path: 'CommentMgr',
        submenus: true,
        element: <VideoCmtList />
    },
    {
        label: '????????????',
        path: 'FeedbackMgr',
        submenus: true,
        element: <VideoFeedbackList />
    },
    {
        label: '????????????',
        path: 'PayMgr',
        submenus: true,
        next: true,
        children: [
            {
                label: '????????????',
                path: 'PayTypeList',
                submenus: true,
                element: <PayTypeList />

            },
            {
                label: '????????????',
                path: 'PayGatewayList',
                submenus: true,
                element: <PayGatewayList />
            }
        ]
    },
    {
        label: '????????????',
        path: 'ProductMgr',
        submenus: true,
        next: true,
        children: [
            {
                label: '????????????',
                path: 'ProductList',
                submenus: true,
                element: <ProductList />

            },
            {
                label: '??????????????????',
                path: 'ProductPayList',
                submenus: true,
                element: <ProductPayList />
            }
        ]
    },
    {
        label: '????????????',
        path: 'OrderMgr',
        submenus: true,
        element: <OrderList />
    },
]

export default videoRouer
