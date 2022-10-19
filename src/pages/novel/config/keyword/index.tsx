import React, { useEffect, useState } from 'react'
import { Button, Space, Switch, Row, Col, Modal, Form, Input, Select, message, Card } from 'antd'
import { getNovelKeyListApi, getNovelKeyStateApi, delNovelKeyApi, editNovelKeyApi, addNovelKeyApi, getNovelAllSiteApi } from '@/request'
import BaseTable from '@/components/base/BaseTable'

type BaseDataType = {
    id: number
    web_id: number
    web_name: string
    key_words: string
    status: number
    user_id: number
    admin_name: string
    created_at: string
}
type ParamsDataType = {
    id: number
    web_id: number
    status: number
    key_words: string
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
            // console.log('values ', values);
            handleOk({ id: dataSource.id, web_id: values.web_id, key_words: values.key_words, status: values.status });
        }).catch((errorInfo) => {
            console.log('errorInfo ...', errorInfo, status);
        });
    }
    const changeStatus = (e: boolean) => {
        const p = e ? 1 : 2;
        form.setFieldsValue({ status: p });
        setStatus(p);
    }

    const getWebList = () => {
        getNovelAllSiteApi().then((res: any) => {
            setWebData(res.data);
        });
    }

    useEffect(() => {
        getWebList()
    }, [])

    return (
        <Modal
            title={dataSource.id ? '编辑' : '创建'}
            visible={visible}
            width={600}
            centered
            onCancel={handleCancel}
            okText="保存"
            cancelText="取消"
            onOk={onFinish}>
            <Form
                labelCol={{ span: 4 }}
                autoComplete="off"
                form={form}
                initialValues={dataSource || {}}>
                <Form.Item label="使用网站" name="web_id" rules={[{ required: true, message: '请选择使用网站' }]}>
                    <Select style={{ width: 200 }}>
                        {webData && webData.map((item) => (<Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>))}
                    </Select>
                </Form.Item>
                <Form.Item label="关键字" name="key_words" rules={[{ required: true, message: '请输入关键字' }]}>
                    <Input placeholder="请输入关键字,多个关键词之间用英文“,”隔开" allowClear />
                </Form.Item>
                <Form.Item label="使用状态" name="status">
                    <Switch onClick={(e) => { changeStatus(e) }} checked={`${status}` == '1'} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export const KeywordMgr: React.FC = () => {
    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState<BaseDataType[]>([])
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [dataTotal, setDataTotal] = useState<number>(0)
    const handleAdd = () => {
        setBaseDetail({ id: null, web_id: null, key_words: '', status: 1 })
        setVisibleModal(true)
    }
    const onChange = (pageParams) => {
        setPage(pageParams.current)
        setPer_page(pageParams.pageSize)
    }
    const changeStatus = (id: number) => {
        getNovelKeyStateApi(id).then((res: any) => {
            if (res.code == 200) {
                message.success(res.message)
                initData()
            } else {
                message.error(res.message)
            }
        }).catch((e) => {

        })
    }
    const handleItem = (item: BaseDataType) => {
        setBaseDetail({ id: item.id, web_id: item.web_id, key_words: item.key_words, status: item.status })
        setVisibleModal(true)
    }
    const handleDel = (id: number) => {
        delNovelKeyApi(id).then((res: any) => {
            if (res.code == 200) {
                message.success(res.message)
                initData()
            } else {
                message.error(res.message)
            }
        }).catch((e) => {

        })
    }
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
                title: '搜索关键字',
                dataIndex: 'key_words',
                key: 'key_words',
                align: 'center'
            },
            {
                title: '使用网站',
                dataIndex: 'web_name',
                key: 'web_name',
                align: 'center'
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                render: (_: any, item) => (<Switch onClick={() => { changeStatus(item.id) }} checked={`${item.status}` == '1'} />)
            },
            {
                title: '操作员',
                dataIndex: 'admin_name',
                key: 'admin_name',
                align: 'center'
            },
            {
                title: '创建时间',
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
                    <Space size={[4, 4]}>
                        <Button type="link" onClick={() => { handleItem(item) }}>编辑</Button>
                        <Button type="link" onClick={() => { handleDel(item.id) }}>删除</Button>
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
        const operationApi = params.id ? editNovelKeyApi : addNovelKeyApi
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
        getNovelKeyListApi({ page, per_page }).then((res: any) => {
            if (res.code == 200) {
                setBaseData(res.data.data);
                setPage(Number(res.data.current_page));
                setPer_page(Number(res.data.per_page));
                setDataTotal(Number(res.data.total));
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
                        handleCancel={modalCancel} />
                )}
        </>
    )
}
