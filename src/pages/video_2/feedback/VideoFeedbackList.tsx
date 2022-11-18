import BaseTable from '@/components/base/BaseTable'
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm'
import { getFeedbackDetailApi_2, getFeedbackListApi_2 } from '@/request/api/video_2/feedback'
import { feedbackStatusOp } from '@/type'
import { momentToTime } from '@/utils'
import { Button, Card, Col, Image, Row, Select, Space } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import FeedbackDetail from './components/FeedbackDetail'

type dataSourceType = {
    id: number
    user_id: string
    user_ip: string
    question: string
    message_type: string  // ? 不用管
    image: string
    status: number  // 1用户发送  2管理员发送
    is_reply: number  // 0 未回复  1已回复
    is_read: number  // 0 已读   1 已读
    created_at: string
    updated_at: string
}

type queryParamsType = {
    user_id: string
    is_reply: number
    start_time: string
    end_time: string
}

enum REPLYSTATUS {
    DONE = 1,
    UNDONE = 0
}

export const VideoFeedbackList: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState<string>('')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [total, setTotal] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [dataSource, setDataSource] = useState<dataSourceType[]>([])
    const [queryParams, setQueryParams] = useState<queryParamsType>({
        user_id: "",
        is_reply: 0,
        start_time: "",
        end_time: ""
    })
    const [initQueryParams, setInitQueryParams] = useState<queryParamsType>({
        user_id: "",
        is_reply: 0,
        start_time: "",
        end_time: ""
    })

    useEffect(() => {
        getDataList()
    }, [queryParams, currentPage, pageSize])

    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'user_id',
                placeholder: '用户ID搜索',
                type: 'input',
                width: 200
            },
            {
                name: 'is_reply',
                placeholder: '状态',
                type: 'select',
                allowClear: false,
                selectOp: feedbackStatusOp,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
                width: 100
            },
            {
                name: 'date',
                type: 'rangePicker'
            }
        ],
        []
    )

    const paramsData = {
        list: dataSource,
        page: {
            dataTotal: total,
            page: currentPage,
            size: pageSize,
        },
        showPagination: true,
        columns: [
            {
                title: 'ID',
                dataIndex: 'id',
                align: 'center',
            },
            {
                title: '用户ID',
                dataIndex: 'user_id',
                align: 'center',
            },
            {
                title: '用户IP',
                dataIndex: 'user_ip',
                align: 'center',
            },
            {
                title: '反馈内容',
                dataIndex: 'question',
                align: 'left',
                render: (_, record) => (
                    <div>
                        <span>Q: {record.question}</span><br />
                        {
                            record.image != '' ? <Image style={{ objectFit: 'contain', }} src={record.image} height={80}></Image> : ''
                        }
                    </div>
                )
            },
            {
                title: '状态',
                dataIndex: 'is_reply',
                align: 'center',
                render: (text, record, index) => (
                    // 当前行的值，当前行数据，行索引
                    <span style={ text == REPLYSTATUS.UNDONE ? { color: 'red' } : {}} >
                        {text == REPLYSTATUS.DONE ? '已回复' : '未回复'}
                    </span>
                )
            },
            {
                title: '时间',
                dataIndex: 'created_at',
                align: 'center',
                render: (_, record, index) => (
                    <span>
                        <span>提交：{record.created_at}</span><br />
                        {
                            record.updated_at != ''
                            ? <span>回复：{record.updated_at}</span>
                            : ''
                        }
                    </span>
                )
            },
            {
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
                render: (_, record) => (
                    <Space>
                        <Button
                            type='link'
                            onClick={() => hanleItem(record)}
                        >
                            回复
                        </Button>
                    </Space>
                )
            },
        ],
    }

    const getDataList = async () => {
        setLoading(true)
        const params = {
            per_age: pageSize,
            page: currentPage,
            ...queryParams
        }
        console.log('-----getDataList------');
        console.log(params);
        try {
            let res: any = await getFeedbackListApi_2(params)

            /* res = {
                status: "success",
                code: 200,
                message: "",
                data: {
                    current_page: 1,
                    data: [
                        {
                            id: 1,
                            user_id: "1553",
                            user_ip: "",
                            question: "朴树到此一游",
                            message_type: 1, // '',//
                            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYTUmKutaNfCXtTUe9QDE0WTHkxMU8QAa-Og&usqp=CAU",
                            status: 1,       // 1用户发送  2管理员发送
                            is_reply: 0,    // 0 未回复  1已回复
                            is_read: 1,     // 0 已读   1 已读
                            created_at: "2022-10-17 17:43:21",
                            updated_at: "2022-10-17 17:43:21"
                        }
                    ],
                    from: 1,
                    last_page: 1,
                    per_page: "10",
                    to: 2,
                    total: 2
                }
            }
            console.log('fakeRes');
            console.log(res); */
            setCurrentPage(res?.data?.current_page)
            setTotal(res?.data?.total)
            setPageSize(res?.data?.per_page)
            setDataSource(res?.data?.data)

        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    const hanleItem = (item) => {
        console.log('----------hanleItem----------');
        console.log(item);
        setSelectedUserId(item.user_id)
        setIsModalVisible(true)
    }

    const onSearch = (params) => {
        console.log('------onSearch-----');
        console.log(params);
        const data = {
            user_id: params.user_id,
            is_reply: params.is_reply,
            start_time: params.date ? momentToTime(params.date[0], 'YYYY-MM-DD') : '',
            end_time: params.date ? momentToTime(params.date[1], 'YYYY-MM-DD') : '',
        }
        setCurrentPage(1)
        setQueryParams(data)
    }

    const onChange = (pageParams) => {
        // console.log('-------onChange-------');
        setCurrentPage(pageParams.current)
        setPageSize(pageParams.pageSize)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }
    const handleOk = () => {
        setIsModalVisible(false)
        getDataList()
    }

    return (
        <>
            <Row gutter={[12, 30]}>
                <Col span={24}>
                    <SearchForm
                        params={initQueryParams}
                        formList={formList}
                        onSearch={onSearch} />
                </Col>
                <Col span={24}>
                    <Card>
                        <BaseTable
                            loading={loading}
                            data={paramsData}
                            onChange={onChange} />
                    </Card>
                </Col>
            </Row>
            {
                isModalVisible
                    ?<FeedbackDetail
                        visible={isModalVisible}
                        selectedUserId={selectedUserId}
                        onCancel={handleCancel}
                        onOk={handleOk}
                    />
                    : null

            }

        </>
    )
}