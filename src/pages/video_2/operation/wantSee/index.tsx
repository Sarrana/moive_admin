import React from 'react'
import { Tabs } from 'antd'
import { IWant } from './IWant'
import { AllWant } from './AllWant'

export const WantSee: React.FC = () => (
    <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="我想看" key="1">
            <IWant />
        </Tabs.TabPane>
        <Tabs.TabPane tab="大家都想看" key="2">
            <AllWant />
        </Tabs.TabPane>
    </Tabs>
)
