import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Button, Row, Col, Card, message, Select, Space, Table, Statistic, Form, Modal, DatePicker, Radio } from 'antd'
import { getTimingtimeListApi_2, delVideoSearchApi_2, getVideoAllCTypeApi_2, editTimingtimeBatchApi_2, editTimingtimeApi_2 } from '@/request'
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm';
import { Moment } from 'moment/moment'
import { momentToTime, timeToMoment } from '@/utils';

type BaseDataType = {
    cid: number
    episode: number
    id: number
    name: string
    timingtime: string
    updated_episode: string
}

type ParamsDataType = {
    type: string
    id: string
    isAll: boolean
    timingtime: string
}
type SearchParamType = {
    name: string
    cid: string
    date: Moment[] | null
}

type BaseModalPropType = {
    dataSource: ParamsDataType
    visible: boolean
    handleCancel: () => void
    handleOk: (params: ParamsDataType) => void
}

const BaseModal: React.FC<BaseModalPropType> = (P) => {
    const {
        dataSource, visible, handleCancel, handleOk
    } = P
    const [form] = Form.useForm()
    const [params, setParams] = useState<ParamsDataType>({
        id: dataSource.id,
        timingtime: dataSource.timingtime,
        isAll: dataSource.isAll,
        type: dataSource.type
    })
    const onFinish = () => {
        form.validateFields().then((values: any) => {
            values.timingtime = momentToTime(values.timingtime, 'YYYY-MM-DD HH:mm')
            handleOk({ ...params, ...values })
        })
    }

    const onRadioChange = (v) => {
        setParams({ type: v.target.value, timingtime: '', id: params.id, isAll: params.isAll })
    }
    return (
        <Modal
            title="编辑"
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
                preserve={false}
                form={form}>
                <Form.Item label="发布状态">
                    <Form.Item name="type" initialValue={params.type} style={{ display: 'inline-block', margin: 0 }}>
                        <Radio.Group onChange={onRadioChange}>
                            <Radio value="1">立即发布</Radio>
                            <Radio value="2">定时发布</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {
                        params.type == '2'
                            ? (
                                <Form.Item
                                    name="timingtime"
                                    initialValue={timeToMoment(params.timingtime || '')}
                                    style={{ display: 'inline-block', width: 150, margin: 0 }}
                                    rules={[{ required: true, message: '请选择发布时间' }]}>
                                    <DatePicker
                                        showTime={{ format: 'HH:mm' }}
                                        onOk={() => { }}
                                        format="YYYY-MM-DD HH:mm" />
                                </Form.Item>
                            ) : null
                    }
                </Form.Item>
            </Form>
        </Modal>
    )
}
export const VideoContentTime: React.FC = () => {
    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState<BaseDataType[]>()
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [dataTotal, setDataTotal] = useState<number>(0)
    const [cTypeArr, setCTypeArr] = useState([]);
    const [baseDetail, setBaseDetail] = useState<ParamsDataType | null>(null)
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [staticData, setStaticData] = useState([])
    const [selectIds, setSelectIds] = useState<string>('')
    const [searchParamsData, setSearchParamsData] = useState<SearchParamType>({
        name: '',
        cid: '',
        date: null
    })

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            render: (text: any, record: any, index: number) => `${index + 1}`,
            align: 'center'
        },
        {
            title: '视频名称',
            dataIndex: 'name',
            key: 'name',
            align: 'center'
        },
        {
            title: '类型',
            dataIndex: 'cid_text',
            key: 'cid_text',
            render: (text: any, item: any) => cTypeArr.filter((i) => i.id == item.cid).length > 0 && cTypeArr.filter((i) => i.id == item.cid)[0].value,
            align: 'center'
        },
        {
            title: '最近更新剧集',
            dataIndex: 'updated_episode',
            key: 'updated_episode',
            align: 'center'
        },
        {
            title: '视频剧集',
            dataIndex: 'introduction',
            key: 'introduction',
            render: (text: any, item: any) => `第${item.episode}集`,
            align: 'center'
        },
        {
            title: '计划发布时间',
            dataIndex: 'timingtime',
            key: 'timingtime',
            align: 'center'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (v: any, item: any) => (
                <Button type="link" size="small" onClick={() => { updateTime(item.id) }}>修改时间</Button>
            ),
            align: 'center'
        }
    ]
    const onChange = (pageParams) => {
        setPage(pageParams.current)
        setPer_page(pageParams.pageSize)
    }
    const handleDel = (id: number) => {
        delVideoSearchApi_2(id).then((res: any) => {
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
    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'name',
                placeholder: '按视频名称关键字搜索',
                type: 'input',
                width: 200
            },
            {
                name: 'cid',
                placeholder: '视频类型',
                type: 'select',
                selectOp: cTypeArr || [],
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
                width: 100
            },
            {
                name: 'date',
                type: 'rangePicker'
            }
        ],
        [cTypeArr]
    );

    const onSearch = useCallback(
        (params) => {
            setPage(1)
            setSearchParamsData(params)
        },
        []
    );
    const initData = () => {
        setSelectIds('')
        setLoadingTable(true)
        let params = {
            page,
            per_page,
            name: searchParamsData.name,
            cid: searchParamsData.cid,
            time_1: searchParamsData.date ? searchParamsData.date[0].format('YYYY-MM-DD') : '',
            time_2: searchParamsData.date ? searchParamsData.date[1].format('YYYY-MM-DD') : ''
        }
        getTimingtimeListApi_2(params).then((res: any) => {
            if (res.code == 200) {
                setBaseData(res.data.list.data)
                setDataTotal(res.data.list.total)
                setStaticData(res.data.static)
                setLoadingTable(false)
            } else {
                message.error(res.message)
                setLoadingTable(false)
            }
        }).catch(() => {
            setLoadingTable(false)
        })
    }
    const getTypeList = () => {
        getVideoAllCTypeApi_2().then((res: any) => {
            setCTypeArr(res.data);
        });
    }

    const onPageSizeChange = (current, size) => {
        setPage(current);
        setPer_page(size);
    }
    const onPageChange = (page, _pageSize) => {
        setPage(page);
    }

    const rowSelection = {
        selectedRowKeys: selectIds.split(','),
        onChange: (selectedRowKeys: React.Key[], selectedRows: BaseDataType[]) => {
            setSelectIds(selectedRowKeys.length > 0 ? selectedRowKeys.join(',') : '')
        },
        getCheckboxProps: (record: BaseDataType) => ({
        })
    };
    const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: per_page,
        current: page,
        total: dataTotal,
        showTotal: () => `共${dataTotal}条`,
        onShowSizeChange: (current, size) => onPageSizeChange(current, size),
        onChange: (page, _pageSize) => onPageChange(page, _pageSize)
    }
    const updateTime = (id: number) => {
        const data = {
            id: String(id),
            type: '1',
            isAll: false,
            timingtime: ''
        }
        setBaseDetail(data)
        setVisibleModal(true)
    }
    const updateTimeAll = () => {
        if (!selectIds) {
            message.info('请选择需要修改的数据')
            return
        }
        const data = {
            id: selectIds,
            type: '1',
            isAll: true,
            timingtime: ''
        }
        setBaseDetail(data)
        setVisibleModal(true)
    }

    const modalConfirm = (params: ParamsDataType) => {
        const formData = new FormData()
        formData.append('status', params.type)
        if (params.type == '2') {
            formData.append('time', String(params.timingtime))
        }
        if (params.isAll) {
            formData.append('ids', String(params.id))
            editTimingtimeBatchApi_2(formData).then((res: any) => {
                if (res.code == 200) {
                    message.success('操作成功')
                    modalCancel()
                    initData()
                } else {
                    message.error(res.message)
                }
            })
        } else {
            formData.append('id', String(params.id))
            editTimingtimeApi_2(formData).then((res: any) => {
                if (res.code == 200) {
                    message.success('操作成功')
                    modalCancel()
                    initData()
                } else {
                    message.error(res.message)
                }
            })
        }
    }
    const modalCancel = () => {
        setBaseDetail(null)
        setVisibleModal(false)
    }
    useEffect(() => {
        getTypeList()
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
                {
                    staticData.map((item) => {
                        return (
                            <Col span={4} key={item.cid}>
                                <Card>
                                    <Statistic
                                        title={item.c_name}
                                        value={item.cid_count} />
                                </Card>
                            </Col>
                        )
                    })
                }
                <Col span={24}>
                    <Card>
                        <Space direction="vertical" size={[4, 20]} style={{ width: '100%' }}>
                            <Button type="primary" danger onClick={() => updateTimeAll()}>发布修改</Button>
                            <Table
                                bordered
                                // @ts-ignore
                                columns={columns}
                                dataSource={baseData}
                                pagination={paginationProps}
                                loading={loadingTable}
                                rowSelection={{
                                    type: 'checkbox',
                                    ...rowSelection
                                }}
                                rowKey={(record) => `${record.id}`} />
                        </Space>
                    </Card>
                </Col>
            </Row>
            {baseDetail
                && (
                    <BaseModal
                        dataSource={baseDetail}
                        visible={visibleModal}
                        handleOk={modalConfirm}
                        handleCancel={modalCancel} />
                )}
        </>

    )
}
