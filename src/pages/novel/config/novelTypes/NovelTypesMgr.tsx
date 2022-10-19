import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Row, Col, Card, message, Switch, Modal, Form, Input, Select, Space, Image } from 'antd'
import { addNovelClassifyApi, delNovelClassifyApi, editNovelClassifyApi, getNovelClassifyListApi, getNovelClassifyStateApi } from '@/request'
import BaseTable from '@/components/base/BaseTable'
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm';
import { novelChannelOp, opValToId, stateOp } from '@/type';
import { ImgUploader } from '@/components/upload';

type AddModalPropType = {
    dataSource: any
    visible: boolean
    handleCancel: () => void
    handleOk: (params: any) => void
}

const AddModal: React.FC<AddModalPropType> = (P) => {
    const { dataSource, visible, handleCancel, handleOk } = P;
    // dataSource.icon = 'http://192.168.0.30:8188/storage/uploads/temp/xfcVlOjZwh5siuOnBVFJ861u8JJlWm1bhYQzfdnh.jpg';
    const [status, setStatus] = useState(dataSource.status);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState<string>(dataSource.icon || '');
    const [isLoading, setLoading] = useState<boolean>(false);
    const onFinish = () => {
        if (isLoading) {
            message.warn('图片上传未完成');
            return;
        }
        form.validateFields().then((v: any) => {
            console.log('values ', v, status);
            handleOk({ id: dataSource.id, channel_id: v.channel, name: v.name, status: v.status, icon: imageUrl });
        }).catch((errorInfo) => {
            console.log('errorInfo ...', errorInfo, status);
        });
    }
    const changeIcon = (e) => {
        // console.log('changeIcon', e);
        e && e.length && setImageUrl(e[0].url);
    }
    const changeUp = (info: any) => {
        // console.log('changeUp', info);
        if (info.file.status === 'uploading') {
            setLoading(true);
        } else {
            setLoading(false);
        }
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
                <Form.Item label="图标" name="icon">
                    <ImgUploader
                        label="图标"
                        file_type="pic"
                        category="novel_type_icon"
                        maxCount={1}
                        onChange={changeIcon}
                        onUpChange={changeUp} />
                </Form.Item>
                <Form.Item label="类型" name="name" rules={[{ required: true, message: '请输入类型名称' }, { min: 2, max: 50, message: '请输入长度2-50之间的字符' }]}>
                    <Input placeholder="请输入类型名称" allowClear />
                </Form.Item>
                {
                    !dataSource.id && (
                        <Form.Item label="频道" name="channel" rules={[{ required: true, message: '请选择频道' }]}>
                            <Select style={{ width: 200 }} placeholder="请选择频道">
                                {novelChannelOp.map((item) => (<Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>))}
                            </Select>
                        </Form.Item>
                    )
                }
                <Form.Item label="状态" name="status">
                    <Switch
                        onClick={(e) => { changeStatus(e) }}
                        checked={`${status}` == '1'} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export const NovelTypesMgr: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    const [queryParam, setQueryParam] = useState(state?.queryParam || { channel_id: null, status: null });
    const [initQueryParam, setInitQueryParam] = useState(state?.queryParam || { channel_id: null, status: null });
    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'channel_id',
                placeholder: '所属频道',
                type: 'select',
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
                selectOp: novelChannelOp
            },
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

    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState([])
    const [per_page, setPer_page] = useState<number>(state?.per_page || 10)
    const [page, setPage] = useState<number>(state?.page || 1)
    const [dataTotal, setDataTotal] = useState<number>(0)
    const onAdd = () => {
        let data = {
            id: null,
            channel: null,
            status: 1,
            name: '',
            icon: ''
        }
        setBaseDetail(data);
        setVisibleModal(true);
    }
    const onEdit = (item: any) => {
        setBaseDetail({ id: item.id, channel: opValToId(novelChannelOp, item.channel), status: item.status, name: item.name, icon: item.icon });
        setVisibleModal(true);
    }
    const onManage = (item: any) => {
        navigate(`/Novel/ConfigMgr/NovelTypesMgr/SubMgr?id=${item.id}`, { state: { per_page, page, queryParam }, replace: false })
    }
    const onDelete = (id: number) => {
        delNovelClassifyApi(id).then((res: any) => {
            message.success('删除成功');
            getDataList();
        });
    }
    const changeStatus = (id: number) => {
        getNovelClassifyStateApi(id).then((res: any) => {
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
                title: '图标',
                dataIndex: 'icon',
                key: 'icon',
                render: (text: any, item: any) => (<Image src={item.icon} width={60} />),
                align: 'center'
            },
            {
                title: '类型',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '所属频道',
                dataIndex: 'channel',
                key: 'channel',
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
                    <Space size={[4, 4]}>
                        <Button type="link" onClick={() => { onEdit(item) }}>编辑</Button>
                        <Button type="link" onClick={() => { onManage(item) }}>子类管理</Button>
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
        const operationApi = params.id ? editNovelClassifyApi : addNovelClassifyApi
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
        getNovelClassifyListApi({ page: page, per_page: per_page, ...queryParam }).then((res: any) => {
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
                        onSearch={onSearch}
                        params={initQueryParam} />
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
