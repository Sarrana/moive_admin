import React, { useEffect, useState } from 'react'
import { Button, Space, Switch, Row, Col, Modal, Form, Input, Select, message, Card } from 'antd'
import { getUserAgreementsListApi, getVideoAllSiteApi, addUserAgreementsApi, getUserAgreementsDetailApi, updateUserAgreementsApi, updateUserAgreementsStatuslApi, delUserAgreementslApi } from '@/request'
import BaseTable from '@/components/base/BaseTable'
import { RichTextEditor } from '@/components/editor'

type ContentType = {
    raw: string
    html: string
}
type BaseDataType = {
    agree_type: string
    content: ContentType
    created_at: string
    id: number
    name: string
    user_id: number
    web_id: number
    status: number
    user_name: string
    webName: string
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
    visible: boolean
    handleCancel: () => void
    handleOk: (params: ParamsDataType) => void
}

const AddModal: React.FC<AddModalPropType> = (P) => {
    const { dataSource, visible, handleCancel, handleOk } = P
    const [form] = Form.useForm();
    const [webData, setWebData] = useState<WebDataType[] | null>(null)
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
    const getWebList = () => {
        getVideoAllSiteApi().then((res: any) => {
            if (res.code == 200) {
                setWebData(res.data)
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
    return (
        <Modal
            title={dataSource.id ? '??????' : '??????'}
            visible={visible}
            width={800}
            centered
            onCancel={handleCancel}
            okText="??????"
            cancelText="??????"
            onOk={onFinish}>
            <Form
                name="basic"
                labelCol={{ span: 4 }}
                autoComplete="off"
                form={form}
                initialValues={params || {}}>
                <Form.Item label="????????????" name="name" rules={[{ required: true, message: '?????????????????????' }, { min: 2, max: 50, message: '???????????????2-50???????????????' }]}>
                    <Input
                        placeholder="?????????????????????"
                        allowClear />
                </Form.Item>
                <Form.Item label="????????????" name="web_id" rules={[{ required: true, message: '?????????????????????' }]}>
                    <Select
                        style={{ width: 200 }}
                        placeholder="?????????????????????">
                        {
                            webData && webData.map((item) => (
                                <Select.Option
                                    value={item.id}
                                    key={item.id}>
                                    {item.label}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    label="????????????"
                    name="status">
                    <Switch
                        onClick={(e) => { changeStatus(e) }}
                        checked={params.status === 1} />
                </Form.Item>
                <Form.Item
                    label="??????">
                    <RichTextEditor
                        category="agreement"
                        content={params.content}
                        onChange={handleChangeContent} />
                </Form.Item>
                <Form.Item name="content" label=" " rules={[{ required: true, message: '???????????????' }]} className="perch_item" style={{ marginTop: 40 }}>
                    <Input style={{ display: 'none' }} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
type WebDataType = {
    id: number
    label: string
    value: string
}
export const AgreementMgr: React.FC = () => {
    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState<BaseDataType[]>([])
    const [dataTotal, setDataTotal] = useState<number>(0)
    const [baseDetail, setBaseDetail] = useState<ParamsDataType | null>(null)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
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
                title: '??????',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '????????????',
                dataIndex: 'webName',
                key: 'webName',
                align: 'center'
            },
            {
                title: '??????',
                dataIndex: 'enable',
                key: 'enable',
                align: 'center',
                render: (_: any, item: BaseDataType) => (
                    <Switch
                        onClick={() => { changeStatus(item.id) }}
                        checked={item.status === 1} />
                )
            },
            {
                title: '?????????',
                dataIndex: 'user_name',
                key: 'user_name',
                align: 'center'
            },
            {
                title: '????????????',
                dataIndex: 'created_at',
                key: 'created_at',
                align: 'center'
            },
            {
                title: '??????',
                dataIndex: 'operation',
                key: 'operation',
                align: 'center',
                width: 200,
                render: (_: any, item: BaseDataType) => (
                    <Space>
                        <Button
                            type="link"
                            onClick={() => { handleItem(item.id) }}>
                            ??????
                        </Button>
                        <Button
                            type="link"
                            onClick={() => { handleDel(item.id) }}>
                            ??????
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
        delUserAgreementslApi(id).then((res: any) => {
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
    const handleItem = (id: number) => {
        setLoadingTable(true)
        getUserAgreementsDetailApi(id).then((res: any) => {
            if (res.code == 200) {
                res.data.content = res.data.content.html
                setBaseDetail(res.data)
                setVisibleModal(true)
                setLoadingTable(false)
            } else {
                message.error(res.message)
                setLoadingTable(false)
            }
        }).catch((e) => {
            // message.error(e)
            setLoadingTable(false)
        })
    }
    const modalConfirm = (params: ParamsDataType) => {
        const operationApi = params.id ? updateUserAgreementsApi : addUserAgreementsApi
        operationApi(params).then((res: any) => {
            if (res.code == 200) {
                message.success(res.message)
                modalCancel()
                initData()
            } else {
                message.error(res.message)
            }
        }).catch((e) => {
            // message.error(e)
        })
    }
    const modalCancel = () => {
        setBaseDetail(null)
        setVisibleModal(false)
    }
    const initData = () => {
        setLoadingTable(true)
        getUserAgreementsListApi({ page, per_page }).then((res: any) => {
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
    useEffect(() => {
        initData()
    }, [page, per_page])
    return (
        <>
            <Row gutter={[12, 40]}>
                <Col span={24}>
                    <Card>
                        <Space direction="vertical" size={[4, 30]} style={{ width: '100%' }}>
                            <Button type="primary" danger onClick={() => { handleAdd() }}>??????</Button>
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
                        handleCancel={modalCancel} />
                )}
        </>
    )
}
