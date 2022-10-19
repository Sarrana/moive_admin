import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Space, Switch, Row, Col, Modal, Form, Statistic, Card } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { Pie, Line, HBar } from '@/components/echart'

import SearchForm, { SearchFormItem } from '@/components/searchForm';

type SearchParamType = {
    keywords: string
    status: string
}
export const StatisticsUser: React.FC = () => {
    const [searchParamsData, setSearchParamsData] = useState<SearchParamType>({
        keywords: '',
        status: ''
    })
    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'is_official',
                placeholder: '请选择使用网站',
                label: '',
                type: 'select',
                selectOp: [
                    {
                        name: '普通群组',
                        value: '0'
                    }, {
                        name: '官方群组',
                        value: '1'

                    }
                ]
            },
            {
                name: 'select_type',
                label: '',
                type: 'radioBtn',
                radioOp: [
                    {
                        text: '全部',
                        value: undefined
                    },
                    {
                        text: '今天',
                        value: 'today'
                    },
                    {
                        text: '昨天',
                        value: 'yesterday'
                    },
                    {
                        text: '最近7天',
                        value: 'sevenDay'
                    },
                    {
                        text: '最近30天',
                        value: 'thirtyDay'
                    },
                    {
                        text: '本月',
                        value: 'currentMonth'
                    },
                    {
                        text: '本年',
                        value: 'currentYear'
                    }
                ]
            },
            {
                name: 'date',
                label: '',
                type: 'rangePicker'
            }
        ],
        []
    );
    const onSearch = useCallback(
        (params) => {
            setSearchParamsData(params)
        },
        []
    );
    return (
        <Row gutter={[12, 20]}>
            <Col span={24}>
                <SearchForm
                    formList={formList}
                    onSearch={onSearch} />
            </Col>

            <Col span={6}>
                <Card title="新增用户" bordered={false}>
                    <Space direction="vertical">
                        <Space>
                            <Statistic value={123} />
                        </Space>
                        <span>
                            昨日：245
                            <ArrowUpOutlined />
                        </span>
                    </Space>
                </Card>
            </Col>
            <Col span={6}>
                <Card title="累计用户总量" bordered={false}>
                    <Space direction="vertical">
                        <Space>
                            <Statistic value={123} />
                        </Space>
                        <Space>
                            <span>今年：245 </span>
                            <span>去年：245 </span>
                        </Space>
                    </Space>
                </Card>
            </Col>
            <Col span={6}>
                <Card title="启动次数" bordered={false}>
                    <Space direction="vertical">
                        <Space>
                            <Statistic value={123} />
                        </Space>
                        <span>
                            昨日：245
                            <ArrowUpOutlined />
                        </span>
                    </Space>
                </Card>
            </Col>
            <Col span={6}>
                <Card title="平均访问时长" bordered={false}>
                    <Space direction="vertical">
                        <Space>
                            <Statistic value={123} />
                        </Space>
                        <span>
                            昨日：245
                            <ArrowUpOutlined />
                        </span>
                    </Space>
                </Card>
            </Col>
            <Col span={8}>
                <Card title="用户来源占比（总）" bordered={false}>
                    <Pie
                        title=""
                        data={[]}
                        showLoading={false} />
                </Card>
            </Col>
            <Col span={16}>
                <Card title="总浏览量趋势" bordered={false}>
                    <Line
                        title=""
                        data={[]}
                        showLoading={false} />
                </Card>
            </Col>

            <Col span={8}>
                <Card title="访问占比（总）" bordered={false}>
                    <Pie
                        title=""
                        data={[]}
                        showLoading={false} />
                </Card>
            </Col>
            <Col span={16}>
                <Card title="总平均访问时长（min）" bordered={false}>
                    <Line
                        title=""
                        data={[]}
                        showLoading={false} />
                </Card>
            </Col>
            <Col span={24}>
                <Card title="网站用户统计" bordered={false}>
                    <HBar
                        unit=""
                        data={[]}
                        showLoading={false} />
                </Card>
            </Col>
        </Row>
    )
}
