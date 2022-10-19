import React, { useEffect, useState } from 'react'
import { Row, Col, Radio, Select, Card, Table, Form, message, DatePicker, Button, RadioChangeEvent } from 'antd'
import ReactECharts from 'echarts-for-react'

import { Moment } from 'moment/moment'
import { postMediaStatisticsFilterApi, postVideoPalyChartsStatisticslApi, postVideoPalyStatisticslApi, postVideoTypeChartsStatisticslApi, postVideoCountChartsStatisticslApi } from '@/request';

const loadingOption = {
    text: '加载中...',
    color: '#4413c2',
    textColor: '#270240',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0
}
type PropType = {
    title?: string
    legendRight?: boolean
    data: any
    showLoading: boolean
}
type RechargePillarBarType = {
    data: any
    showLoading: boolean
}
const RechargePillarBar: React.FC<RechargePillarBarType> = (P) => {
    const { data, showLoading } = P
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: data?.legend
        },
        grid: {
            left: '1%',
            right: '4%',
            bottom: '1%',
            containLabel: true
        },
        xAxis: {
            axisTick: {
                show: false
            },
            data: data ? data.xAxis : []
        },
        yAxis: {
            axisLine: {
                show: true
            }
        },
        series: [
            {
                name: "电影",
                type: 'bar',
                stack: 'total',
                label: {
                    normal: {
                        show: true,
                        position: 'inside'
                    }
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'top',
                            formatter: function (params: any) {
                                if (params.value > 0) {
                                    return params.value;
                                }
                                return '';
                            }
                        }
                    }
                },
                data: data?.movie_count
            },
            {
                name: "连续剧",
                type: 'bar',
                stack: 'total',
                label: {
                    normal: {
                        show: true,
                        position: 'inside'
                    }
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'top',
                            formatter: function (params: any) {
                                if (params.value > 0) {
                                    return params.value;
                                }
                                return '';
                            }
                        }
                    }
                },
                data: data?.sitcom_count
            },
            {
                name: "综艺",
                type: 'bar',
                stack: 'total',
                label: {
                    normal: {
                        show: true,
                        position: 'inside'
                    }
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'top',
                            formatter: function (params: any) {
                                if (params.value > 0) {
                                    return params.value;
                                }
                                return '';
                            }
                        }
                    }
                },
                data: data?.variety_count
            },
            {
                name: '动漫',
                type: 'bar',
                stack: 'total',
                label: {
                    normal: {
                        show: true,
                        position: 'inside'
                    }
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'top',
                            formatter: function (params: any) {
                                if (params.value > 0) {
                                    return params.value;
                                }
                                return '';
                            }
                        }
                    }
                },
                data: data?.animation_count
            }
        ]
    }
    return (
        <ReactECharts
            option={option}
            showLoading={showLoading}
            loadingOption={loadingOption}
            style={{ height: 400 }} />
    )
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
            bottom: '0%',
            width: '100%',
            height: '120px',
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
                center: ['50%', '30%'],
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
            style={{ height: 400 }} />
    )
}
type SearchParamType = {
    select_type: string
    date: Moment[] | null
}
export const StatisticsVideo: React.FC = () => {
    const { RangePicker } = DatePicker
    const [isInitCommFilter, setInitCommFilter] = useState(null)
    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [isDetailData, setDetailData] = useState<{
        id: number
        name: string
        categories_name: string
        episodecount: number
        videostatus: {
            value: number
            text: string
        }
    }[]>([])
    const [searchParamsData, setSearchParamsData] = useState<SearchParamType>({
        select_type: 'today',
        date: null
    })

    const [videPlayData, setVidePlayData] = useState(null)
    const [loadingVidePlay, setLoadingVideoPlay] = useState<boolean>(true)

    const [videoType, setVideoTypeData] = useState({ xAxis: [], series: [] })
    const [loadingVideoType, setLoadingVideoType] = useState<boolean>(true)

    const [videoCountData, setVideoCountData] = useState(null)
    const [loadingVideoCount, setLoadingVideoCount] = useState<boolean>(true)

    const [isTotal, setTotal] = useState<number>(0)
    const [isDetailQuery, setDetailQuery] = useState<{ type: number, page: number }>({ type: 1, page: 1 })
    const [isTypeDetailQuery, setTypeDetailQuery] = useState<number>(1)
    const [isPageSize, setPageSize] = useState<number>(10)
    const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: isPageSize,
        current: isDetailQuery.page,
        total: isTotal,
        showTotal: () => `共${isTotal}条`,
        onShowSizeChange: (current: number, size: number) => {
            handleChangePageSize(current, size)
        },
        onChange: (current: number) => handleChangePage(current)
    }
    const handleChangePageSize = (current: number, size: number) => {
        setPageSize(size)
    }
    const handleChangePage = (current: number) => {
        setDetailQuery({
            ...isDetailQuery,
            page: current
        })
    }

    const handleChangeType = (value: number) => {
        setPageSize(10)
        setDetailQuery({
            ...isDetailQuery,
            type: value,
            page: 1
        })
    }

    const handleChangeVideoType = (value: number) => {
        setTypeDetailQuery(value)
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
    const columns = [
        {
            title: '名称',
            dataIndex: 'video_name',
            key: 'video_name'
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type'
        },
        {
            title: '播放量',
            dataIndex: 'play_count',
            key: 'play_count'
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
    const typeBarOption = {
        legend: {},
        tooltip: {},
        grid: {
            left: '3%',
            right: '1%',
            bottom: '1%',
            containLabel: true
        },
        xAxis: { type: 'category', data: videoType.xAxis, axisLabel: { interval: 0, rotate: 30 } },
        yAxis: { type: 'value' },
        series: [{ type: 'bar', data: videoType.series }]
    }
    const initVidePaly = () => {
        setLoadingVideoPlay(true)
        let params = {
            select_type: isInitCommQuery.select_type,
            end_date: isInitCommQuery.date ? isInitCommQuery.date[0].format('YYYY-MM-DD') : '',
            start_date: isInitCommQuery.date ? isInitCommQuery.date[1].format('YYYY-MM-DD') : ''
        }
        const formData = new FormData()
        Object.keys(params).forEach((item: string) => {
            formData.append(item, String(params[item]))
        })
        postVideoPalyStatisticslApi(formData).then((res: any) => {
            if (res.code === 200) {
                let data = {
                    lists: [],
                    video_count: 0
                }
                for (let i in res.data) {
                    if (i !== 'count') {
                        data.lists.push({
                            name: i,
                            value: res.data[i]
                        })
                    } else {
                        data.video_count = res.data[i]
                    }
                }
                setVidePlayData(data)
                setLoadingVideoPlay(false)
            } else {
                setLoadingVideoPlay(false)
            }
        }).catch(() => {
            setLoadingVideoPlay(false)
        })
    }
    const initVidePlayCharts = () => {
        setLoadingTable(true)
        let params = {
            page: isDetailQuery.page,
            per_page: isPageSize,
            select_type: isInitCommQuery.select_type,
            start_date: isInitCommQuery.date ? isInitCommQuery.date[0].format('YYYY-MM-DD') : '',
            end_date: isInitCommQuery.date ? isInitCommQuery.date[1].format('YYYY-MM-DD') : ''
        }
        const formData = new FormData()
        Object.keys(params).forEach((item: string) => {
            formData.append(item, String(params[item]))
        })
        postVideoPalyChartsStatisticslApi(formData, isDetailQuery.type).then((res: any) => {
            if (res.code === 200) {
                setDetailData(res.data.data)
                setTotal(res.data.total)
                setLoadingTable(false)
            } else {
                setLoadingTable(false)
            }
        }).catch(() => {
            setLoadingTable(false)
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
    const initVideType = () => {
        setLoadingVideoType(true)
        let params = {
            select_type: isInitCommQuery.select_type,
            start_date: isInitCommQuery.date ? isInitCommQuery.date[0].format('YYYY-MM-DD') : '',
            end_date: isInitCommQuery.date ? isInitCommQuery.date[1].format('YYYY-MM-DD') : ''
        }
        const formData = new FormData()
        Object.keys(params).forEach((item: string) => {
            formData.append(item, String(params[item]))
        })
        postVideoTypeChartsStatisticslApi(formData, isTypeDetailQuery).then((res: any) => {
            if (res.code === 200) {
                let data = {
                    xAxis: [], series: []
                }
                res.data.forEach((item) => {
                    data.xAxis.push(item.type_name)
                    data.series.push(item.play_count)
                })
                setVideoTypeData(data)
                setLoadingVideoType(false)
            } else {
                setLoadingVideoType(false)
            }
        }).catch(() => {
            setLoadingVideoType(false)
        })
    }
    const initVideoCount = () => {
        setLoadingVideoCount(true)
        let params = {
            select_type: isInitCommQuery.select_type,
            start_date: isInitCommQuery.date ? isInitCommQuery.date[0].format('YYYY-MM-DD') : '',
            end_date: isInitCommQuery.date ? isInitCommQuery.date[1].format('YYYY-MM-DD') : ''
        }
        const formData = new FormData()
        Object.keys(params).forEach((item: string) => {
            formData.append(item, String(params[item]))
        })
        postVideoCountChartsStatisticslApi(formData).then((res: any) => {
            if (res.code === 200) {
                let data = {
                    xAxis: [],
                    legend: ['电影', '连续剧', '综艺', '动漫', '在线用户'],
                    movie_count: [],
                    sitcom_count: [],
                    variety_count: [],
                    animation_count: [],
                    user_count: []
                }
                res.data.movie_count.forEach((item) => {
                    data.movie_count.push({
                        name: item.old_key,
                        value: `${parseInt(item.value, 10)}`
                    })
                    data.xAxis.push(item.old_key)
                })
                res.data.sitcom_count.forEach((item) => {
                    data.sitcom_count.push({
                        name: item.old_key,
                        value: `${parseInt(item.value, 10)}`
                    })
                })
                res.data.variety_count.forEach((item) => {
                    data.variety_count.push({
                        name: item.old_key,
                        value: `${parseInt(item.value, 10)}`
                    })
                })
                res.data.animation_count.forEach((item) => {
                    data.animation_count.push({
                        name: item.old_key,
                        value: `${parseInt(item.value, 10)}`
                    })
                })
                setVideoCountData(data)
                setLoadingVideoCount(false)
            } else {
                setLoadingVideoCount(false)
            }
        }).catch(() => {
            setLoadingVideoCount(false)
        })
    }

    useEffect(() => {
        initFilter()
    }, [])
    useEffect(() => {
        initVidePaly()
        initVideoCount()
    }, [isInitCommQuery])
    useEffect(() => {
        initVideType()
    }, [isTypeDetailQuery, isInitCommQuery])
    useEffect(() => {
        initVidePlayCharts()
    }, [isDetailQuery, isPageSize, isInitCommQuery])
    return (
        <Row gutter={[12, 40]}>
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

            <Col span={8}>
                <Card title="播放占比" bordered={false}>
                    <ChartPie
                        data={videPlayData}
                        showLoading={loadingVidePlay} />
                </Card>
            </Col>
            <Col span={16}>
                <Card title="视频类型播放统计" bordered={false}>
                    <Select
                        style={{
                            position: 'absolute',
                            left: 24,
                            zIndex: 1,
                            width: 200
                        }}
                        value={isTypeDetailQuery}
                        onChange={(e) => { handleChangeVideoType(e) }}>
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
                        showLoading={loadingVideoType}
                        style={{ height: 400 }} />
                </Card>
            </Col>
            <Col span={14}>
                <Card title="播放量统计" bordered={false}>
                    {
                        videoCountData
                        && (
                            <RechargePillarBar
                                data={videoCountData}
                                showLoading={loadingVideoCount} />
                        )
                    }
                </Card>
            </Col>
            <Col span={10}>
                <Card title="TOP100 播放量" bordered={false}>
                    <Select
                        style={{
                            marginBottom: 10,
                            width: 200
                        }}
                        value={isDetailQuery.type}
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

                    <Table
                        rowKey="video_info_id"
                        loading={loadingTable}
                        columns={columns}
                        dataSource={isDetailData}
                        pagination={paginationProps} />
                </Card>
            </Col>
        </Row>
    )
}
