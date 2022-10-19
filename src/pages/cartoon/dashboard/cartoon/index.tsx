import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Space, Row, Col, Statistic, Radio, Select, Card } from 'antd'

import { Pie, Line, HBar } from '@/components/echart'
import SearchForm, { SearchFormItem } from '@/components/searchForm';

type SearchParamType = {
    keywords: string
    status: string
}
export const StatisticsCartoon: React.FC = () => {
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
        <Row gutter={[12, 40]}>
            <Col span={24}>
                <SearchForm
                    formList={formList}
                    onSearch={onSearch} />
            </Col>

            <Col span={16}>
                <Card title="阅读量占比" bordered={false}>
                    <Select
                        defaultValue=""
                        style={{
                            position: 'absolute',
                            right: 24,
                            zIndex: 1,
                            width: 200
                        }}>
                        {/* {
                                areaCodeData.map((region) => (
                                    <Option value={region.value} key={region.label}>{region.label}</Option>
                                ))
                            } */}
                    </Select>
                    <Pie
                        title=""
                        data={[]}
                        showLoading={false} />
                </Card>
                <div>&nbsp;</div>
                <Card title="阅读量统计" bordered={false}>
                    <Radio.Group>
                        <Radio value="">app</Radio>
                        <Radio value="2">网页</Radio>
                    </Radio.Group>

                    <HBar
                        unit=""
                        data={[]}
                        showLoading={false} />
                </Card>
            </Col>
            <Col span={8}>
                <Card title="TOP100 阅读量" bordered={false}>
                    <Select
                        defaultValue=""
                        style={{
                            position: 'absolute',
                            right: 24,
                            zIndex: 1,
                            width: 200
                        }}>
                        {/* {
                                areaCodeData.map((region) => (
                                    <Option value={region.value} key={region.label}>{region.label}</Option>
                                ))
                            } */}
                    </Select>
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
        </Row>
    )
}
