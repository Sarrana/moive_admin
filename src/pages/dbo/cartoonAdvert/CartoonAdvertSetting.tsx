import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, Card, message, Switch, Modal, Form, Input, Select, Space, Image, InputNumber } from 'antd'
import { getVideoSearchListApi, delVideoSearchApi, getVideoAllSiteApi, updateUserAgreementsStatuslApi } from '@/request'
import BaseTable from '@/components/base/BaseTable'
import { ImgUploader } from '@/components/upload';

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
    visible: boolean
    handleCancel: () => void
    handleOk: (params: ParamsDataType) => void
}

const AddModal: React.FC<AddModalPropType> = (P) => {
    const { dataSource, visible, handleCancel, handleOk } = P
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
                <Form.Item label="广告图" name="name" rules={[{ required: true, message: '请选择广告图' }]}>
                    <ImgUploader
                        file_type="pic"
                        category="pic"
                        maxCount={1} />
                </Form.Item>
                <Form.Item label="链接位置" name="name" rules={[{ required: true, message: '请输入链接位置' }, { min: 2, max: 50, message: '请输入长度2-50之间的字符' }]}>
                    <Input
                        placeholder="请输入链接位置"
                        allowClear />
                </Form.Item>
                <Form.Item label="排序" name="web_id" rules={[{ required: true, message: '请输入排序' }]}>
                    <InputNumber min={1} placeholder="请输入排序" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="状态"
                    name="status">
                    <Switch
                        onClick={(e) => { changeStatus(e) }}
                        checked={params.status === 1} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export const CartoonAdvertSetting: React.FC = () => {
    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState<BaseDataType[]>()
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [dataTotal, setDataTotal] = useState<number>(0)
    const [baseDetail, setBaseDetail] = useState<ParamsDataType | null>(null)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
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
                title: '图片',
                dataIndex: 'keyword',
                key: 'keyword',
                align: 'center',
                render: (_: any, item: BaseDataType) => (
                    <Image
                        style={{ width: 60 }}
                        src="" />
                )
            },
            {
                title: '位置链接',
                dataIndex: 'result_text',
                key: 'result_text',
                align: 'center'
            },
            {
                title: '排序',
                dataIndex: 'web_name',
                key: 'web_name',
                align: 'center'
            },
            {
                title: '控制',
                dataIndex: 'guard_name',
                key: 'guard_name',
                align: 'center',
                render: (_: any, item: BaseDataType) => (
                    <Switch
                        onClick={() => { changeStatus(item.id) }}
                        checked={item.guard_name == '1'} />
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
                render: (v: any, item: any) => (
                    <Space>
                        <Button
                            type="link"
                            onClick={() => { handleItem(item.id) }}>
                            编辑
                        </Button>
                        <Button
                            type="link"
                            onClick={() => { handleDel(item.id) }}>
                            删除
                        </Button>
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
    const initData = () => {
        setLoadingTable(true)
        let params = {
            page,
            per_page
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
    useEffect(() => {
        initData()
    }, [page, per_page])
    return (
        <>
            <Row gutter={[12, 30]}>
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
