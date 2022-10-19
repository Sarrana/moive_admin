import React, { useEffect, useState } from 'react'
import { Space, Row, Col, Statistic, Radio, Select, Card, Button, message, RadioChangeEvent, Form, DatePicker } from 'antd'

import { Moment } from 'moment/moment'
import ReactECharts from 'echarts-for-react'
import { HBar } from '@/components/echart'
import { postContentPieStatisticslApi, postContentVideoStatisticslApi, postMediaStatisticsFilterApi, postContentYearStatisticslApi, postContentAreaStatisticslApi, postContentTypeStatisticslApi, postContentIncreaseStatisticslApi } from '@/request';

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
            trigger: 'item',
            formatter: (e) => {
                return `${e.data.name}: ${e.data.value}部 ${e.data.video_episodes_count}集  (${e.percent}%)`
            }
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            show: data && data.lists.length > 0,
            formatter: (name: string) => {
                const val = data.lists.filter((item) => item.name === name)
                return `${name}        ${val[0].value}部        ${val[0].video_episodes_count}集`
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
                            return `${data ? `${data.video_count}部` : ''}`
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
const radioOp = [
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
const typeArr = [
    {
        text: '电影',
        value: 1
    },
    {
        text: '电视剧',
        value: 2
    },
    {
        text: '综艺',
        value: 3
    },
    {
        text: '动漫',
        value: 4
    }
]
type VideoStaticDataType = {
    categories_name: string
    id: number
    video_episodes_count: number
    video_info_count: number
}
export const StatisticsContent: React.FC = () => {
    const { RangePicker } = DatePicker
    const [isAuditQuery, setAuditQuery] = useState<{ categories: number, type: number }>({ categories: 0, type: 1 })
    const [activeIndex, setActiveIndex] = useState<number>(1)
    const [isInitCommFilter, setInitCommFilter] = useState(null)
    const [videoStaticData, setVideoStaticData] = useState<VideoStaticDataType[]>([])

    const [countProportionData, setCountProportionData] = useState(null)
    const [loadingCountProportion, setLoadingCountProportion] = useState<boolean>(true)

    const [yearProportionData, setYearProportionData] = useState(null)
    const [loadingYearProportion, setLoadingYearProportion] = useState<boolean>(true)

    const [typeProportionData, setTypeProportionData] = useState([])
    const [loadingTypeProportion, setLoadingTypeProportion] = useState<boolean>(true)

    const [incrData, setIncrData] = useState(null)
    const [loadingincr, setLoadingincr] = useState<boolean>(true)

    const typeBarOption = {
        legend: {},
        tooltip: {},
        grid: {
            left: '3%',
            right: '1%',
            bottom: '1%',
            containLabel: true
        },
        dataset: {
            source: typeProportionData
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [{ type: 'bar' }, { type: 'bar' }]
    }
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
            data: incrData ? incrData.xAxis : []
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: incrData ? incrData.xAxis : []
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: '电影',
            type: 'line',
            stack: 'Total',
            data: incrData?.movie
        }, {
            name: '连续剧',
            type: 'line',
            stack: 'Total',
            data: incrData?.sitcom
        }, {
            name: '综艺',
            type: 'line',
            stack: 'Total',
            data: incrData?.variety
        }, {
            name: '动漫',
            type: 'line',
            stack: 'Total',
            data: incrData?.animation
        }]
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
    const handleChangeAudit = (value: number) => {
        setAuditQuery({
            ...isAuditQuery,
            categories: value
        })
    }
    const handleChangeType = (value: number) => {
        setAuditQuery({
            ...isAuditQuery,
            type: value
        })
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
    const handleType = (type: number) => {
        setAuditQuery({
            ...isAuditQuery,
            categories: 0
        })
        setActiveIndex(type)
    }
    const renderTitle = () => {
        return (
            <>
                <Button type="link" style={{ color: '#333', fontSize: '20px', fontWeight: activeIndex === 1 ? '500' : '400' }} size="small" onClick={() => { handleType(1) }}>内容年份</Button>
                <Button type="link" style={{ color: '#333', fontSize: '20px', fontWeight: activeIndex === 2 ? '500' : '400' }} size="small" onClick={() => { handleType(2) }}>片源国家</Button>
            </>
        )
    }
    const initContentVideo = () => {
        postContentVideoStatisticslApi().then((res: any) => {
            if (res.code === 200) {
                setVideoStaticData(res.data)
            }
        })
    }
    const initPieVideo = () => {
        setLoadingCountProportion(true)
        postContentPieStatisticslApi().then((res: any) => {
            if (res.code === 200) {
                res.data.lists.forEach((item) => {
                    item.name = item.categories_name
                    item.value = item.video_info_count
                })
                setCountProportionData(res.data)
                setLoadingCountProportion(false)
            } else {
                setLoadingCountProportion(false)
            }
        }).catch(() => {
            setLoadingCountProportion(false)
        })
    }
    const initYear = (categories?: number) => {
        setLoadingYearProportion(true)
        postContentYearStatisticslApi(categories || isAuditQuery.categories).then((res: any) => {
            if (res.code === 200) {
                res.data.lists.forEach((item) => {
                    item.name = item.year
                    item.value = item.video_info_count
                })
                setYearProportionData(res.data)
                setLoadingYearProportion(false)
            } else {
                setLoadingYearProportion(false)
            }
        }).catch(() => {
            setLoadingYearProportion(false)
        })
    }

    const initArea = (categories?: number) => {
        setLoadingYearProportion(true)
        postContentAreaStatisticslApi(categories || isAuditQuery.categories).then((res: any) => {
            if (res.code === 200) {
                res.data.lists.forEach((item) => {
                    item.name = item.area_name
                    item.value = item.video_info_count
                })
                setYearProportionData(res.data)
                setLoadingYearProportion(false)
            } else {
                setLoadingYearProportion(false)
            }
        }).catch(() => {
            setLoadingYearProportion(false)
        })
    }
    const initVideoType = () => {
        setLoadingTypeProportion(true)
        postContentTypeStatisticslApi(isAuditQuery.type).then((res: any) => {
            if (res.code === 200) {
                const source: [React.Key[]] = [
                    ['type', '部', '集']
                ]
                res.data.forEach((item) => {
                    source.push([item.type_name, item.video_count, item.episodes_count])
                })

                setTypeProportionData(source)
                setLoadingTypeProportion(false)
            } else {
                setLoadingTypeProportion(false)
            }
        }).catch(() => {
            setLoadingTypeProportion(false)
        })
    }
    const initIncr = () => {
        setLoadingincr(true)
        let params = {
            select_type: isInitCommQuery.select_type,
            start_date: isInitCommQuery.date ? isInitCommQuery.date[0].format('YYYY-MM-DD') : '',
            end_date: isInitCommQuery.date ? isInitCommQuery.date[1].format('YYYY-MM-DD') : ''
        }
        const formData = new FormData()
        Object.keys(params).forEach((item: string) => {
            formData.append(item, String(params[item]))
        })
        postContentIncreaseStatisticslApi(formData).then((res: any) => {
            if (res.code === 200) {
                let data = {
                    xAxis: [],
                    legend: ['电影', '连续剧', '综艺', '动漫'],
                    movie: [],
                    sitcom: [],
                    variety: [],
                    animation: [],
                    user_count: []
                }
                res.data.movie.forEach((item) => {
                    data.movie.push(`${parseInt(item.info_count, 10)}`)
                    data.xAxis.push(item.old_key)
                })
                res.data.sitcom.forEach((item) => {
                    data.sitcom.push(`${parseInt(item.info_count, 10)}`)
                })
                res.data.variety.forEach((item) => {
                    data.variety.push(`${parseInt(item.info_count, 10)}`)
                })
                res.data.animation.forEach((item) => {
                    data.animation.push(`${parseInt(item.info_count, 10)}`)
                })
                setIncrData(data)
                setLoadingincr(false)
            } else {
                setLoadingincr(false)
            }
        }).catch(() => {
            setLoadingincr(false)
        })
    }
    useEffect(() => {
        initFilter()
        initContentVideo()
        initPieVideo()
    }, [])
    useEffect(() => {
        initVideoType()
    }, [isAuditQuery.type])
    useEffect(() => {
        if (activeIndex === 1) {
            initYear()
        } else {
            initArea()
        }
    }, [isAuditQuery.categories, activeIndex])
    useEffect(() => {
        initIncr()
    }, [isInitCommQuery])
    return (
        <Row gutter={[12, 40]}>
            {
                videoStaticData.map((item) => {
                    return (
                        <Col span={6} key={item.id}>
                            <Card title={item.categories_name} bordered={false}>
                                <Space style={{ justifyContent: "space-around", width: "100%" }}>
                                    <Statistic value={`${item.video_info_count}部`} />
                                    <Statistic value={`${item.video_episodes_count}集`} />
                                </Space>
                            </Card>
                        </Col>
                    )
                })
            }

            <Col span={12}>
                <Card title="总内容占比(部)" bordered={false}>
                    <ChartPie
                        title=""
                        data={countProportionData}
                        showLoading={loadingCountProportion} />
                </Card>
            </Col>
            <Col span={12}>
                <Card title={renderTitle()} bordered={false}>
                    <Select
                        style={{
                            position: 'absolute',
                            left: 24,
                            zIndex: 1,
                            width: 200
                        }}
                        value={isAuditQuery.categories}
                        onChange={(e) => { handleChangeAudit(e) }}>
                        {
                            isInitCommFilter?.type.map((item) => (
                                <Select.Option
                                    key={item.text}
                                    value={item.value}>
                                    {item.text}
                                </Select.Option>
                            ))
                        }
                    </Select>
                    <ChartPie
                        title=""
                        data={yearProportionData}
                        showLoading={loadingYearProportion} />
                </Card>
            </Col>

            <Col span={24}>
                <Card title="总内容类型占比(部)" bordered={false}>
                    <Select
                        style={{
                            position: 'absolute',
                            right: 24,
                            zIndex: 1,
                            width: 200
                        }}
                        value={isAuditQuery.type}
                        onChange={(e) => { handleChangeType(e) }}>
                        {
                            typeArr.map((item) => (
                                <Select.Option
                                    key={item.text}
                                    value={item.value}>
                                    {item.text}
                                </Select.Option>
                            ))
                        }
                    </Select>
                    <ReactECharts
                        option={typeBarOption}
                        showLoading={loadingTypeProportion}
                        style={{ height: 400 }} />
                </Card>
            </Col>
            <Col span={24}>
                <Card title="内容增加分析(部)" bordered={false}>
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
                    <ReactECharts
                        option={linOption}
                        showLoading={loadingincr}
                        style={{ height: 400 }} />
                </Card>
            </Col>
        </Row>
    )
}
