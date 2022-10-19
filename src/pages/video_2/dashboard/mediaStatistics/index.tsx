import React, { useEffect, useRef, useState } from 'react'
import type { RadioChangeEvent } from 'antd';
import { Input, Row, Col, Table, Radio, Select, Card, Form, Button, DatePicker, message } from 'antd'
import { Moment } from 'moment/moment'
import {
    postMediaStatisticsAuditApi,
    postMediaStatisticsDetailApi,
    postMediaStatisticsFilterApi,
    postMediaStatisticsStatusApi
} from '@/request'
import ReactECharts from 'echarts-for-react'

type AuditType = {
    department: number
    episode: number
}
const MediaStatistics: React.FC = () => {
    const { RangePicker } = DatePicker

    const [isInitCommFilter, setInitCommFilter] = useState(null)
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

    /**
     * 通用筛选
     */
    const [isInitCommQuery, setInitCommQuery] = useState<{
        date:(Moment | string)[]
        select_type: string
            }>({
                select_type: undefined,
                date: ['', '']
            })
    const changeDateSelect = ({ target: { value } }: RadioChangeEvent) => {
        console.log('changeDateSelect checked', value);
        setInitCommQuery({
            select_type: value,
            date: ['', '']
        });
    };
    const changeDate = (value: Moment[]) => {
        if (value) {
            setInitCommQuery({
                select_type: undefined,
                date: [value[0], value[1]]
            })
        } else {
            setInitCommQuery({
                ...isInitCommQuery,
                date: ['', '']
            })
        }
    }
    const reset = () => {
        setInitCommQuery({
            select_type: undefined,
            date: ['', '']
        })
    }
    useEffect(() => {
        initFilter()
    }, [])

    /**
     * 审核筛选
     */
    const [isAuditQuery, setAuditQuery] = useState<{
        date:(Moment | string)[]
        select_type: string
        categories: number
            }>({
                select_type: undefined,
                date: ['', ''],
                categories: 0
            })
    const [isAuditData, setAuditData] = useState<{
        audited: AuditType
        obereviewed: AuditType
        alwaysupload: AuditType
        encryption: AuditType
            }>(null)
    const fetchAuditData = () => {
        const query = {
            /* @ts-ignore */
            start_date: isAuditQuery.date[0] ? isAuditQuery.date[0].format('YYYY-MM-DD') : '',
            /* @ts-ignore */
            end_date: isAuditQuery.date[1] ? isAuditQuery.date[1].format('YYYY-MM-DD') : '',
            select_type: isAuditQuery.select_type,
            categories: isAuditQuery.categories
        }

        postMediaStatisticsAuditApi(query)
            .then((res: any) => {
                switch (res.code) {
                    case 200:
                        setAuditData(res.data)
                        break
                    default:
                        message.error(res.message).then()
                }
            })
            .catch(() => {
                message.error('网络错误').then()
            })
    }
    const handleChangeAudit = (value: number) => {
        setAuditQuery({
            ...isAuditQuery,
            categories: value
        })
    }
    useEffect(() => {
        setAuditQuery({
            ...isInitCommQuery,
            categories: 0
        })
    }, [isInitCommQuery.date, isInitCommQuery.select_type])
    useEffect(() => {
        fetchAuditData()
    }, [isAuditQuery])

    /**
     * 视频状态
     */
    const [isStatusQuery, setStatusQuery] = useState<{
        date:(Moment | string)[]
        select_type: string
        categories: number
        video_status: number
            }>({
                select_type: undefined,
                date: ['', ''],
                categories: 0,
                video_status: 0
            })
    const [isStatusData, setStatusData] = useState<[
        React.Key[]
    ] | []>([])
    const [isBarLoading, setBarLoading] = useState<boolean>(true)
    const handleData = (data: {
        text: string
        value: number
        num: {
            department: number
            episode: number
        }
    }[]) => {
        const source:[React.Key[]] = [
            ['type', '部', '集']
        ]
        data.forEach((item) => {
            source.push([item.text, item.num.department, item.num.episode])
        })

        setStatusData(source)
        setBarLoading(false)
    }
    const fetchStatusData = () => {
        setBarLoading(true)
        const query = {
            /* @ts-ignore */
            start_date: isStatusQuery.date[0] ? isStatusQuery.date[0].format('YYYY-MM-DD') : '',
            /* @ts-ignore */
            end_date: isStatusQuery.date[1] ? isStatusQuery.date[1].format('YYYY-MM-DD') : '',
            select_type: isStatusQuery.select_type,
            categories: isStatusQuery.categories,
            video_status: isStatusQuery.video_status
        }

        postMediaStatisticsStatusApi(query)
            .then((res: any) => {
                switch (res.code) {
                    case 200:
                        handleData(res.data)
                        break
                    default:
                        message.error(res.message).then()
                }
            })
            .catch(() => {
                message.error('网络错误').then()
            })
    }
    const handleChangeStatus = (value: number) => {
        setStatusQuery({
            ...isInitCommQuery,
            categories: 0,
            video_status: value
        })
    }
    useEffect(() => {
        setStatusQuery({
            ...isInitCommQuery,
            categories: 0,
            video_status: 0
        })
    }, [isInitCommQuery.date, isInitCommQuery.select_type])
    useEffect(() => {
        fetchStatusData()
    }, [isStatusQuery])
    const statusBarOption = {
        legend: {},
        tooltip: {},
        dataset: {
            source: isStatusData
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [{ type: 'bar' }, { type: 'bar' }]
    }

    /**
     * 视频明细
     */
    const [isDetailQuery, setDetailQuery] = useState<{
        date:(Moment | string)[]
        select_type: string
        categories: number
        video_status: number
        name: string
        page: number
            }>({
                select_type: undefined,
                date: ['', ''],
                categories: 0,
                video_status: 0,
                name: '',
                page: 1
            })
    const [isPageSize, setPageSize] = useState<number>(10)
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
    const [isTotal, setTotal] = useState<number>(0)
    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const fetchDetailData = () => {
        setLoadingTable(true)
        const query = {
            /* @ts-ignore */
            start_date: isDetailQuery.date[0] ? isDetailQuery.date[0].format('YYYY-MM-DD') : '',
            /* @ts-ignore */
            end_date: isDetailQuery.date[1] ? isDetailQuery.date[1].format('YYYY-MM-DD') : '',
            select_type: isDetailQuery.select_type,
            categories: isDetailQuery.categories,
            video_status: isDetailQuery.video_status,
            name: isDetailQuery.name,
            per_page: isPageSize,
            page: isDetailQuery.page
        }
        postMediaStatisticsDetailApi(query)
            .then((res: any) => {
                switch (res.code) {
                    case 200:
                        setDetailData(res.data.data)
                        setTotal(res.data.total)
                        setLoadingTable(false)
                        break
                    default:
                        message.error(res.message).then()
                }
            })
            .catch(() => {
                message.error('网络错误').then()
            })
    }
    const handleChangeDetailAudit = (value: number) => {
        setDetailQuery({
            ...isDetailQuery,
            categories: value,
            page: 1
        })
        setPageSize(10)
    }
    const handleChangeDetailStatus = (value: number) => {
        setDetailQuery({
            ...isDetailQuery,
            video_status: value,
            page: 1
        })
        setPageSize(10)
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
    const onSearch = (value: string) => {
        setDetailQuery({
            ...isDetailQuery,
            name: value,
            page: 1
        })
        setPageSize(10)
    }
    const resetDetail = () => {
        setDetailQuery({
            ...isInitCommQuery,
            categories: 0,
            video_status: 0,
            name: '',
            page: 1
        })
        setPageSize(10)
    }
    useEffect(() => {
        setDetailQuery({
            ...isInitCommQuery,
            categories: 0,
            video_status: 0,
            name: '',
            page: 1
        })
        setPageSize(10)
    }, [isInitCommQuery.date, isInitCommQuery.select_type])
    useEffect(() => {
        fetchDetailData()
    }, [isDetailQuery, isPageSize])

    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (text: any, record: any, index: number) => `${(isDetailQuery.page - 1) * isPageSize + (index + 1)}`
        },
        {
            title: '片名',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '类型',
            dataIndex: 'categories_name',
            key: 'categories_name'
        },
        {
            title: '剧集',
            dataIndex: 'episodecount',
            key: 'episodecount'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (_: any, item: any) => (
                item.videostatus.text
            )
        }
    ]
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

    return (
        <Row gutter={[12, 40]}>
            <Col span={24}>
                <Card>
                    <Form layout="inline">
                        <Form.Item>
                            <Radio.Group
                                onChange={changeDateSelect}
                                value={isInitCommQuery.select_type}>
                                <Radio.Button value={undefined}>全部</Radio.Button>
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
                <Card title="视频审核统计">
                    <Form layout="inline" style={{ marginBottom: '20px' }}>
                        <Form.Item>
                            <Select
                                style={{ width: 160 }}
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
                        </Form.Item>
                    </Form>
                    <Row gutter={[12, 40]}>
                        <Col span={12}>
                            <Card title="已审核视频">
                                <p>
                                    {isAuditData?.audited.department}
                                    部
                                </p>
                                <p>
                                    {' '}
                                    {isAuditData?.audited.episode}
                                    集
                                </p>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="完成加密待审核">
                                <p>
                                    {isAuditData?.obereviewed.department}
                                    部
                                </p>
                                <p>
                                    {isAuditData?.obereviewed.episode}
                                    集
                                </p>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="总上传视频">
                                <p>
                                    {isAuditData?.alwaysupload.department}
                                    部
                                </p>
                                <p>
                                    {isAuditData?.alwaysupload.episode}
                                    集
                                </p>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card title="加密中视频">
                                <p>
                                    {isAuditData?.encryption.department}
                                    部
                                </p>
                                <p>
                                    {isAuditData?.encryption.episode}
                                    集
                                </p>
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </Col>
            <Col span={16}>
                <Card title="视频状态">
                    <Form layout="inline" style={{ marginBottom: '20px' }}>
                        <Form.Item>
                            <Select
                                style={{ width: 160 }}
                                value={isStatusQuery.video_status}
                                onChange={(e) => { handleChangeStatus(e) }}>
                                {
                                    isInitCommFilter?.status.map((item) => (
                                        <Select.Option
                                            key={item.text}
                                            value={item.value}>
                                            {item.text}
                                        </Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                    <ReactECharts
                        option={statusBarOption}
                        showLoading={isBarLoading}
                        style={{ height: 400 }} />

                </Card>
            </Col>

            <Col span={24}>
                <Card title="视频明细">
                    <Form layout="inline" style={{ marginBottom: '20px' }}>
                        <Form.Item>
                            <Select
                                style={{ width: 160 }}
                                value={isDetailQuery.categories}
                                onChange={(e) => { handleChangeDetailAudit(e) }}>
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
                        </Form.Item>
                        <Form.Item>
                            <Select
                                style={{ width: 160 }}
                                value={isDetailQuery.video_status}
                                onChange={(e) => { handleChangeDetailStatus(e) }}>
                                {
                                    isInitCommFilter?.status.map((item) => (
                                        <Select.Option
                                            key={item.text}
                                            value={item.value}>
                                            {item.text}
                                        </Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Input.Search
                                placeholder="视频名称搜索"
                                allowClear
                                onSearch={onSearch}
                                style={{ width: 200 }} />
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="reset" onClick={resetDetail}>重置</Button>
                        </Form.Item>
                    </Form>
                    <Table
                        rowKey="id"
                        loading={loadingTable}
                        columns={columns}
                        dataSource={isDetailData}
                        pagination={paginationProps} />
                </Card>
            </Col>
        </Row>
    )
}

export default MediaStatistics
