import React, { useEffect, useState } from 'react'
import { Button, Row, Col, message, Modal, Form, Input, Select, Space } from 'antd'
import { getVideoSortVideoListApi, postVideoSortVideoAddApi } from '@/request'
import BaseTable from '@/components/base/BaseTable'
import { _OptionType } from '@/type';

type BaseDataType = {
    id: number
    /** 视频id */
    content_id: number
    /** 排序值（越大越靠前） */
    sort: number
    name: string
    pic: string
    type: string,
    /** 介绍 */
    present: string,
    /** 已上传集数 */
    episodes_count: number,
    total: number,
    /** 连载状态 */
    mode: string,
    area: string,
    year: string,
    score: number,
    play_amount: number,
    /** 状态：1-开启，2-关闭 */
    status: string,
    /** 发布时间 */
    created_at: string,
}

type AddModalPropType = {
    recommend_id: string
    classifyArr: _OptionType[]
    cTypeArr: _OptionType[]
    serialArr: _OptionType[]
    visible: boolean
    handleCancel: () => void
    handleOk: () => void
}

type querierPropType = {
    params: any
    classifyArr: _OptionType[]
    typeArr: _OptionType[]
    serialArr: _OptionType[]
    onValueChange: (type: string, key: string, value: any, o?: any) => void
    onQuery: () => void
    onReset: () => void
}

