import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Button, Space, Switch, Row, Col, Modal, Form, Input, Select, Card } from 'antd'
import BaseTable from '@/components/base/BaseTable'
import SearchForm, { SearchFormItem } from '@/components/searchForm';

type ParamType = {

}
type BaseDataType = {
    status: number
    name: string
    id?: number
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
        name: dataSource.name,
        status: dataSource.status,
        id: dataSource.id
    })
    const onFinish = (values: any) => {
        handleOk({ ...params, ...values })
    }
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    }
    const handleChangeContent = () => {
    }
    return (
        <Modal
            title={dataSource.id ? '编辑' : '创建'}
            visible={visible}
            width={800}
            centered
            footer={null}
            onCancel={handleCancel}>
            <Form
                name="basic"
                labelCol={{ span: 4 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                form={form}
                initialValues={params || {}}>
                <Form.Item label="账户名" name="name" rules={[{ required: true, message: '请输入账户名' }]}>
                    <Input
                        placeholder="请输入账户名"
                        allowClear />
                </Form.Item>
                <Form.Item label="登录密码" name="name" rules={[{ required: true, message: '请输入登录密码' }]}>
                    <Input
                        placeholder="请输入登录密码"
                        allowClear />
                </Form.Item>
                <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
                    <Input
                        placeholder="请输入姓名"
                        allowClear />
                </Form.Item>
                <Form.Item label="手机号" name="name" rules={[{ required: true, message: '请输入手机号' }]}>
                    <Input
                        placeholder="请输入手机号"
                        allowClear />
                </Form.Item>
                <Form.Item label="部门" name="name" rules={[{ required: true, message: '请输入部门' }]}>
                    <Select
                        style={{ width: 200 }}
                        placeholder="请选择部门">
                        <Select.Option
                            value=""
                            key="1">
                            IOS
                        </Select.Option>
                        <Select.Option
                            value="2"
                            key="2">
                            Android
                        </Select.Option>
                        {/* {
                                officialData.map((item) => (
                                    <Select.Option
                                        value={item.value}
                                        key={item.value}
                                    >
                                        {item.name}
                                    </Select.Option>
                                ))
                            } */}
                    </Select>
                </Form.Item>
                <Form.Item label="角色" name="name" rules={[{ required: true, message: '请输入角色' }]}>
                    <Select
                        style={{ width: 200 }}
                        placeholder="请选择角色">
                        <Select.Option
                            value=""
                            key="1">
                            IOS
                        </Select.Option>
                        <Select.Option
                            value="2"
                            key="2">
                            Android
                        </Select.Option>
                        {/* {
                                officialData.map((item) => (
                                    <Select.Option
                                        value={item.value}
                                        key={item.value}
                                    >
                                        {item.name}
                                    </Select.Option>
                                ))
                            } */}
                    </Select>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 18, span: 6 }}>
                    <Button type="default" style={{ marginRight: '20px' }} onClick={handleCancel}>
                        取消
                    </Button>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

type SearchParamType = {
    keywords: string
    status: string
}
export const RoleMgr: React.FC = () => {
    const [baseData, setBaseData] = useState<BaseDataType[]>([
        {
            id: 1,
            status: 1,
            name: '123'
        }
    ])
    const [baseDetail, setBaseDetail] = useState<BaseDataType | null>(null)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)

    const [searchParamsData, setSearchParamsData] = useState<SearchParamType>({
        keywords: '',
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
                title: '用户名',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '部门',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '角色',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '登录账号',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '电话号码',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '状态',
                dataIndex: 'name',
                key: 'name',
                align: 'center',
                render: (_: any, item: BaseDataType) => (
                    <Switch
                        onClick={() => { changeStatus(item.id) }}
                        checked={item.status === 1} />
                )
            },
            {
                title: '操作员',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '创建时间',
                dataIndex: 'name',
                key: 'name',
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
                            onClick={() => { handleItem(item.id) }}>
                            编辑
                        </Button>
                    </Space>
                )
            }
        ],
        showPagination: false,
        page: {}
    }
    const onChange = (pageParams) => {
        console.log(pageParams)
    }
    const handleDel = (id: number) => {
        console.log(11111)
    }
    const changeStatus = (val: number) => {
        console.log(11111)
    }
    const handleAdd = () => {
        let data = {
            id: null,
            status: 1,
            name: ''
        }
        setBaseDetail(data)
        setVisibleModal(true)
    }
    const handleItem = (id: number) => {
        let data = {
            id: null,
            status: 1,
            name: ''
        }
        setBaseDetail(data)
        setVisibleModal(true)
    }
    const modalConfirm = () => {
        modalCancel()
    }
    const modalCancel = () => {
        setBaseDetail(null)
        setVisibleModal(false)
    }
    const resetCb = () => {
    }
    const seachCb = () => {
    }

    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'keywords',
                placeholder: '按用户名称搜索',
                label: '',
                type: 'input',
                width: 200
            },
            {
                name: 'status',
                placeholder: '请选择状态',
                label: '',
                type: 'select',
                selectOp: [
                    {
                        name: '禁用',
                        value: '0'
                    }, {
                        name: '启用',
                        value: '1'

                    }
                ]
            }
        ],
        []
    );

    const onSearch = useCallback(
        (params) => {
            // setPage(1)
            setSearchParamsData(params)
            console.log(params)
        },
        []
    );
    useEffect(() => { }, [])
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
                            <BaseTable data={paramsData} onChange={onChange} />
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
