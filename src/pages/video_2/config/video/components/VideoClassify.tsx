import React, { useEffect, useState } from 'react'
import { Button, Space, Switch, Row, Col, Modal, Form, Input, message, Card } from 'antd'
import { getVideoCategoriesListApi_2, addVideoCategoriesApi_2, updateVideoCategoriesApi_2, delVideoCategoriesApi_2 } from '@/request'

import BaseTable from '@/components/base/BaseTable'

type BaseDataType = {
    categories_name: string
    created_at?: string | null
    guard_name?: string
    id: number
    state: number
    user_id?: null | number
}
type AddModalPropType = {
    dataSource: BaseDataType
    visible: boolean
    handleCancel: () => void
    handleOk: (params: BaseDataType) => void
}

const AddModal: React.FC<AddModalPropType> = (P) => {
    const { dataSource, visible, handleCancel, handleOk } = P
    const [form] = Form.useForm();
    const [params, setParams] = useState<BaseDataType>({
        id: dataSource.id,
        categories_name: dataSource.categories_name,
        state: dataSource.state
    })
    const onFinish = () => {
        form.validateFields().then((values: any) => {
            values.state = values.state ? 1 : 2
            handleOk({ ...params, ...values })
        })
    }
    const handleChangeStatus = (e: boolean) => {
        setParams({
            ...params,
            state: e ? 1 : 2
        })
    }
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
                name="basic"
                labelCol={{ span: 4 }}
                autoComplete="off"
                form={form}
                initialValues={params || {}}>
                <Form.Item label="分类名称" name="categories_name" rules={[{ required: true, message: '请输入分类名称' }]}>
                    <Input
                        placeholder="请输入分类名称"
                        allowClear />
                </Form.Item>
                <Form.Item
                    label="使用状态"
                    name="state">
                    <Switch
                        onClick={(e) => { handleChangeStatus(e) }}
                        checked={params.state === 1} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export const VideoClassify: React.FC = () => {
    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState<BaseDataType[]>([])
    const [baseDetail, setBaseDetail] = useState<BaseDataType | null>(null)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [dataTotal, setDataTotal] = useState<number>(0)
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
                title: '视频分类',
                dataIndex: 'categories_name',
                key: 'categories_name',
                align: 'center'
            },
            {
                title: '状态',
                dataIndex: 'state',
                key: 'state',
                align: 'center',
                render: (_: any, item: BaseDataType) => (
                    <Switch
                        onClick={(e) => {
                            let data = { ...item, state: e ? 1 : 2 }
                            modalConfirm(data)
                        }}
                        checked={item.state === 1} />
                )
            },
            {
                title: '操作员',
                dataIndex: 'user_name',
                key: 'user_name',
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
        delVideoCategoriesApi_2(id).then((res: any) => {
            if (res.code == 200) {
                message.success(res.message)
                initData()
            } else {
                message.success(res.message)
            }
        }).catch(() => { })
    }
    const handleAdd = () => {
        let data = {
            id: null,
            state: 1,
            categories_name: ''
        }
        setBaseDetail(data)
        setVisibleModal(true)
    }
    const handleItem = (item: BaseDataType) => {
        let data = JSON.parse(JSON.stringify(item))
        setBaseDetail(data)
        setVisibleModal(true)
    }
    const modalConfirm = (params: BaseDataType) => {
        const operationApi = params.id ? updateVideoCategoriesApi_2 : addVideoCategoriesApi_2
        for (let key in params) {
            if (params[key] === '' || params[key] === null || params[key] === undefined) {
                delete params[key]
            }
        }
        operationApi(params).then((res: any) => {
            if (res.code == 200) {
                message.success(res.message)
                setVisibleModal(false)
                initData()
            } else {
                message.success(res.message)
            }
        }).catch(() => { })
    }
    const modalCancel = () => {
        setBaseDetail(null)
        setVisibleModal(false)
    }
    const initData = () => {
        setLoadingTable(true)
        getVideoCategoriesListApi_2({ page, per_page }).then((res: any) => {
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
                            <Button type="primary" danger onClick={() => { handleAdd() }}>新增</Button>
                            <BaseTable data={paramsData} onChange={onChange} loading={loadingTable} />
                        </Space>
                    </Card>
                </Col>
            </Row>
            {visibleModal
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
