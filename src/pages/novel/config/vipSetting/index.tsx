import React, { useEffect, useState } from 'react'
import { Button, Space, Switch, Row, Col, Modal, Form, Input, message, Card } from 'antd'
import { getNovelVipListApi, delNovelVipApi, getNovelVipStateApi, addNovelVipApi, editNovelVipApi } from '@/request'
import BaseTable from '@/components/base/BaseTable'

type BaseDataType = {
    id: number
    admin: string
    created_at: string
    duration: string
    original_price: string
    sell_price: string
    state: string
    user_id: number
}
type ParamsDataType = {
    id: number
    duration: string
    original_price: string
    sell_price: string
    state: string
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
    const onFinish = () => {
        form.validateFields().then((values: any) => {
            // console.log('values ', values);
            handleOk({
                id: dataSource.id,
                duration: values.duration,
                original_price: values.original_price,
                sell_price: values.sell_price,
                state: values.state ? '1' : '2'
            })
        }).catch((errorInfo) => {
            console.log('errorInfo ...', errorInfo);
        });
    }
    const changeStatus = (e: boolean) => {
        form.setFieldsValue({ state: e });
    }
    const priceRule = {
        required: true,
        message: '价格为大于0的整数或两位小数',
        validator: (rule, value) => {
            return new Promise((resolve, reject) => {
                if (!value) {
                    reject();
                } else {
                    const arr = (`${value}`).split('.');
                    const v = Number(value);
                    if (arr.length > 1) {
                        if (arr[1].length != 2) {
                            reject();
                        } else {
                            (!v || Number.isNaN(v) || v < 0 || !Number(arr[1])) ? reject() : resolve(null);
                        }
                    } else {
                        (!v || Number.isNaN(v) || v < 0) ? reject() : resolve(null);
                    }
                }
            });
        }
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
            destroyOnClose
            onOk={onFinish}>
            <Form
                name="basic"
                labelCol={{ span: 4 }}
                autoComplete="off"
                form={form}
                preserve={false}>
                <Form.Item label="VIP时长" name="duration" rules={[{ required: true, message: '请输入VIP时长' }]} initialValue={dataSource.duration}>
                    <Input type="number" placeholder="请输入VIP时长" allowClear addonAfter="个月" />
                </Form.Item>
                <Form.Item label="原价" name="original_price" rules={[priceRule]} initialValue={dataSource.original_price}>
                    <Input placeholder="请输入原价" allowClear addonAfter="元" />
                </Form.Item>
                <Form.Item label="出售价" name="sell_price" rules={[priceRule]} initialValue={dataSource.sell_price}>
                    <Input placeholder="请输入出售价" allowClear addonAfter="元" />
                </Form.Item>
                <Form.Item label="使用状态" valuePropName="checked" name="state" initialValue={`${dataSource.state}` == '1'}>
                    <Switch onChange={changeStatus} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export const VipSetting: React.FC = () => {
    const [baseDetail, setBaseDetail] = useState<ParamsDataType | null>(null)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const modalConfirm = (params: ParamsDataType) => {
        const operationApi = params.id ? editNovelVipApi : addNovelVipApi
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

    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState<BaseDataType[]>([])
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [dataTotal, setDataTotal] = useState<number>(0)
    const handleAdd = () => {
        let data = {
            id: null,
            duration: '',
            original_price: '',
            sell_price: '',
            state: '1'
        }
        setBaseDetail(data)
        setVisibleModal(true)
    }
    const changeStatus = (id: number) => {
        getNovelVipStateApi(id).then((res: any) => {
            if (res.code == 200) {
                message.success(res.message)
                initData()
            } else {
                message.error(res.message)
            }
        }).catch((e) => {

        })
    }
    const handleDel = (id: number) => {
        delNovelVipApi(id).then((res: any) => {
            if (res.code == 200) {
                message.success(res.message)
                initData()
            } else {
                message.error(res.message)
            }
        }).catch((e) => {

        })
    }
    const handleItem = (item) => {
        setBaseDetail(item)
        setVisibleModal(true)
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
                dataIndex: 'index',
                key: 'index',
                render: (text: any, record: any, index: number) => `${index + 1}`,
                align: 'center',
                width: '80px'
            },
            {
                title: 'VIP类型时长',
                dataIndex: 'duration',
                key: 'duration',
                align: 'center'
            },
            {
                title: '原价(￥)',
                dataIndex: 'original_price',
                key: 'original_price',
                align: 'center'
            },
            {
                title: '出售价',
                dataIndex: 'sell_price',
                key: 'sell_price',
                align: 'center'
            },
            {
                title: '状态',
                dataIndex: 'state',
                key: 'state',
                align: 'center',
                render: (_: any, item: BaseDataType) => (<Switch onClick={() => { changeStatus(item.id) }} checked={`${item.state}` == '1'} />)
            },
            {
                title: '操作员',
                dataIndex: 'admin',
                key: 'admin',
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

    const initData = () => {
        setLoadingTable(true)
        getNovelVipListApi().then((res: any) => {
            if (res.code == 200) {
                setBaseData(res.data.data)
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
