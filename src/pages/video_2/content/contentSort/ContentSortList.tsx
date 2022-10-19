import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, Card, message, Switch, Modal, Form, Input, Select, Space } from 'antd'
import {
    delVideoRecommendApi_2, getVideoAllSiteApi_2, getVideoRecommendListApi_2, getVideoRecommendStateApi_2,
    postVideoRecommendAddApi_2, postVideoRecommendEditApi_2
} from '@/request'
import BaseTable from '@/components/base/BaseTable'
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm';
import { stateOp } from '@/type';

type BaseDataType = {
    id: number
    name?: string
    web_id?: number
    web_name?: string
    user_id?: number
    admin?: string
    created_at?: string
    status: number
    remarks?: string
    keyword?: string
    result_text?: string
}

type AddModalPropType = {
    dataSource: BaseDataType
    webData: any[]
    visible: boolean
    handleCancel: () => void
    handleOk: (params: any) => void
}

const AddModal: React.FC<AddModalPropType> = (P) => {
    const { dataSource, visible, webData, handleCancel, handleOk } = P
    const [form] = Form.useForm();
    const onFinish = () => {
        form.validateFields().then((v: any) => {
            handleOk({ id: dataSource.id, name: v.name, web_id: v.web_id, remarks: v.remarks, status: v.status ? 1 : 2 });
        }).catch((errorInfo) => {
            console.log('errorInfo ...', errorInfo);
        });
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
                preserve={false}>
                <Form.Item label="模块名称" name="name" initialValue={dataSource.name} rules={[{ required: true, message: '请输入模块名称' }, { min: 2, max: 50, message: '请输入长度2-50之间的字符' }]}>
                    <Input allowClear />
                </Form.Item>
                {/* <Form.Item label='路径' name="name" rules={[{ required: true, message: '请输入路径' }, { min: 2, max: 50, message: '请输入长度2-50之间的字符' }]}>
                    <Input
                        placeholder='请输入路径'
                        allowClear
                    />
                </Form.Item> */}
                <Form.Item label="使用网站" name="web_id" initialValue={Number(dataSource.web_id) || null} rules={[{ required: true, message: '请选择使用网站' }]}>
                    <Select style={{ width: 200 }} placeholder="请选择使用网站">
                        {webData.map((item) => (<Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>))}
                    </Select>
                </Form.Item>
                <Form.Item label="备注" name="remarks" initialValue={dataSource.remarks} rules={[{ required: true, message: '请输入备注' }, { min: 2, max: 50, message: '请输入长度2-50之间的字符' }]}>
                    <Input allowClear />
                </Form.Item>
                <Form.Item label="使用状态" name="status" valuePropName="checked" initialValue={`${dataSource.status}` == '1'}>
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    )
}

type SearchParamType = {
    keywords: string
    web_id: string
    status: string
}
export const ContentSortList: React.FC = () => {
    const navigate = useNavigate();
    const [searchParamsData, setSearchParamsData] = useState<SearchParamType>({ keywords: '', web_id: '', status: '' })
    const [webData, setWebData] = useState([])
    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'keywords',
                placeholder: '按网站名称搜索',
                type: 'input',
                width: 200
            },
            {
                name: 'web_id',
                placeholder: '网站',
                type: 'select',
                width: 150,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
                selectOp: webData
            },
            {
                name: 'status',
                placeholder: '状态',
                type: 'select',
                width: 100,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
                selectOp: stateOp
            }
        ],
        [webData]
    );
    const onSearch = useCallback(
        (params) => {
            setPage(1)
            setSearchParamsData(params)
        },
        []
    );

    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState<BaseDataType[]>()
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [dataTotal, setDataTotal] = useState<number>(0)
    const handleAdd = () => {
        let data = {
            id: null,
            status: 1
        }
        setBaseDetail(data)
        setVisibleModal(true)
    }
    const handleItem = (item: BaseDataType) => {
        setBaseDetail(item)
        setVisibleModal(true)
    }
    const onManage = (item: any) => {
        navigate(`/Video2/ContentMgr/ContentSortList/Setting?id=${item.id}`, { replace: false })
    }
    const handleDel = (id: number) => {
        delVideoRecommendApi_2(id).then((res: any) => {
            if (res.code == 200) {
                message.success(res.message)
                initData()
            } else {
                message.error(res.message)
            }
        }).catch((e) => {

        })
    }
    const changeStatus = (id: number) => {
        getVideoRecommendStateApi_2(id).then((res: any) => {
            if (res.code == 200) {
                message.success(res.message)
                initData()
            } else {
                message.error(res.message)
            }
        }).catch((e) => {
        })
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
                title: '排序名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '网站',
                dataIndex: 'web_name',
                key: 'web_name',
                align: 'center'
            },
            {
                title: '备注',
                dataIndex: 'remarks',
                key: 'remarks',
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
                render: (v: any, item: any) => (
                    <Space size={[4, 4]}>
                        <Button type="link" onClick={() => { onManage(item) }}>排序管理</Button>
                        <Button type="link" onClick={() => { handleItem(item) }}>编辑</Button>
                        <Button type="link" onClick={() => { handleDel(item.id) }}>删除</Button>
                    </Space>
                ),
                align: 'center'
            }
        ],
        showPagination: true,
        page: { dataTotal, page, size: per_page }
    }

    const [baseDetail, setBaseDetail] = useState<BaseDataType | null>(null)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const modalConfirm = (params) => {
        const operationApi = params.id ? postVideoRecommendEditApi_2 : postVideoRecommendAddApi_2
        operationApi(params.id, params).then((res: any) => {
            if (res.code == 200) {
                message.success(res.message);
                modalCancel();
                initData();
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
        getVideoRecommendListApi_2({ page: page, per_page: per_page, ...searchParamsData }).then((res: any) => {
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

    const getWebList = () => {
        getVideoAllSiteApi_2().then((res: any) => {
            if (res.code == 200) {
                setWebData(res.data);
            } else {
                message.error(res.message)
            }
        }).catch((e) => {

        })
    }

    useEffect(() => {
        getWebList()
    }, [])

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
            {baseDetail
                && (
                    <AddModal
                        dataSource={baseDetail}
                        visible={visibleModal}
                        webData={webData}
                        handleOk={modalConfirm}
                        handleCancel={modalCancel} />
                )}
        </>
    )
}
