import { Row, Button, Card, Col, Form, DatePicker, Input, Select, message, Table, Space, Modal } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { Moment } from 'moment/moment'
import {
    deleteMediaSeriesApi,
    postMediaRelatedMediaDataApi, postMediaSeriesAddApi,
    postMediaSeriesDataApi,
    postMediaSeriesFilterApi,
    postMediaSeriesReadDataApi, postMediaSeriesUpdateApi
} from '@/request'
import DebounceSelect from '@/components/debounceSelect'

const VideoSeries = () => {
    const { RangePicker } = DatePicker

    const [isInitFilter, setInitFilter] = useState(null)
    const initFilter = () => {
        postMediaSeriesFilterApi()
            .then((res: any) => {
                switch (res.code) {
                    case 200:
                        setInitFilter({
                            type: res.data
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
    useEffect(() => {
        initFilter()
    }, [])

    const [isInitCommQuery, setInitCommQuery] = useState<{
        seriesname: string
        date:(Moment | string)[]
        cid: number
        page: number
            }>({
                seriesname: '',
                date: ['', ''],
                cid: 0,
                page: 1
            })
    const [isPageSize, setPageSize] = useState<number>(10)
    const [isData, setData] = useState<{
        id: number
        seriesname: string
        created_at: string
        categories_name: string
        series_count: number
    }[]>([])
    const [isTotal, setTotal] = useState<number>(0)
    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const fetchData = () => {
        setLoadingTable(true)
        const query = {
            /* @ts-ignore */
            start_date: isInitCommQuery.date[0] ? isInitCommQuery.date[0].format('YYYY-MM-DD') : '',
            /* @ts-ignore */
            end_date: isInitCommQuery.date[1] ? isInitCommQuery.date[1].format('YYYY-MM-DD') : '',
            seriesname: isInitCommQuery.seriesname,
            cid: isInitCommQuery.cid,
            per_page: isPageSize,
            page: isInitCommQuery.page
        }
        postMediaSeriesDataApi(query)
            .then((res: any) => {
                switch (res.code) {
                    case 200:
                        setData(res.data.data)
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
    const onSearch = (value: string) => {
        setInitCommQuery({
            ...isInitCommQuery,
            seriesname: value,
            page: 1
        })
        setPageSize(10)
    }
    const changeDate = (value: Moment[]) => {
        if (value) {
            setInitCommQuery({
                ...isInitCommQuery,
                date: [value[0], value[1]],
                page: 1
            })
            setPageSize(10)
        } else {
            setInitCommQuery({
                ...isInitCommQuery,
                date: ['', ''],
                page: 1
            })
            setPageSize(10)
        }
    }
    const changeMediaType = (value: number) => {
        setInitCommQuery({
            ...isInitCommQuery,
            cid: value
        })
    }
    const handleChangePageSize = (current: number, size: number) => {
        setPageSize(size)
    }
    const handleChangePage = (current: number) => {
        setInitCommQuery({
            ...isInitCommQuery,
            page: current
        })
    }
    const reset = () => {
        setInitCommQuery({
            seriesname: '',
            date: ['', ''],
            cid: 0,
            page: 1
        })
        setPageSize(10)
    }

    useEffect(() => {
        fetchData()
    }, [isInitCommQuery, isPageSize])

    const [isShowModal, setShowModal] = useState<boolean>(false)
    const handleUpdate = (id?: number) => {
        if (id) {
            const query = {
                id
            }
            postMediaSeriesReadDataApi(query)
                .then((res: any) => {
                    switch (res.code) {
                        case 200:
                            const list: number[] = []
                            const mediaList: React.ReactNode[] = []
                            const oplist: { key: number, label: string, value: number }[] = []

                            res.data.series_infos.forEach((item) => {
                                list.push(item.vid)
                                mediaList.push(<Option key={item.vid} value={item.vid}>{item.video_name}</Option>)
                                oplist.push({ key: item.vid, label: item.video_name, value: item.vid })
                            })
                            setInitModalQuery({
                                id: res.data.id,
                                seriesname: res.data.seriesname,
                                cid: res.data.cid,
                                vid: list
                            })
                            setRelationValue(oplist)
                            setMediaList(mediaList)
                            break
                        default:
                            message.error(res.message).then()
                    }
                })
                .catch(() => {
                    message.error('网络错误1').then()
                })
        }
        setShowModal(true)
    }
    const handleDel = (id: number) => {
        const query = {
            id
        }

        deleteMediaSeriesApi(query)
            .then((res: any) => {
                switch (res.code) {
                    case 200:
                        fetchData()
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
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (text: any, record: any, index: number) => `${(isInitCommQuery.page - 1) * isPageSize + (index + 1)}`
        },
        {
            title: '系列名称',
            dataIndex: 'seriesname',
            key: 'seriesname'
        },
        {
            title: '类型',
            dataIndex: 'categories_name',
            key: 'categories_name'
        },
        {
            title: '关联视频量',
            dataIndex: 'series_count',
            key: 'series_count'
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (v: any, item: any) => (
                <Space>
                    <Button
                        type="link"
                        onClick={() => { handleUpdate(item.id) }}>
                        编辑
                    </Button>
                    <Button
                        type="link"
                        onClick={() => { handleDel(item.id) }}>
                        删除
                    </Button>
                </Space>
            ),
            align: 'center'
        }
    ]
    const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: isPageSize,
        current: isInitCommQuery.page,
        total: isTotal,
        showTotal: () => `共${isTotal}条`,
        onShowSizeChange: (current: number, size: number) => {
            handleChangePageSize(current, size)
        },
        onChange: (current: number) => handleChangePage(current)
    }

    /**
     * Modal
     */
    const { Option } = Select
    const fuzzySearchTimer = useRef<NodeJS.Timeout>(null)
    const clearTimer = (timer: NodeJS.Timeout) => {
        clearTimeout(timer)
        timer = null
    }

    const [isMediaList, setMediaList] = useState<React.ReactNode[]>([])
    const [relationValue, setRelationValue] = useState([]);

    const [isInitModalQuery, setInitModalQuery] = useState<{
        id?: number
        seriesname: string
        cid: number
        vid: number[]
    }>({
        seriesname: '',
        cid: 1,
        vid: []
    })
    const handleCancel = () => {
        setRelationValue([])
        setShowModal(false)
    }
    const handleConfirm = () => {
        const query = isInitModalQuery.id ? {
            id: isInitModalQuery.id,
            seriesname: isInitModalQuery.seriesname,
            cid: isInitModalQuery.cid,
            // vid: isInitModalQuery.vid.join(','),
            vid: relationValue.map((v) => v.value).join(',')
        } : {
            seriesname: isInitModalQuery.seriesname,
            cid: isInitModalQuery.cid,
            // vid: isInitModalQuery.vid.join(','),
            vid: relationValue.map((v) => v.value).join(',')
        }

        const handleApi = isInitModalQuery.id ? postMediaSeriesUpdateApi : postMediaSeriesAddApi
        handleApi(query)
            .then((res: any) => {
                switch (res.code) {
                    case 200:
                        fetchData()
                        handleCancel()
                        break
                    default:
                        message.error(res.message).then()
                }
            })
            .catch(() => {
                message.error('网络错误').then()
            })
    }

    const updateMediaList = () => {
        if (!isInitModalQuery.seriesname || !isInitModalQuery.cid) return

        const query = {
            keyword: isInitModalQuery.seriesname,
            cid: isInitModalQuery.cid
        }

        postMediaRelatedMediaDataApi(query)
            .then((res: any) => {
                switch (res.code) {
                    case 200:
                        const mediaList: React.ReactNode[] = []
                        res.data.forEach((item) => {
                            mediaList.push(<Option key={item.id} value={item.id}>{item.name}</Option>)
                        })
                        setMediaList(mediaList)
                        break
                    default:
                        message.error(res.message).then()
                }
            })
            .catch(() => {
                message.error('网络错误').then()
            })
    }

    // useEffect(() => {
    //     if (fuzzySearchTimer.current) clearTimer(fuzzySearchTimer.current)

    //     fuzzySearchTimer.current = setTimeout(() => {
    //         updateMediaList()
    //         clearTimer(fuzzySearchTimer.current)
    //     }, 600)
    // }, [isInitModalQuery.seriesname, isInitModalQuery.cid])

    const changeModalSeries = (value: string) => {
        setInitModalQuery({
            ...isInitModalQuery,
            seriesname: value,
            vid: []
        })
    }
    const changeModalMediaType = (value: number) => {
        setInitModalQuery({
            ...isInitModalQuery,
            cid: value,
            vid: []
        })
    }
    const changeModalMedia = (value: number[]) => {
        setInitModalQuery({
            ...isInitModalQuery,
            vid: value
        })
    }

    // const [relationValue, setRelationValue] = useState({ value: 15, label: '恐吓', key: 15 });
    const fetchRelationList = async (name: string): Promise<any[]> => {
        return new Promise((resolve) => {
            if (!name || !isInitModalQuery.cid) {
                resolve([])
                return
            }
            const query = {
                keyword: name,
                cid: isInitModalQuery.cid
            }
            postMediaRelatedMediaDataApi(query).then((res: any) => {
                let arr = []
                res.data.forEach((element) => {
                    arr.push({ key: element.id, label: element.name, value: element.id })
                });
                resolve(arr);
            }).catch(() => {
                resolve([]);
            })
        })
    }

    useEffect(() => {
        if (!isShowModal) {
            setInitModalQuery({
                seriesname: '',
                cid: 1,
                vid: []
            })
        }
    }, [isShowModal])

    return (
        <>
            <Row gutter={[12, 40]}>
                <Col span={24}>
                    <Card>
                        <Form layout="inline">
                            <Form.Item>
                                <RangePicker
                                    placeholder={['起始时间', '结束时间']}
                                    // @ts-ignore
                                    value={isInitCommQuery.date}
                                    onChange={changeDate}
                                    allowClear />
                            </Form.Item>
                            <Form.Item>
                                <Select
                                    style={{ width: 160 }}
                                    value={isInitCommQuery.cid}
                                    onChange={(e) => { changeMediaType(e) }}>
                                    {
                                        isInitFilter?.type.map((item) => (
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
                                    placeholder="系列名称"
                                    allowClear
                                    onSearch={onSearch}
                                    style={{ width: 200 }} />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    htmlType="reset"
                                    onClick={reset}>
                                    重置
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
                <Col span={24}>
                    <Card>
                        <Button
                            style={{ marginBottom: '20px' }}
                            type="primary"
                            onClick={() => { handleUpdate() }}>
                            创建
                        </Button>
                        <Table
                            rowKey="id"
                            loading={loadingTable}
                            /* @ts-ignore */
                            columns={columns}
                            dataSource={isData}
                            pagination={paginationProps} />
                    </Card>
                </Col>
            </Row>
            <Modal
                centered
                closable={false}
                title={<div style={{ textAlign: 'center' }}>系列</div>}
                visible={isShowModal}
                width={600}
                destroyOnClose
                onCancel={handleCancel}
                onOk={handleConfirm}>
                <Form>
                    <Form.Item label="系列名称">
                        <Input
                            value={isInitModalQuery.seriesname}
                            onChange={(e) => { changeModalSeries(e.target.value) }}
                            allowClear />
                    </Form.Item>
                    <Form.Item label="所属类型">
                        <Select
                            value={isInitModalQuery.cid}
                            onChange={(e) => { changeModalMediaType(e) }}>
                            {
                                isInitFilter?.type.map((item) => (
                                    item.value !== 0 && (
                                        <Select.Option
                                            key={item.text}
                                            value={item.value}>
                                            {item.text}
                                        </Select.Option>
                                    )
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="关联影片">
                        {/* <Select
                            mode="multiple"
                            value={isInitModalQuery.vid}
                            onChange={changeModalMedia}>
                            {isMediaList}
                        </Select> */}
                        <DebounceSelect
                            mode="multiple"
                            allowClear
                            autoClearSearchValue
                            value={relationValue}
                            fetchOptions={fetchRelationList}
                            onChange={(newValue) => { setRelationValue(newValue) }} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default VideoSeries
