import React, { useEffect, useState } from 'react'
import { Button, Space, Switch, Row, Col, Modal, Form, Input, Select, message, Card } from 'antd'
import { getNovelAllSiteApi, getNovelAgreementsStateApi, delNovelAgreementsApi, addNovelAgreementsApi, editNovelAgreementsApi, getNovelAgreementsListApi, getNovelAgreementsDetailApi } from '@/request'
import BaseTable from '@/components/base/BaseTable'
import { RichTextEditor } from '@/components/editor'

type ContentType = {
    raw: string
    html: string
}
type BaseDataType = {
    id: number
    name: string
    web_id: number
    web_name: string
    status: number
    user_id: number
    admin_name: string
    created_at: string
    agree_type: string
    content: ContentType
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
    const [webData, setWebData] = useState([])
    const [status, setStatus] = useState(dataSource.status);
    const [form] = Form.useForm();
    const onFinish = () => {
        form.validateFields().then((values: any) => {
            console.log('values ', values);
            handleOk({ id: dataSource.id, web_id: values.web_id, name: values.name, status: values.status, content: values.content });
        }).catch((errorInfo) => {
            console.log('errorInfo ...', errorInfo, status);
        });
    }
    const handleChangeContent = (value: string) => {
        // console.log('ChangeContent', value)
        form.setFieldsValue({ content: value })
    }
    const changeStatus = (e: boolean) => {
        const p = e ? 1 : 2;
        form.setFieldsValue({ status: p });
        setStatus(p);
    }

    const getWebList = () => {
        getNovelAllSiteApi().then((res: any) => {
            if (res.code == 200) {
                setWebData(res.data)
            } else {
                message.error(res.message)
            }
        }).catch((e) => { })
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
                labelCol={{ span: 4 }}
                autoComplete="off"
                form={form}
                initialValues={dataSource || {}}>
                <Form.Item label="????????????" name="name" rules={[{ required: true, message: '?????????????????????' }, { min: 2, max: 50, message: '???????????????2-50???????????????' }]}>
                    <Input placeholder="?????????????????????" allowClear />
                </Form.Item>
                <Form.Item label="????????????" name="web_id" rules={[{ required: true, message: '?????????????????????' }]}>
                    <Select style={{ width: 200 }}>
                        {webData && webData.map((item) => (<Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>))}
                    </Select>
                </Form.Item>
                <Form.Item label="????????????" name="status">
                    <Switch onClick={(e) => { changeStatus(e) }} checked={`${status}` == '1'} />
                </Form.Item>
                <Form.Item label="??????">
                    <RichTextEditor
                        category="agreement"
                        content={dataSource.content}
                        onChange={handleChangeContent} />
                </Form.Item>
                <Form.Item name="content" label="" rules={[{ required: true, message: '???????????????' }]} className="perch_item" style={{ marginTop: 40 }}>
                    <Input style={{ display: 'none' }} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export const AgreementMgr: React.FC = () => {
    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState<BaseDataType[]>([])
    const [dataTotal, setDataTotal] = useState<number>(0)
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const handleAdd = () => {
        setBaseDetail({ id: null, web_id: null, status: 1, name: '', content: '' })
        setVisibleModal(true)
    }
    const changeStatus = (id: number) => {
        getNovelAgreementsStateApi(id).then((res: any) => {
            if (res.code == 200) {
                message.success(res.message)
                initData()
            } else {
                message.error(res.message)
            }
        }).catch((e) => { })
    }
    const handleItem = (id: number) => {
        setLoadingTable(true)
        getNovelAgreementsDetailApi(id).then((res: any) => {
            if (res.code == 200) {
                // res.data.content = res.data.content.html
                setBaseDetail(res.data)
                setVisibleModal(true)
                setLoadingTable(false)
            } else {
                message.error(res.message)
                setLoadingTable(false)
            }
        }).catch((e) => {
            setLoadingTable(false)
        })
    }
    const handleDel = (id: number) => {
        delNovelAgreementsApi(id).then((res: any) => {
            if (res.code == 200) {
                message.success(res.message)
                initData()
            } else {
                message.error(res.message)
            }
        }).catch((e) => { })
    }
    const onChange = (pageParams) => {
        setPage(pageParams.current)
        setPer_page(pageParams.pageSize)
    }
    const paramsData = {
        list: baseData,
        columns: [
            {
                title: '#',
                dataIndex: 'id',
                key: 'id',
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
                dataIndex: 'web_name',
                key: 'web_name',
                align: 'center'
            },
            {
                title: '??????',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                render: (text: any, item: any) => (<Switch onClick={() => { changeStatus(item.id) }} checked={`${item.status}` == '1'} />)
            },
            {
                title: '?????????',
                dataIndex: 'admin_name',
                key: 'admin_name',
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
                render: (_: any, item: BaseDataType) => (
                    <Space size={[4, 4]}>
                        <Button type="link" size="small" onClick={() => { handleItem(item.id) }}>??????</Button>
                        <Button type="link" size="small" onClick={() => { handleDel(item.id) }}>??????</Button>
                    </Space>
                )
            }
        ],
        showPagination: true,
        page: { dataTotal, page, size: per_page }
    }

    const [baseDetail, setBaseDetail] = useState<ParamsDataType | null>(null)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const modalConfirm = (params: ParamsDataType) => {
        const operationApi = params.id ? editNovelAgreementsApi : addNovelAgreementsApi
        operationApi(params).then((res: any) => {
            if (res.code == 200) {
                message.success(res.message)
                modalCancel()
                initData()
            } else {
                message.error(res.message)
            }
        }).catch((e) => { })
    }
    const modalCancel = () => {
        setBaseDetail(null)
        setVisibleModal(false)
    }

    const initData = () => {
        setLoadingTable(true)
        getNovelAgreementsListApi({ page, per_page }).then((res: any) => {
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
