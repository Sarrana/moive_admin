import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, Card, message, Switch, Modal, Form, Input, Select, Space, Image } from 'antd'
import { getVideoSearchListApi, delVideoSearchApi, getVideoAllSiteApi, updateUserAgreementsStatuslApi } from '@/request'
import BaseTable from '@/components/base/BaseTable'
import SearchForm, { SearchFormItem } from '@/components/searchForm';
import { Moment } from 'moment/moment'

type BaseDataType = {
    created_at: string
    guard_name: string
    id: number
    keyword: string
    result: string
    result_text: string
    user_id: number
    user_name: string
    web_id: number
    web_name: string
}

type ParamsDataType = {
    content: string
    id: number
    name: string
    web_id: number
    status: number
}
type AddModalPropType = {
    dataSource: ParamsDataType
    webData: WebDataType[]
    visible: boolean
    handleCancel: () => void
    handleOk: (params: ParamsDataType) => void
}

const AddModal: React.FC<AddModalPropType> = (P) => {
    const { dataSource, visible, webData, handleCancel, handleOk } = P
    const [form] = Form.useForm();
    const [params, setParams] = useState<ParamsDataType>({
        name: dataSource.name,
        content: dataSource.content,
        id: dataSource.id,
        web_id: dataSource.web_id,
        status: dataSource.status
    })
    const onFinish = () => {
        form.validateFields().then((values: any) => {
            values.status = values.status == 1 ? 1 : 2
            handleOk({ ...params, ...values })
        })
    }
    const changeStatus = (e: boolean) => {
        setParams({
            ...params,
            status: e ? 1 : 2
        })
    }
    return (
        <Modal
            title={dataSource.id ? '编辑' : '创建'}
            visible={visible}
            width={800}
            centered
            onCancel={handleCancel}
            okText="保存"
            cancelText="取消"
            onOk={onFinish}>
            <Form
                name="basic"
                labelCol={{ span: 4 }}
                autoComplete="off"
                form={form}
                initialValues={params || {}}>
                <Form.Item label="模块名称" name="name" rules={[{ required: true, message: '请输入模块名称' }, { min: 2, max: 50, message: '请输入长度2-50之间的字符' }]}>
                    <Input
                        placeholder="请输入模块名称"
                        allowClear />
                </Form.Item>
                <Form.Item label="路径" name="name" rules={[{ required: true, message: '请输入路径' }, { min: 2, max: 50, message: '请输入长度2-50之间的字符' }]}>
                    <Input
                        placeholder="请输入路径"
                        allowClear />
                </Form.Item>
                <Form.Item label="使用网站" name="web_id" rules={[{ required: true, message: '请选择使用网站' }]}>
                    <Select
                        style={{ width: 200 }}
                        placeholder="请选择使用网站">
                        {
                            webData && webData.map((item) => (
                                <Select.Option
                                    value={item.value}
                                    key={item.value}>
                                    {item.name}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="备注" name="name" rules={[{ required: true, message: '请输入备注' }, { min: 2, max: 50, message: '请输入长度2-50之间的字符' }]}>
                    <Input
                        placeholder="请输入备注"
                        allowClear />
                </Form.Item>
                <Form.Item
                    label="使用状态"
                    name="status">
                    <Switch
                        onClick={(e) => { changeStatus(e) }}
                        checked={params.status === 1} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
type WebDataType = {
    name: string
    value: number
}
type SearchParamType = {
    keywords: string
    web_id: string
    guard_name: string
    result: string
    user_from: string
    date: Moment[] | null
}
export const ContentSortSetting: React.FC = () => {
    const navigate = useNavigate();
    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState<BaseDataType[]>()
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [dataTotal, setDataTotal] = useState<number>(0)
    const [baseDetail, setBaseDetail] = useState<ParamsDataType | null>(null)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [webData, setWebData] = useState<WebDataType[] | null>(null)
    const [searchParamsData, setSearchParamsData] = useState<SearchParamType>({
        keywords: '',
        web_id: '',
        guard_name: '',
        result: '',
        user_from: '',
        date: null
    })
    const paramsData = {
        list: baseData,
        columns: [
            {
                title: '#',
                dataIndex: 'id',
                key: 'id',
                align: 'center',
                render: (text: any, record: any, index: number) => `${index + 1}`
            },
            {
                title: '视频封面',
                dataIndex: 'pic',
                key: 'pic',
                render: (text: any, item: any) => (<Image src={item.pic} width={80} />),
                align: 'center'
            },
            {
                title: '视频名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '视频分类',
                dataIndex: 'cid_text',
                key: 'cid_text',
                align: 'center'
            },
            {
                title: '视频类型',
                dataIndex: 'type',
                key: 'type',
                align: 'center'
            },
            {
                title: '视频简介',
                dataIndex: 'introduction',
                key: 'introduction',
                align: 'center'
            },
            {
                title: '上传剧集',
                dataIndex: 'video_episodes_count',
                key: 'video_episodes_count',
                align: 'center'
            },
            {
                title: '视频总数',
                dataIndex: 'total',
                key: 'total',
                align: 'center'
            },
            {
                title: '连载状态',
                dataIndex: 'video_mode_text',
                key: 'video_mode_text',
                align: 'center'
            },
            {
                title: '发布状态',
                dataIndex: 'release',
                key: 'release',
                align: 'center'
            },
            {
                title: '定时发布',
                dataIndex: 'release',
                key: 'release',
                align: 'center'
            },
            {
                title: '地区',
                dataIndex: 'area',
                key: 'area',
                align: 'center'
            },
            {
                title: '年代',
                dataIndex: 'year',
                key: 'year',
                align: 'center'
            },
            {
                title: '综合评分',
                dataIndex: 'score',
                key: 'score',
                align: 'center'
            },
            {
                title: '播放量',
                dataIndex: 'playamount',
                key: 'playamount',
                align: 'center'
            },
            {
                title: '状态',
                dataIndex: 'state',
                key: 'state',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: (v: any, item: any) => (
                    <Space direction="vertical" size={[4, 4]}>
                        <Space size={[4, 4]}>
                            <Button type="link" size="small" onClick={() => { }}>编辑</Button>
                            <Button type="link" size="small" onClick={() => { }}>上移</Button>
                            <Button type="link" size="small" onClick={() => { }}>下移</Button>
                        </Space>
                    </Space>
                ),
                align: 'center'
            }
        ],
        showPagination: true,
        page: { dataTotal, page, size: per_page }
    }
    const onChange = (pageParams) => {
        setPage(pageParams.current)
        setPer_page(pageParams.pageSize)
    }
    const handleDel = (id: number) => {
        delVideoSearchApi(id).then((res: any) => {
            if (res.code == 200) {
                message.success(res.message)
                initData()
            } else {
                message.error(res.message)
            }
        }).catch((e) => {
            // message.error(e)
        })
    }
    const handleItem = (id: number) => {
        // setLoadingTable(true)
        // getUserAgreementsDetailApi(id).then((res: any) => {
        //     if (res.code == 200) {
        //         res.data.content = res.data.content.html
        //         setBaseDetail(res.data)
        //         setVisibleModal(true)
        //         setLoadingTable(false)
        //     } else {
        //         message.error(res.message)
        //         setLoadingTable(false)
        //     }
        // }).catch((e) => {
        //     message.error(e)
        //     setLoadingTable(false)
        // })
    }
    const handleAdd = () => {
        let data = {
            id: null,
            web_id: null,
            status: 1,
            name: '',
            content: ''
        }
        setBaseDetail(data)
        setVisibleModal(true)
    }
    const changeStatus = (id: number) => {
        updateUserAgreementsStatuslApi(id).then((res: any) => {
            if (res.code == 200) {
                message.success(res.message)
                initData()
            } else {
                message.error(res.message)
            }
        }).catch((e) => {
            // message.error(e)
        })
    }

    const modalConfirm = (params: ParamsDataType) => {
        // const operationApi = params.id ? updateUserAgreementsApi : addUserAgreementsApi
        // operationApi(params).then((res: any) => {
        //     if (res.code == 200) {
        //         message.success(res.message)
        //         modalCancel()
        //         initData()
        //     } else {
        //         message.error(res.message)
        //     }
        // }).catch((e) => { message.error(e) })
    }
    const modalCancel = () => {
        setBaseDetail(null)
        setVisibleModal(false)
    }
    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'keywords',
                placeholder: '按视频名称搜索',
                label: '',
                type: 'input',
                width: 200
            },
            {
                name: 'web_id',
                placeholder: '请选择网站',
                label: '',
                type: 'select',
                selectOp: webData || []
            },
            {
                name: 'result',
                placeholder: '请选择状态',
                label: '',
                type: 'select',
                selectOp: [
                    {
                        name: '开',
                        value: '1'
                    }, {
                        name: '关',
                        value: '2'

                    }
                ]
            },
            {
                name: 'date',
                label: '',
                type: 'rangePicker'
            }
        ],
        [webData]
    );

    const onSearch = useCallback(
        (params) => {
            setPage(1)
            setSearchParamsData(params)
        },
        []
    );
    const initData = () => {
        setLoadingTable(true)
        let params = {
            page,
            per_page,
            keywords: searchParamsData.keywords,
            web_id: searchParamsData.web_id,
            guard_name: searchParamsData.guard_name,
            result: searchParamsData.result,
            user_from: searchParamsData.user_from,
            time_1: searchParamsData.date ? searchParamsData.date[0].format('YYYY-MM-DD') : '',
            time_2: searchParamsData.date ? searchParamsData.date[1].format('YYYY-MM-DD') : ''
        }
        getVideoSearchListApi(params).then((res: any) => {
            if (res.code == 200) {
                setBaseData(res.data.data)
                setDataTotal(res.data.total)
                setLoadingTable(false)
            } else {
                message.error(res.message)
                setLoadingTable(false)
            }
        }).catch(() => {
            setLoadingTable(false)
        })
    }
    const getWebList = () => {
        getVideoAllSiteApi().then((res: any) => {
            if (res.code == 200) {
                let data: WebDataType[] = []
                res.data.forEach((item: { name: string; label: string, id: number, value: number }) => {
                    data.push({
                        name: item.label,
                        value: item.id
                    })
                })
                setWebData(data)
            } else {
                message.error(res.message)
            }
        }).catch((e) => {
            // message.error(e)
        })
    }
    useEffect(() => {
        getWebList()
    }, [])
    useEffect(() => {
        initData()
    }, [page, per_page, searchParamsData])
    return (
        <>
            <Row gutter={[12, 30]}>
                <Col span={24}>
                    <SearchForm
                        formList={formList}
                        onSearch={onSearch} />
                </Col>
                <Col span={24}>
                    <Card>
                        <Space direction="vertical" size={[4, 30]} style={{ width: '100%' }}>
                            <Button type="primary" danger onClick={() => { handleAdd() }}>新增</Button>
                            <BaseTable data={paramsData} onChange={onChange} loading={loadingTable} />
                        </Space>
                    </Card>
                </Col>
            </Row>
            {baseDetail
                && (
                    <AddModal
                        dataSource={baseDetail}
                        visible={visibleModal}
                        webData={webData}
                        handleOk={modalConfirm}
                        handleCancel={modalCancel} />
                )}
        </>
    )
}