const AddModalQuerier = (props: querierPropType) => {
    const classifyArr = props.classifyArr;
    const typeArr = props.typeArr;
    const serialArr = props.serialArr;

    return (
        <Space>
            <Form layout="inline">
                <Form.Item>
                    <Input
                        placeholder="按视频名称搜索"
                        style={{ width: 200 }}
                        value={props.params.name}
                        onChange={(v) => props.onValueChange('input', 'name', v)}
                        allowClear />
                </Form.Item>
                <Form.Item>
                    <Select
                        style={{ width: 100 }}
                        value={props.params.classify}
                        onChange={(v, o) => props.onValueChange('select', 'classify', v, o)}
                        placeholder="视频分类"
                        allowClear>
                        {
                            classifyArr.map((status) => (
                                <Select.Option value={status.id} key={status.value}>
                                    {status.value}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Select
                        style={{ width: 100 }}
                        value={props.params.type}
                        onChange={(v, o) => props.onValueChange('select', 'type', v, o)}
                        placeholder="视频类型"
                        allowClear>
                        {
                            typeArr.map((status) => (
                                <Select.Option value={status.value} key={status.value}>
                                    {status.value}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Select
                        style={{ width: 100 }}
                        value={props.params.serial}
                        onChange={(v, o) => props.onValueChange('select', 'serial', v, o)}
                        placeholder="视频模式"
                        allowClear>
                        {
                            serialArr.map((status) => (
                                <Select.Option value={status.id} key={status.value}>
                                    {status.value}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                {/* <Form.Item>
                    <Select
                        style={{ width: 100 }}
                        value={props.params.serial}
                        onChange={(v, o) => props.onValueChange('select', 'state', v, o)}
                        placeholder={"视频状态"}
                        allowClear
                    >
                        {
                            stateOp.map((status) => (
                                <Select.Option value={status.id} key={status.value}>
                                    {status.value}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item> */}
            </Form>
            <Button onClick={props.onQuery} type="primary">查询</Button>
            <Button onClick={props.onReset}>重置</Button>
        </Space>
    )
}

export const ContentSortSettingAddModal: React.FC<AddModalPropType> = (P) => {
    const { recommend_id, visible, classifyArr, cTypeArr, serialArr, handleCancel, handleOk } = P

    const [typeArr, setTypeArr] = useState([]);
    const [forQueryParam, setForQueryParam] = useState({});
    const [queryParam, setQueryParam] = useState({ name: '', classify: null, type: null, serial: null, state: null })
    const onValueChange = (type: string, key: string, v: any, o?: any) => {
        if (type == "input") {
            setQueryParam({ ...queryParam, [key]: v.target.value });
        } else {
            if (key == "classify") {
                setQueryParam({ ...queryParam, [key]: v, type: null });
                if (v) {
                    setTypeArr(cTypeArr.filter((val) => val.id == v)[0]?.video_type || []);
                } else {
                    setTypeArr([]);
                }
            } else {
                setQueryParam({ ...queryParam, [key]: v });
            }
        }
    }
    const onQuery = () => {
        let params = {
            keywords: queryParam.name,
            cid: queryParam.classify,
            type: queryParam.type,
            videomode: queryParam.serial
        }
        setPage(1);
        setForQueryParam({ ...params });
    }
    const onReset = () => {
        // setPage(1);
        setQueryParam({ name: '', classify: null, type: null, serial: null, state: null });
        setForQueryParam({});
        setTypeArr([]);
    }

    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState<BaseDataType[]>()
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [dataTotal, setDataTotal] = useState<number>(0)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onChange = (pageParams) => {
        setPage(pageParams.current)
        setPer_page(pageParams.pageSize)
    }
    const paramsData = {
        list: baseData,
        columns: [
            // {
            //     title: '排序',
            //     dataIndex: 'sort',
            //     key: 'sort',
            //     align: 'center'
            // },
            {
                title: '视频名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '视频分类',
                dataIndex: 'c_name',
                key: 'c_name',
                align: 'center'
            },
            {
                title: '视频类型',
                dataIndex: 'type',
                key: 'type',
                align: 'center'
            },
            {
                title: '视频模式',
                dataIndex: 'video_mode_text',
                key: 'video_mode_text',
                align: 'center'
            },
            {
                title: '地区',
                dataIndex: 'area',
                key: 'area',
                align: 'center'
            },
            {
                title: '年代',
                dataIndex: 'year',
                key: 'year',
                align: 'center'
            },
            {
                title: '综合评分',
                dataIndex: 'score',
                render: (text: any, item: any) => Number(item.score),
                key: 'score',
                align: 'center'
            },
            {
                title: '播放量',
                dataIndex: 'play_amount',
                render: (text: any, item: any) => Number(item.playamount),
                key: 'play_amount',
                align: 'center'
            }
        ],
        showPagination: true,
        page: { dataTotal, page, size: per_page }
    }
    const rowSelection = {
        type: 'checkbox',
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            // console.log('selectedRowKeys', selectedRowKeys);
            setSelectedRowKeys(selectedRowKeys);
        },
        getCheckboxProps: (item: any) => ({
            disabled: item.release_status == 1,
            name: item.id
        })
    };

    const onFinish = () => {
        if (selectedRowKeys && selectedRowKeys.length) {
            postVideoSortVideoAddApi(recommend_id, { ids: selectedRowKeys.join(',') }).then((res: any) => {
                message.success('添加成功');
                setSelectedRowKeys([]);
                handleOk();
            });
        }
    }

    const initData = () => {
        setLoadingTable(true);
        getVideoSortVideoListApi(recommend_id, { page, per_page, ...forQueryParam }).then((res: any) => {
            setBaseData(res.data.data);
            setPage(Number(res.data.current_page));
            setPer_page(Number(res.data.per_page));
            setDataTotal(Number(res.data.total));
            setLoadingTable(false);
        }).catch(() => {
            setLoadingTable(false);
        });
    }

    useEffect(() => {
        initData()
    }, [page, per_page, forQueryParam])

    return (
        <Modal
            title="添加排序视频"
            visible={visible}
            width={1200}
            centered
            onCancel={handleCancel}
            okText="添加"
            cancelText="取消"
            onOk={onFinish}
            destroyOnClose>

            <Row gutter={[12, 20]}>
                <Col span={24}>
                    <AddModalQuerier
                        params={queryParam}
                        classifyArr={classifyArr}
                        typeArr={typeArr}
                        serialArr={serialArr}
                        onValueChange={onValueChange}
                        onQuery={onQuery}
                        onReset={onReset} />
                </Col>
                <Col span={24}>
                    {/* @ts-ignore */}
                    <BaseTable data={paramsData} onChange={onChange} loading={loadingTable} rowSelection={rowSelection} rowKey={(item) => `${item.id}`} style={{ maxHeight: 550, overflowY: 'auto' }} />
                </Col>
            </Row>
        </Modal>
    )
}
