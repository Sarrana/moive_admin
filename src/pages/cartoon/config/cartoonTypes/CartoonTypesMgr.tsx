import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Button, Row, Col, Card, message, Switch, Modal, Form, Input, Select, Space } from 'antd'
import { addCartoonTypeApi, delCartoonTypeApi, editCartoonTypeApi, getCartoonAllTypeApi, getCartoonTypeListApi, getCartoonTypeStateApi } from '@/request'
import BaseTable from '@/components/base/BaseTable'
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm';
import { stateOp } from '@/type';

type AddModalPropType = {
    dataSource: any
    visible: boolean
    handleCancel: () => void
    handleOk: (params: any) => void
}

const AddModal: React.FC<AddModalPropType> = (P) => {
    const { dataSource, visible, handleCancel, handleOk } = P;
    const [status, setStatus] = useState(dataSource.status);
    const [form] = Form.useForm();
    const onFinish = () => {
        form.validateFields().then((v: any) => {
            // console.log('values ', v, status);
            handleOk({ id: dataSource.id, name: v.name, status: v.status });
        }).catch((errorInfo) => {
            console.log('errorInfo ...', errorInfo, status);
        });
    }
    const changeStatus = (e: boolean) => {
        const p = e ? 1 : 2;
        form.setFieldsValue({ status: p });
        setStatus(p);
    }

    return (
        <Modal
            title={dataSource.id ? '编辑' : '创建'}
            visible={visible}
            width={500}
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
                initialValues={dataSource || {}}>
                <Form.Item label="类型" name="name" rules={[{ required: true, message: '请输入类型名称' }, { min: 2, max: 50, message: '请输入长度2-50之间的字符' }]}>
                    <Input placeholder="请输入类型名称" allowClear />
                </Form.Item>
                <Form.Item label="状态" name="status">
                    <Switch
                        onClick={(e) => { changeStatus(e) }}
                        checked={`${status}` == '1'} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export const CartoonTypesMgr: React.FC = () => {
    const [queryParam, setQueryParam] = useState({ status: null });
    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'status',
                placeholder: '状态',
                type: 'select',
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
                selectOp: stateOp
            }
        ],
        []
    );
    const onSearch = useCallback(
        (params) => {
            setPage(1)
            setQueryParam(params)
        },
        []
    );

    const [loadingTable, setLoadingTable] = useState<boolean>(false)
    const [baseData, setBaseData] = useState([])
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [dataTotal, setDataTotal] = useState<number>(0)
    const onAdd = () => {
        let data = {
            id: null,
            status: 1
        }
        setBaseDetail(data);
        setVisibleModal(true);
    }
    const onEdit = (item: any) => {
        setBaseDetail({ id: item.id, status: item.status, name: item.name });
        setVisibleModal(true);
    }
    const onDelete = (id: number) => {
        delCartoonTypeApi(id).then((res: any) => {
            message.success('删除成功');
            getDataList();
        });
    }
    const changeStatus = (id: number) => {
        getCartoonTypeStateApi(id).then((res: any) => {
            message.success('操作成功');
            getDataList();
        });
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
                align: 'center',
                render: (text: any, record: any, index: number) => `${index + 1}`
            },
            {
                title: '类型',
                dataIndex: 'name',
                key: 'name',
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
                render: (v: any, item: any) => (
                    <Space size={[4, 4]}>
                        <Button type="link" onClick={() => { onEdit(item) }}>编辑</Button>
                        <Button type="link" onClick={() => { onDelete(item.id) }}>删除</Button>
                    </Space>
                ),
                align: 'center'
            }
        ],
        showPagination: true,
        page: { dataTotal, page, size: per_page }
    }

    const [visibleModal, setVisibleModal] = useState<boolean>(false);
    const [baseDetail, setBaseDetail] = useState(null);
    const modalConfirm = (params) => {
        const operationApi = params.id ? editCartoonTypeApi : addCartoonTypeApi
        operationApi(params).then((res: any) => {
            if (res.code == 200) {
                message.success(res.message);
                modalCancel();
                getDataList();
            } else {
                message.error(res.message)
            }
        }).catch((e) => { })
    }
    const modalCancel = () => {
        setBaseDetail(null)
        setVisibleModal(false);
    }

    const getDataList = () => {
        setLoadingTable(true)
        getCartoonTypeListApi({ page: page, per_page: per_page, ...queryParam }).then((res: any) => {
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
        }).catch((e) => {
            setLoadingTable(false)
        });
    }

    useEffect(() => {
        getDataList()
    }, [page, per_page, queryParam])

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
                            <Button type="primary" danger onClick={onAdd}>新增</Button>
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
