import React, { useEffect, useState } from 'react'
import { Button, Space, Switch, Row, Col, Modal, Form, Input, message, Card, Select } from 'antd'
import { getVideoTypesListApi_2, addVideoTypesApi_2, updateVideoTypesApi_2, delVideoTypesApi_2, getVideoAllCategoryApi_2 } from '@/request'

import BaseTable from '@/components/base/BaseTable'
import { opIdToVal } from '@/type'

type BaseDataType = {
    created_at?: string
    guard_name?: string
    id: number
    state: null | number
    type_name: string
    user_id?: null | number
}
type AddModalPropType = {
    dataSource: BaseDataType
    visible: boolean
    classifyArr: any[]
    handleCancel: () => void
    handleOk: (params: BaseDataType) => void
}

const AddModal: React.FC<AddModalPropType> = (P) => {
    const { dataSource, visible, classifyArr, handleCancel, handleOk } = P
    const [form] = Form.useForm();
    const [params, setParams] = useState<BaseDataType>(dataSource)
    const onFinish = () => {
        form.validateFields().then((values: any) => {
            // console.log(values)
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
                <Form.Item label="视频分类" name="parent_id" rules={[{ required: true, message: '请选择视频分类' }]}>
                    <Select placeholder="视频分类">
                        {
                            classifyArr.map((status) => (
                                <Select.Option value={status.id} key={status.value}>
                                    {status.value}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="类型名称" name="type_name" rules={[{ required: true, message: '请输入类型名称' }]}>
                    <Input placeholder="请输入类型名称" allowClear />
                </Form.Item>
                <Form.Item label="使用状态" name="state">
                    <Switch
                        onClick={(e) => { handleChangeStatus(e) }}
                        checked={params.state === 1} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export const VideoType: React.FC = () => {
    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState<BaseDataType[]>([])
    const [baseDetail, setBaseDetail] = useState<BaseDataType | null>(null)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [dataTotal, setDataTotal] = useState<number>(0)
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [classifyArr, setClassifyArr] = useState([]);
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
                dataIndex: 'parent_id',
                key: 'parent_id',
                render: (text: any, record: any) => opIdToVal(classifyArr, Number(record.parent_id)),
                align: 'center'
            },
            {
                title: '视频类型',
                dataIndex: 'type_name',
                key: 'type_name',
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
        delVideoTypesApi_2(id).then((res: any) => {
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
            type_name: ''
        }
        setBaseDetail(data)
        setVisibleModal(true)
    }
    const handleItem = (item) => {
        let data = JSON.parse(JSON.stringify(item))
        setBaseDetail(data)
        setVisibleModal(true)
    }
    const modalConfirm = (params: BaseDataType) => {
        const operationApi = params.id ? updateVideoTypesApi_2 : addVideoTypesApi_2
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
        getVideoTypesListApi_2({ page, per_page }).then((res: any) => {
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
    const getOpList = () => {
        getVideoAllCategoryApi_2().then((res: any) => {
            setClassifyArr(res.data);
        });
    }
    useEffect(() => {
        initData()
    }, [page, per_page])
    useEffect(() => {
        getOpList()
    }, [])
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
                        classifyArr={classifyArr}
                        handleOk={modalConfirm}
                        handleCancel={modalCancel} />
                )}
        </>
    )
}
