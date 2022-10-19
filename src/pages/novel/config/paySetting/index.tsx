import React, { useEffect, useState } from 'react'
import { Button, Space, Switch, Row, Col, Modal, Form, Input, Select, message, Card } from 'antd'
import { } from '@/request'

export const PaySetting: React.FC = () => {
    const initData = () => {

    }
    useEffect(() => {
        initData()
    }, [])
    return (
        <Row gutter={[12, 40]}>
            <Col span={24}>
                <Card>
                    <Space direction="vertical" size={[4, 30]} style={{ width: '100%' }}>
                        <div>
                            平台付费：
                            <Switch />
                        </div>
                        <div style={{ textIndent: '4rem' }}>
                            开启后，平台所有已设置VIP付费的小说章节将进行付费阅读
                        </div>
                    </Space>
                </Card>
            </Col>
        </Row>
    )
}
