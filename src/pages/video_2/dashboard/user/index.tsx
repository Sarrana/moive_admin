import React, { useEffect, useState } from 'react'
import { Space, Row, Col, Form, Statistic, Card, Radio, RadioChangeEvent, message, DatePicker, Button } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import './index.scss'

import { Moment } from 'moment/moment'
import { postUserCountStatisticslApi, postMediaStatisticsFilterApi, postUserCreateStatisticslApi, postUserVisitStatisticslApi, postUserRegStatisticslApi } from '@/request'

type PropType = {
    title?: string
    legendRight?: boolean
    data: any
    showLoading: boolean
}
const ChartPie: React.FC<PropType> = (P) => {
    const { title, data, legendRight, showLoading } = P
    const option = {
        title: {
            text: title,
            x: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 50,
            bottom: 20,
            icon: 'circle',
            show: data && data.lists.length > 0,
            formatter: (name: string) => {
                const val = data.lists.filter((item) => item.name === name)
                return `${name}        ${data.video_count === 0 ? 0 : ((val[0].value / data.video_count) * 100).toFixed(2)}%       ${val[0].value}`
            }
        },
        series: [
            {
                name: title,
                type: 'pie',
                radius: ['50%', '60%'],
                center: ['40%', '50%'],
                silent: true,
                label: {
                    normal: {
                        position: 'center',
                        show: true,
                        formatter: () => {
                            return `${data ? `${data.video_count}` : ''}`
                        },
                        textStyle: {
                            fontSize: 30
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        borderWidth: 2,
                        borderColor: '#fff'
                    },
                    emphasis: {
                        borderWidth: 0,
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                data: data ? data.lists : []
            }
        ]
    }

    const loadingOption = {
        text: '加载中...',
        color: '#4413c2',
        textColor: '#270240',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0
    };

    return (
        <ReactECharts
            option={option}
            showLoading={showLoading}
            loadingOption={loadingOption}
            style={{ height: 300 }} />
    )
}
export const StatisticsUser: React.FC = () => {
    const { RangePicker } = DatePicker
    const [userCountData, setUserCountData] = useState(null)

    const [userRegData, setUserRegData] = useState(null)
    const [loadingUserReg, setLoadingUserReg] = useState<boolean>(true)

    const [userOandNData, setUerOandNData] = useState(null)
    const [loadingUerOandN, setLoadingUerOandN] = useState<boolean>(true)

    const [isInitCommFilter, setInitCommFilter] = useState(null)

    const [regCountData, setRegCountData] = useState(null)
    const [loadingRegCount, setLoadingRegCount] = useState<boolean>(true)
    const linOption = {
        grid: {
            left: '2%',
            right: '4%',
            bottom: '1%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: regCountData ? regCountData.legend : []
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: regCountData ? regCountData.xAxis : []
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: 'H5',
            type: 'line',
            stack: 'Total',
            data: regCountData?.H5
        }, {
            name: 'PC',
            type: 'line',
            stack: 'Total',
            data: regCountData?.PC
        }]
    }

    const initFilter = () => {
        postMediaStatisticsFilterApi()
            .then((res: any) => {
                switch (res.code) {
                    case 200:
                        setInitCommFilter({
                            date: res.data.select_types,
                            type: res.data.categories,
                            status: res.data.video_status
                        })
                        break
                    default:
                        message.error(res.message).then()
                }
            })
            .catch(() => {
                message.error('网络错误').then()
            })
    }
    const [isInitCommQuery, setInitCommQuery] = useState<{ date: Moment[] | null, select_type: string }>({
        select_type: 'today',
        date: null
    })
    const changeDateSelect = ({ target: { value } }: RadioChangeEvent) => {
        setInitCommQuery({
            select_type: value,
            date: null
        });
    };

    const changeDate = (value: Moment[]) => {
        if (value) {
            setInitCommQuery({
                select_type: '',
                date: [value[0], value[1]]
            })
        } else {
            setInitCommQuery({
                ...isInitCommQuery,
                date: null
            })
        }
    }

    const reset = () => {
        setInitCommQuery({
            select_type: 'today',
            date: null
        })
    }
    const initUserCount = () => {
        postUserCountStatisticslApi().then((res: any) => {
            if (res.code === 200) {
                setUserCountData(res.data)
            }
        })
    }
    useEffect(() => {
        initFilter()
        initUserCount()
    }, [])
    const initUserReg = () => {
        setLoadingUserReg(true)
        let params = {
            select_type: isInitCommQuery.select_type,
            start_date: isInitCommQuery.date ? isInitCommQuery.date[0].format('YYYY-MM-DD') : '',
            end_date: isInitCommQuery.date ? isInitCommQuery.date[1].format('YYYY-MM-DD') : ''
        }
        const formData = new FormData()
        Object.keys(params).forEach((item: string) => {
            formData.append(item, String(params[item]))
        })
        postUserCreateStatisticslApi(formData).then((res: any) => {
            if (res.code === 200) {
                let data = {
                    lists: [],
                    video_count: 0
                }
                for (let i in res.data) {
                    if (i !== 'sum') {
                        data.lists.push({
                            name: i,
                            value: res.data[i].count
                        })
                    } else {
                        data.video_count = res.data[i]
                    }
                }
                setUserRegData(data)
                setLoadingUserReg(false)
            } else {
                setLoadingUserReg(false)
            }
        }).catch(() => {
            setLoadingUserReg(false)
        })
    }
    const initUserOandN = () => {
        setLoadingUerOandN(true)
        let params = {
            select_type: isInitCommQuery.select_type,
            start_date: isInitCommQuery.date ? isInitCommQuery.date[0].format('YYYY-MM-DD') : '',
            end_date: isInitCommQuery.date ? isInitCommQuery.date[1].format('YYYY-MM-DD') : ''
        }
        const formData = new FormData()
        Object.keys(params).forEach((item: string) => {
            formData.append(item, String(params[item]))
        })
        postUserVisitStatisticslApi(formData).then((res: any) => {
            if (res.code === 200) {
                let data = {
                    lists: [],
                    video_count: 0
                }
                for (let i in res.data) {
                    if (i !== 'sum') {
                        data.lists.push({
                            name: i,
                            value: res.data[i].count
                        })
                    } else {
                        data.video_count = res.data[i]
                    }
                }
                setUerOandNData(data)
                setLoadingUerOandN(false)
            } else {
                setLoadingUerOandN(false)
            }
        }).catch(() => {
            setLoadingUerOandN(false)
        })
    }

    const initRegCount = () => {
        setLoadingRegCount(true)
        let params = {
            select_type: isInitCommQuery.select_type,
            start_date: isInitCommQuery.date ? isInitCommQuery.date[0].format('YYYY-MM-DD') : '',
            end_date: isInitCommQuery.date ? isInitCommQuery.date[1].format('YYYY-MM-DD') : ''
        }
        const formData = new FormData()
        Object.keys(params).forEach((item: string) => {
            formData.append(item, String(params[item]))
        })
        postUserRegStatisticslApi(formData).then((res: any) => {
            if (res.code === 200) {
                let data = {
                    xAxis: [],
                    legend: ['H5', 'PC'],
                    APP: [],
                    H5: [],
                    PC: []
                }
                res.data.h5.forEach((item) => {
                    data.H5.push(item.value)
                    data.xAxis.push(item.old_key)
                })
                res.data.web.forEach((item) => {
                    data.PC.push(item.value)
                })
                setRegCountData(data)
                setLoadingRegCount(false)
            } else {
                setLoadingRegCount(false)
            }
        }).catch(() => {
            setLoadingRegCount(false)
        })
    }
    useEffect(() => {
        initUserReg()
        initUserOandN()
        initRegCount()
    }, [isInitCommQuery])
    return (
        <Row gutter={[12, 20]}>
            <Col span={24}>
                <Card>
                    <Form layout="inline">
                        <Form.Item>
                            <Radio.Group
                                onChange={changeDateSelect}
                                value={isInitCommQuery.select_type}>
                                {
                                    isInitCommFilter?.date.map((item) => (
                                        <Radio.Button
                                            key={item.value}
                                            value={item.value}>
                                            {item.text}
                                        </Radio.Button>
                                    ))
                                }
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item>
                            <RangePicker
                                placeholder={['起始时间', '结束时间']}
                                // @ts-ignore
                                value={isInitCommQuery.date}
                                onChange={changeDate}
                                allowClear />
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="reset" onClick={reset}>重置</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
            {
                userCountData
                && (
                    <>
                        <Col span={6}>
                            <Card title="日新增注册用户" bordered={false}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Space>
                                        <Statistic value={userCountData.create.today} />
                                    </Space>
                                    <Space style={{ justifyContent: "space-between", width: "100%" }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            昨日：
                                            <Statistic value={userCountData.create.yesterday} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Statistic value={`${userCountData.create.proportion.toFixed(2)}%`} />
                                            {userCountData.create.proportion < 0 ? <ArrowDownOutlined style={{ color: 'red' }} /> : <ArrowUpOutlined style={{ color: 'green' }} />}
                                        </div>
                                    </Space>
                                </Space>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card title="累计用户数量" bordered={false}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Space>
                                        <Statistic value={userCountData.count.sum_count} />
                                    </Space>
                                    <Space style={{ justifyContent: "space-between", width: "100%" }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            今年：
                                            <Statistic value={userCountData.count.year_count} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            去年：
                                            <Statistic value={`${userCountData.count.last_year_count}`} />
                                        </div>
                                    </Space>
                                </Space>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card title="访客数（UV）" bordered={false}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Space>
                                        <Statistic value={userCountData.visit_user.today} />
                                    </Space>
                                    <Space style={{ justifyContent: "space-between", width: "100%" }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            相比前一天：
                                            <Statistic value={userCountData.visit_user.yesterday} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Statistic value={`${userCountData.visit_user.proportion.toFixed(2)}%`} />
                                            {userCountData.visit_user.proportion < 0 ? <ArrowDownOutlined style={{ color: 'red' }} /> : <ArrowUpOutlined style={{ color: 'green' }} />}
                                        </div>
                                    </Space>
                                </Space>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card title="访问IP数" bordered={false}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Space>
                                        <Statistic value={userCountData.visit_ip.today} />
                                    </Space>
                                    <Space style={{ justifyContent: "space-between", width: "100%" }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            相比前一天：
                                            <Statistic value={userCountData.visit_ip.yesterday} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Statistic value={`${userCountData.visit_ip.proportion.toFixed(2)}%`} />
                                            {userCountData.visit_ip.proportion < 0 ? <ArrowDownOutlined style={{ color: 'red' }} /> : <ArrowUpOutlined style={{ color: 'green' }} />}
                                        </div>
                                    </Space>
                                </Space>
                            </Card>
                        </Col>

                    </>
                )
            }
            <Col span={12}>
                <Card title="注册用户来源占比（总）" bordered={false}>
                    <ChartPie
                        title=""
                        data={userRegData}
                        showLoading={loadingUserReg} />
                </Card>
            </Col>
            <Col span={12}>
                <Card title="新老访问占比" bordered={false}>
                    <ChartPie
                        title=""
                        data={userOandNData}
                        showLoading={loadingUerOandN} />
                </Card>
            </Col>

            <Col span={24}>
                <Card title="注册用户量/来源" bordered={false}>
                    <ReactECharts
                        option={linOption}
                        showLoading={loadingRegCount}
                        style={{ height: 400 }} />
                </Card>
            </Col>
        </Row>
    )
}
