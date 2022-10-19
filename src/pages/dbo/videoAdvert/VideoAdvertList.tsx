import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Row, Col, Card, message, Switch, Modal, Form, Input, Select, Space } from 'antd'
import BaseTable from '@/components/base/BaseTable'
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm';
import { Moment } from 'moment/moment'
import { addVideoAdPosApi, delVideoAdPosApi, editVideoAdPosApi, getVideoAdOpApi, getVideoAdPosListApi, getVideoAllSiteApi_2 } from '@/request';

type AddModalPropType = {
    dataSource: any
    webData: any[]
    terminalOp: any[]
    visible: boolean
    handleCancel: () => void
    handleOk: (params: any) => void
}

const AddModal: React.FC<AddModalPropType> = (P) => {
    const { dataSource, visible, webData, terminalOp, handleCancel, handleOk } = P
    const [form] = Form.useForm();
    const [status, setStatus] = useState(dataSource.status);
    const onFinish = () => {
        form.validateFields().then((values: any) => {
            console.log('values ', values);
            handleOk({
                id: dataSource.id,
                name: values.name,
                web_id: webData.find((v) => v.value == values.web_name)?.id || null,
                terminal: values.terminal,
                status: status
            });
        }).catch((errorInfo) => {
            console.log('errorInfo ...', errorInfo, status);
        });
    }

    const changeStatus = (e: boolean) => {
        const p = e ? '1' : '2';
        form.setFieldsValue({ status: p });
        setStatus(p);
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
                initialValues={dataSource || {}}>
                <Form.Item label="广告位置名称" name="name" rules={[{ required: true, message: '请输入广告位置名称' }, { min: 2, max: 50, message: '请输入长度2-50之间的字符' }]}>
                    <Input
                        placeholder="请输入广告位置名称"
                        allowClear />
                </Form.Item>
                {/* <Form.Item label='广告地址' name="name" rules={[{ required: true, message: '请输入广告地址' }, { min: 2, max: 50, message: '请输入长度2-50之间的字符' }]}>
                    <Input
                        placeholder='请输入广告地址'
                        allowClear
                    />
                </Form.Item> */}
                <Form.Item label="使用网站" name="web_name" rules={[{ required: true, message: '请选择使用网站' }]}>
                    <Select
                        style={{ width: 200 }}
                        placeholder="请选择使用网站">
                        {webData && webData.map((item) => (<Select.Option value={item.value} key={String(item.value)}>{item.label}</Select.Option>))}
                    </Select>
                </Form.Item>
                <Form.Item label="终端" name="terminal" rules={[{ required: true, message: '请选择终端' }]}>
                    <Select
                        style={{ width: 200 }}
                        placeholder="请选择终端">
                        {terminalOp && terminalOp.map((item) => (<Select.Option value={String(item.id)} key={String(item.value)}>{item.label}</Select.Option>))}
                    </Select>
                </Form.Item>
                <Form.Item label="使用状态" name="status">
                    <Switch onClick={(e) => { changeStatus(e) }} checked={`${status}` == '1'} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export const VideoAdvertList: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;

    const [webData, setWebData] = useState([])
    const [terminalOp, setTerminalOp] = useState([])
    const [stateOp, setStateOp] = useState([])
    const [searchParamsData, setSearchParamsData] = useState(state?.searchParamsData || { web_id: null, guard_name: null, status: null })
    const [initQueryParam, setInitQueryParam] = useState(state?.searchParamsData || { web_id: null, guard_name: null, status: null });
    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'web_id',
                placeholder: '请选择网站',
                label: '',
                type: 'select',
                selectOp: webData,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>
            },
            {
                name: 'guard_name',
                placeholder: '请选择终端',
                label: '',
                type: 'select',
                selectOp: terminalOp,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>
            },
            {
                name: 'status',
                placeholder: '请选择状态',
                label: '',
                type: 'select',
                selectOp: stateOp,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>
            }
        ],
        [webData, terminalOp, stateOp]
    );

    const onSearch = useCallback(
        (params) => {
            setPage(1)
            setSearchParamsData(params)
        },
        []
    );

    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState([])
    const [per_page, setPer_page] = useState<number>(state?.per_page || 10)
    const [page, setPage] = useState<number>(state?.page || 1)
    const [dataTotal, setDataTotal] = useState<number>(0)
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
                title: '网站',
                dataIndex: 'web_name',
                key: 'web_name',
                align: 'center'
            },
            // {
            //     title: '位置链接地址',
            //     dataIndex: 'result_text',
            //     key: 'result_text',
            //     align: 'center'
            // },
            {
                title: '广告位名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '终端',
                dataIndex: 'terminal',
                key: 'terminal',
                render: (_: any, item) => (terminalOp.find((v) => v.id == item.terminal)?.value || ''),
                align: 'center'
            },
            {
                title: '控制',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                render: (_: any, item) => (<Switch onClick={() => { changeStatus(item.id, item.status) }} checked={`${item.status}` === '1'} />)
            },
            {
                title: '操作员',
                dataIndex: 'created_by',
                key: 'created_by',
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
                        <Button type="link" size="small" onClick={() => { handleItem(item) }}>编辑</Button>
                        <Button type="link" size="small" onClick={() => { onSetAd(item.id) }}>广告位设置</Button>
                        <Button type="link" size="small" onClick={() => { handleDel(item.id) }}>删除</Button>
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
        delVideoAdPosApi(id).then((res: any) => {
            message.success('删除成功')
            initData()
        }).catch((e) => {

        })
    }
    const changeStatus = (id: number, status: string) => {
        editVideoAdPosApi({ id: id, status: (`${status}`) === '1' ? '2' : '1' }).then((res: any) => {
            message.success('操作成功')
            initData()
        }).catch((e) => {

        })
    }
    const onSetAd = (id: number) => {
        navigate(`/Dbo/VideoAdvert/Setting?posId=${id}`, { state: { page, per_page, searchParamsData }, replace: false })
    }

    const [baseDetail, setBaseDetail] = useState(null)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const handleAdd = () => {
        let data = { id: null, status: '1' }
        setBaseDetail(data)
        setVisibleModal(true)
    }
    const handleItem = (item) => {
        setBaseDetail(item)
        setVisibleModal(true)
    }

    const modalConfirm = (params) => {
        const operationApi = params.id ? editVideoAdPosApi : addVideoAdPosApi
        operationApi(params).then((res: any) => {
            message.success(res.message)
            modalCancel()
            initData()
        }).catch((e) => { })
    }
    const modalCancel = () => {
        setBaseDetail(null)
        setVisibleModal(false)
    }

    const initData = () => {
        setLoadingTable(false)
        setLoadingTable(true)
        let params = {
            page,
            per_page,
            web_id: searchParamsData.web_id,
            terminal: searchParamsData.guard_name,
            status: searchParamsData.status ? [searchParamsData.status] : null
        }
        getVideoAdPosListApi(params).then((res: any) => {
            setBaseData(res.data.data)
            setDataTotal(res.data.total)
            setLoadingTable(false)
        }).catch(() => {
            setLoadingTable(false)
        })
    }

    const getOpList = () => {
        getVideoAdOpApi().then((res: any) => {
            let webData = []
            res.data.web_sites.forEach((item) => {
                webData.push({ id: item.id, label: item.web_name, value: item.web_name })
            })
            setWebData(webData)

            let stateData = []
            res.data.status.forEach((item) => {
                stateData.push({ id: item.value, label: item.text, value: item.text })
            })
            setStateOp(stateData)

            let terData = []
            res.data.terminals.forEach((item) => {
                terData.push({ id: item.value, label: item.text, value: item.text })
            })
            setTerminalOp(terData)
        }).catch((e) => {

        })
    }

    useEffect(() => {
        getOpList()
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
                        onSearch={onSearch}
                        params={initQueryParam} />
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
                        terminalOp={terminalOp}
                        handleOk={modalConfirm}
                        handleCancel={modalCancel} />
                )}
        </>
    )
}
