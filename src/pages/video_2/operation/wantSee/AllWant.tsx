import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
    Button, Space, Switch, Row, Col, Modal, Form, Input, InputNumber, message, Card, Select
} from 'antd'
import {
    getAllWantListApi_2, addAllWantListApi_2, updateAllWantListApi_2,
    updateUserAgreementsStatuslApi_2, getWebListApi_2, delIWantListApi_2
} from '@/request'
import BaseTable from '@/components/base/BaseTable'
import SearchForm, { SearchFormItem } from '@/components/searchForm'

type BaseDataType = {
    content: string
    count: number
    created_at: string
    creator_name: string
    id: number
    status: number
    web_name: string
    web_id: number
}
type ParamsDataType = {
    content: string
    id: number
    web_id: number
    status: number
    count: number
}
type AddModalPropType = {
    dataSource: ParamsDataType
    webData: WebDataType[]
    visible: boolean
    handleCancel: () => void
    handleOk: (params: ParamsDataType) => void
}

const AddModal: React.FC<AddModalPropType> = (P) => {
    const {
        dataSource, visible, handleCancel, handleOk, webData
    } = P
    const [form] = Form.useForm()
    const [params, setParams] = useState<ParamsDataType>({
        content: dataSource.content,
        id: dataSource.id,
        web_id: dataSource.web_id,
        status: dataSource.status,
        count: dataSource.count
    })
    const onFinish = () => {
        form.validateFields().then((values: any) => {
            values.status = values.status == 1 ? 1 : 2
            handleOk({ ...params, ...values })
        })
    }
    const handleChangeContent = (value: string) => {
        setParams({
            ...params,
            content: value
        })
        form.setFieldsValue({
            content: value
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
                <Form.Item label="电影名字" name="content" rules={[{ required: true, message: '请输入电影名字' }]}>
                    <Input
                        placeholder="请输入电影名字"
                        allowClear />
                </Form.Item>
                <Form.Item label="想看数量" name="count" rules={[{ required: true, message: '请输入想看数量' }]}>
                    <InputNumber min={0} placeholder="请输入想看数量" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="使用网站" name="web_id" rules={[{ required: true, message: '请选择使用网站' }]}>
                    <Select
                        style={{ width: 200 }}
                        placeholder="请选择使用网站">
                        {
                            webData && webData.map((item) => (
                                <Select.Option
                                    value={Number(item.value)}
                                    key={item.value}>
                                    {item.name}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    label="状态"
                    name="status">
                    <Switch
                        onClick={(e) => { changeStatus(e) }}
                        checked={Number(params.status) === 1} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
type WebDataType = {
    id: number
    name: string
    value: string
}
type SearchParamType = {
    keywords: string
    web_id: string
    status: string
}
export const AllWant: React.FC = () => {
    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState<BaseDataType[]>([])
    const [dataTotal, setDataTotal] = useState<number>(0)
    const [baseDetail, setBaseDetail] = useState<ParamsDataType | null>(null)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [webData, setWebData] = useState<WebDataType[] | null>(null)
    const [searchParamsData, setSearchParamsData] = useState<SearchParamType>({
        keywords: '',
        web_id: '',
        status: ''
    })
    const paramsData = {
        list: baseData,
        columns: [
            {
                title: '#',
                dataIndex: 'index',
                key: 'index',
                render: (text: any, record: any, index: number) => `${index + 1}`,
                align: 'center',
                width: '80px'
            },
            {
                title: '电影名字',
                dataIndex: 'content',
                key: 'content',
                align: 'center'
            },
            {
                title: '网站',
                dataIndex: 'web_name',
                key: 'web_name',
                align: 'center'
            },
            {
                title: '多少人想看',
                dataIndex: 'count',
                key: 'count',
                align: 'center'
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                render: (_: any, item: BaseDataType) => (
                    <Switch
                        onClick={() => {
                            const data = JSON.parse(JSON.stringify(item))
                            data.status = data.status === '1' ? '2' : '1'
                            modalConfirm(data)
                        }}
                        checked={String(item.status) === '1'} />
                )
            },
            {
                title: '提交时间',
                dataIndex: 'created_at',
                key: 'created_at',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                align: 'center',
                width: 200,
                render: (_: any, item: BaseDataType) => (
                    <Space>
                        <Button
                            type="link"
                            onClick={() => { handleItem(item) }}>
                            编辑
                        </Button>
                        <Button
                            type="link"
                            onClick={() => { handleDel(item.id) }}>
                            删除
                        </Button>
                    </Space>
                )
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
        delIWantListApi_2(id).then((res: any) => {
            if (res.code == 200) {
                message.success('操作成功')
                initData()
            } else {
                message.error(res.message)
            }
        }).catch((e) => {
            // message.error(e)
        })
    }
    const changeStatus = (id: number) => {
        updateUserAgreementsStatuslApi_2(id).then((res: any) => {
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
    const handleAdd = () => {
        const data = {
            id: null,
            web_id: null,
            status: 1,
            content: '',
            count: null
        }
        setBaseDetail(data)
        setVisibleModal(true)
    }
    const handleItem = (item: BaseDataType) => {
        setLoadingTable(true)
        let data = JSON.parse(JSON.stringify(item))
        setBaseDetail(data)
        setLoadingTable(false)
        setVisibleModal(true)
    }
    const modalConfirm = (params: ParamsDataType) => {
        const formData = new FormData()
        formData.append('content', params.content)
        formData.append('web_id', String(params.web_id))
        formData.append('count', String(params.count))
        formData.append('status', String(params.status))
        if (params.id) {
            updateAllWantListApi_2(params).then((res: any) => {
                if (res.code == 200) {
                    message.success('操作成功')
                    modalCancel()
                    initData()
                } else {
                    message.error(res.message)
                }
            }).catch((e) => {
                // message.error(e)
            })
        } else {
            addAllWantListApi_2(formData).then((res: any) => {
                if (res.code == 200) {
                    message.success('操作成功')
                    modalCancel()
                    initData()
                } else {
                    message.error(res.message)
                }
            }).catch((e) => {
                // message.error(e)
            })
        }
    }
    const modalCancel = () => {
        setBaseDetail(null)
        setVisibleModal(false)
    }
    const initData = () => {
        setLoadingTable(true)
        let params = {
            page,
            per_page,
            web_id: searchParamsData.web_id,
            status: searchParamsData.status
        }
        getAllWantListApi_2(params).then((res: any) => {
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
    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'web_id',
                placeholder: '请选择展示网站',
                label: '',
                type: 'select',
                selectOp: webData || []
            },
            {
                name: 'status',
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
            }
        ],
        [webData]
    )
    const onSearch = useCallback(
        (params) => {
            setPage(1)
            setSearchParamsData(params)
        },
        []
    )
    const getWebList = () => {
        getWebListApi_2().then((res: any) => {
            if (res.code == 200) {
                let data: WebDataType[] = []
                res.data.web_sites.forEach((item: { web_name: string; label: string, id: number, value: string }) => {
                    data.push({
                        id: item.id,
                        name: item.web_name,
                        value: String(item.id)
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
            <Row gutter={[12, 40]}>
                <Col span={24}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <SearchForm formList={formList} onSearch={onSearch} />
                    </Space>
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
                        handleOk={modalConfirm}
                        handleCancel={modalCancel}
                        webData={webData} />
                )}
        </>
    )
}
