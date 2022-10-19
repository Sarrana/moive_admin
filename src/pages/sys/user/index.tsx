import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Button, Space, Switch, Row, Col, Modal, Form, Input, Card, message } from 'antd'
import BaseTable from '@/components/base/BaseTable'
import SearchForm, { SearchFormItem } from '@/components/searchForm';
import { getAdminUserListApi, addAdminUserApi, editAdminUserApi, delAdminUserApi } from '@/request'

type ParamsDataType = {
    id: string
    name: string
    email: string
    description: string
    password: string
    enable: string
}
type BaseDataType = {
    created_at: string
    description: string
    email: string
    enable: string
    id: number
    name: string
    operator_name: string
    role_name: string
    updated_by: number
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
    const { TextArea } = Input
    const [params, setParams] = useState<ParamsDataType>(dataSource)
    const onFinish = () => {
        form.validateFields().then((values: any) => {
            values.enable = params.enable === 'T' ? 'T' : 'F'
            handleOk({ ...params, ...values })
        })
    }
    const changeText = (value: string) => {
        form.setFieldsValue({
            description: value
        });
        setParams({
            ...params,
            description: value
        })
    }
    const changeStatus = (e: boolean) => {
        setParams({
            ...params,
            enable: e ? 'T' : 'F'
        })
    }
    return (
        <Modal
            title={params.id ? '编辑' : '创建'}
            visible={visible}
            width={800}
            centered
            footer={null}
            onCancel={handleCancel}>
            <Form
                name="basic"
                labelCol={{ span: 4 }}
                onFinish={onFinish}
                autoComplete="off"
                form={form}
                initialValues={params || {}}>
                <Form.Item label="账户名" name="name" rules={[{ required: true, message: '请输入账户名' }]}>
                    <Input
                        placeholder="请输入账户名"
                        allowClear />
                </Form.Item>
                <Form.Item label="登录密码" name="password" rules={[{ required: true, message: '请输入登录密码' }, { min: 6, max: 30, message: '请输入长度6-30之间的字符' }]}>
                    <Input
                        placeholder="请输入登录密码"
                        allowClear />
                </Form.Item>
                {/* <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
                    <Input
                        placeholder="请输入姓名"
                        allowClear />
                </Form.Item> */}
                <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[
                        { required: true, message: '请输入邮箱' },
                        {
                            pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
                            message: '邮箱格式不正确'
                        }
                    ]}>
                    <Input
                        placeholder="请输入邮箱"
                        allowClear />
                </Form.Item>
                <Form.Item label="描述" name="description">
                    <TextArea
                        placeholder="请输入描述"
                        onChange={(e) => { changeText(e.target.value) }} />
                </Form.Item>
                <Form.Item
                    label="状态"
                    name="enable">
                    <Switch
                        onClick={(e) => { changeStatus(e) }}
                        checked={params.enable === 'T'} />
                </Form.Item>
                {/* <Form.Item label="部门" name="name" rules={[{ required: true, message: '请输入部门' }]}>
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
                        {
                                officialData.map((item) => (
                                    <Select.Option
                                        value={item.value}
                                        key={item.value}
                                    >
                                        {item.name}
                                    </Select.Option>
                                ))
                            }
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
                        {
                                officialData.map((item) => (
                                    <Select.Option
                                        value={item.value}
                                        key={item.value}
                                    >
                                        {item.name}
                                    </Select.Option>
                                ))
                            }
                    </Select>
                </Form.Item> */}
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
    enables: string
}
export const UserMgr: React.FC = () => {
    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState<BaseDataType[]>([])
    const [dataTotal, setDataTotal] = useState<number>(0)
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [baseDetail, setBaseDetail] = useState<ParamsDataType | null>(null)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)

    const [searchParamsData, setSearchParamsData] = useState<SearchParamType>({
        keywords: '',
        enables: ''
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
            // {
            //     title: '部门',
            //     dataIndex: 'name',
            //     key: 'name',
            //     align: 'center'
            // },
            // {
            //     title: '角色',
            //     dataIndex: 'name',
            //     key: 'name',
            //     align: 'center'
            // },
            {
                title: '登录账号',
                dataIndex: 'email',
                key: 'email',
                align: 'center'
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                align: 'center'
            },
            // {
            //     title: '电话号码',
            //     dataIndex: 'name',
            //     key: 'name',
            //     align: 'center'
            // },
            {
                title: '状态',
                dataIndex: 'enable',
                key: 'enable',
                align: 'center',
                render: (_: any, item: BaseDataType) => (
                    <Switch
                        onClick={() => { changeStatus(item) }}
                        checked={item.enable === 'T'} />
                )
            },
            {
                title: '操作员',
                dataIndex: 'operator_name',
                key: 'operator_name',
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
        delAdminUserApi(id).then((res: any) => {
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
    const changeStatus = (item: BaseDataType) => {
        const data: ParamsDataType = JSON.parse(JSON.stringify(item))
        data.enable = data.enable === 'T' ? 'F' : 'T'
        modalConfirm(data)
    }
    const handleAdd = () => {
        let data = {
            id: '',
            name: '',
            email: '',
            description: '',
            password: '',
            enable: 'T'
        }
        setBaseDetail(data)
        setVisibleModal(true)
    }
    const handleItem = (item: BaseDataType) => {
        const data: ParamsDataType = JSON.parse(JSON.stringify(item))
        data.id = String(data.id)
        data.password = ''
        setBaseDetail(data)
        setVisibleModal(true)
    }
    const modalConfirm = (params: ParamsDataType) => {
        const formData = new FormData()
        formData.append('name', params.name)
        formData.append('email', String(params.email))
        formData.append('description', String(params.description))
        formData.append('password', String(params.password))
        formData.append('enable', String(params.enable))
        if (params.id) {
            editAdminUserApi(params).then((res: any) => {
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
            addAdminUserApi(formData).then((res: any) => {
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
            keywords: searchParamsData.keywords,
            enables: searchParamsData.enables ? [searchParamsData.enables] : ''
        }
        getAdminUserListApi(params).then((res: any) => {
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
                name: 'keywords',
                placeholder: '按用户名称搜索',
                label: '',
                type: 'input',
                width: 200
            },
            {
                name: 'enables',
                placeholder: '请选择状态',
                label: '',
                type: 'select',
                selectOp: [
                    {
                        name: '禁用',
                        value: 'F'
                    }, {
                        name: '启用',
                        value: 'T'

                    }
                ]
            }
        ],
        []
    );

    const onSearch = useCallback(
        (params) => {
            setPage(1)
            setSearchParamsData(params)
        },
        []
    );
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
