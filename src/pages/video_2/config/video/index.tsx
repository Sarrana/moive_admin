import React from 'react'
import { Tabs } from 'antd'

import { VideoType, VideoClassify, VideoTime, VideoRegion } from './components'

export const VideoMgr: React.FC = () => {
    return (
        <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="视频分类" key="1">
                <VideoClassify />
            </Tabs.TabPane>
            <Tabs.TabPane tab="视频类型" key="2">
                <VideoType />
            </Tabs.TabPane>
            <Tabs.TabPane tab="视频地区" key="3">
                <VideoRegion />
            </Tabs.TabPane>
            <Tabs.TabPane tab="视频时间" key="4">
                <VideoTime />
            </Tabs.TabPane>
        </Tabs>
    )
}
