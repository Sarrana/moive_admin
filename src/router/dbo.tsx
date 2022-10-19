import { VideoAdvertList, VideoAdvertSetting } from "@/pages/dbo/videoAdvert"
import { NovelAdvertList, NovelAdvertSetting } from "@/pages/dbo/novelAdvert"
import { CartoonAdvertList, CartoonAdvertSetting } from "@/pages/dbo/cartoonAdvert"
import { Outlet } from 'react-router'

const dboRouter = [
    {
        label: '视频广告管理',
        path: 'VideoAdvert',
        submenus: true,
        element: <Outlet />,
        children: [
            {
                index: true,
                element: <VideoAdvertList />
            },
            {
                label: '广告位设置',
                path: 'Setting',
                element: <VideoAdvertSetting />
            }
        ]
    },
    {
        label: '小说广告管理',
        path: 'NovelAdvert',
        submenus: true,
        element: <Outlet />,
        children: [
            {
                index: true,
                element: <NovelAdvertList />
            },
            {
                label: '广告位设置',
                path: 'Setting',
                element: <NovelAdvertSetting />
            }
        ]
    },
    {
        label: '漫画广告管理',
        path: 'CartoonAdvert',
        submenus: true,
        element: <Outlet />,
        children: [
            {
                index: true,
                element: <CartoonAdvertList />
            },
            {
                label: '广告位设置',
                path: 'Setting',
                element: <CartoonAdvertSetting />
            }
        ]
    }
]

export default dboRouter
