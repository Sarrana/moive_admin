import { Button, Row, Col, Switch, Table, Space, Image, Card, Typography, message, Select } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { VideoContentDramaModal } from './VideoContentDramaModal';
import { event, formatDuration, momentToTime } from '@/utils';
import { DramaInfo, videoCostTypeOp, videoDefinitionOp, VideoInfo, videoPublishOp } from '@/type';
import { delDramaApi, getDramaListApi, getDramaStateApi, postDramaBatchApi } from '@/request';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm';

const { Title } = Typography;

export const VideoContentDrama = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params: VideoInfo = location.state.data;
    const lastPageSize = location.state.pageSize;
    const lastCurrentPage = location.state.currentPage;
    const lastQueryParam = location.state.queryParam;
    const [queryParam, setQueryParam] = useState({ time_1: '', time_2: '', release_status: null, is_free: null, status: null });
    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'date',
                type: 'rangePicker'
            },
            {
                name: 'publish',
                placeholder: '发布状态',
                type: 'select',
                selectOp: videoPublishOp,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
                width: 100
            },
            {
                name: 'costType',
                placeholder: '付费模式',
                type: 'select',
                selectOp: videoCostTypeOp,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
                width: 100
            },
            {
                name: 'open',
                type: 'checkbox',
                valuePropName: 'checked',
                checkbox: { text: '状态开', value: '状态开' }
            },
            {
                name: 'close',
                type: 'checkbox',
                valuePropName: 'checked',
                checkbox: { text: '状态关', value: '状态关' }
            }
        ],
        []
    )
    const onSearch = useCallback(
        (params) => {
            let data: any = {
                time_1: params.date ? momentToTime(params.date[0], 'YYYY-MM-DD') : '',
                time_2: params.date ? momentToTime(params.date[1], 'YYYY-MM-DD') : '',
                release_status: params.publish,
                is_free: params.costType
            }
            if (params.open && !params.close) data.status = 1;
            if (!params.open && params.close) data.status = 2;
            setCurrentPage(1);
            setQueryParam(data);
        },
        []
    )

    const onBack = () => {
        navigate('/Video/ContentMgr', { state: { currentPage: lastCurrentPage, pageSize: lastPageSize, queryParam: lastQueryParam }, replace: false });
    }

    const [modalShow, setModalShow] = useState<boolean>(false);
    const [selectData, setSelectData] = useState({});
    const onOk = () => {
        setModalShow(false);
        getDataList();
    }
    const onCancel = () => {
        setModalShow(false);
    }

    const testData = [
        {
            id: 1, ep: 1, video: "", length: "120", definition: "UHD", costType: "封神", costNum: "100", publish: "发布", time: "2021-01-01 15:88",
            playNum: 100000, ptime: "2021-01-01 15:88", end: true, uper: "年代", createTime: "2021-01-01 15:88", status: 1
        },
        {
            id: 2, ep: 2, video: "", length: "120", definition: "UHD", costType: "封神", costNum: "100", publish: "发布", time: "2021-01-01 15:88",
            playNum: 100000, ptime: "2021-01-01 15:88", end: false, uper: "年代", createTime: "2021-01-01 15:88", status: 2
        }
    ]
    const [dataSource, setDataSource] = useState<DramaInfo[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [loading, setLoading] = useState<boolean>(false);
    const onAdd = () => {
        setSelectData({});
        setModalShow(true);
    }
    const onBatch = () => {
        postDramaBatchApi({ ids: selectedRowKeys }).then((res: any) => {
            message.success('发布成功');
            setSelectedRowKeys([]);
            getDataList();
        });
    }
    const onEdit = (item: any) => {
        setSelectData({ ...item });
        setModalShow(true);
    }
    const onDelete = (id: number) => {
        delDramaApi(id).then((res: any) => {
            message.success('删除成功');
            getDataList();
        });
    }
    const onStatusChange = (id: number, status: number) => {
        getDramaStateApi({ id: id }).then((res: any) => {
            message.success('操作成功');
            getDataList();
        });
    }
    const onPageSizeChange = (current, size) => {
        setCurrentPage(current);
        setPageSize(size);
    }
    const onPageChange = (page, pageSize) => {
        setCurrentPage(page);
    }
    const rowSelection = {
        type: 'checkbox',
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            console.log('selectedRowKeys', selectedRowKeys);
            setSelectedRowKeys(selectedRowKeys);
        },
        getCheckboxProps: (item: any) => ({
            disabled: item.release_status == 1,
            name: item.id
        })
    };
    const columns = [
        {
            title: '剧集',
            dataIndex: 'episode',
            key: 'episode',
            align: 'center'
        },
        {
            title: '视频',
            dataIndex: 'video',
            key: 'video',
            align: 'center'
        },
        {
            title: '视频时长',
            dataIndex: 'duration',
            key: 'duration',
            render: (text: any, item: any) => formatDuration(Number(item.duration)),
            // render: (text: any, item: any) => Number(item.duration) ? Number(item.duration) + '分钟' : '',
            align: 'center'
        },
        {
            title: '分辨率',
            dataIndex: 'resolution',
            key: 'resolution',
            // render: (text: any, item: any) => getDefinitionOpVal(item.resolution),
            align: 'center'
        },
        {
            title: '付费模式',
            dataIndex: 'is_free_text',
            key: 'is_free_text',
            align: 'center'
        },
        {
            title: '付费金额（￥）',
            dataIndex: 'amount',
            key: 'amount',
            align: 'center'
        },
        {
            title: '发布状态',
            dataIndex: 'release_status_text',
            key: 'release_status_text',
            align: 'center'
        },
        {
            title: '定时发布时间',
            dataIndex: 'timingtime',
            key: 'timingtime',
            align: 'center'
        },
        {
            title: '播放量',
            dataIndex: 'playamount',
            render: (text: any, item: any) => Number(item.playamount),
            key: 'playamount',
            align: 'center'
        },
        {
            title: '发布时间',
            dataIndex: 'release_at',
            key: 'release_at',
            align: 'center'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (v: any, item: any) => (<Switch onClick={() => { onStatusChange(item.id, item.status) }} checked={`${item.status}` === '1'} />),
            align: 'center'
        },
        {
            title: '上传人员',
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
            render: (text: any, item: any) => (
                <Space size={[4, 4]}>
                    <Button type="link" size="small" onClick={() => { onEdit(item) }}>编辑</Button>
                    <Button type="link" size="small" onClick={() => { onDelete(item.id) }}>删除</Button>
                </Space>
            ),
            align: 'center'
        }
    ]
    const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: pageSize,
        current: currentPage,
        total: total,
        showTotal: () => `共${total}条`,
        onShowSizeChange: (current, size) => onPageSizeChange(current, size),
        onChange: (page, pageSize) => onPageChange(page, pageSize)
    }
    const getDataList = () => {
        setLoading(true);
        getDramaListApi({ vid: params.id, page: currentPage, per_page: pageSize, ...queryParam }).then((res: any) => {
            setDataSource(res.data.list.data);
            setCurrentPage(Number(res.data.list.current_page));
            setPageSize(Number(res.data.list.per_page));
            setTotal(Number(res.data.list.total));
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        console.log("useEffect", currentPage, pageSize);
        getDataList();
    }, [currentPage, pageSize, queryParam])

    useEffect(() => {
        event.addListener("refreshDramaList", getDataList);
        return () => {
            event.removeListener("refreshDramaList", getDataList);
        }
    }, [])

    return (
        <>
            <Row gutter={[12, 30]}>
                <Col span={24}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Title level={5}>{`${params.name}    剧集管理`}</Title>
                        <SearchForm formList={formList} onSearch={onSearch} />
                    </Space>
                </Col>
                <Col span={24}>
                    <Card>
                        <Space direction="vertical" size={[4, 30]} style={{ width: '100%' }}>
                            <Space size={[20, 4]}>
                                <Button type="primary" danger onClick={onAdd}>新增</Button>
                                <Button type="primary" disabled={selectedRowKeys.length == 0} onClick={onBatch}>批量发布</Button>
                                <Button type="primary" onClick={onBack}>返回</Button>
                            </Space>
                            {/* @ts-ignore */}
                            <Table bordered columns={columns} dataSource={dataSource} pagination={paginationProps} rowSelection={rowSelection} loading={loading} rowKey={(record) => `${record.id}`} />
                        </Space>
                    </Card>
                </Col>
            </Row>
            {modalShow && (
                <VideoContentDramaModal
                    show={modalShow}
                    id={params.id}
                    category={params.folder}
                    params={selectData}
                    definitionArr={videoDefinitionOp}
                    onOk={onOk}
                    onCancel={onCancel} />
            )}
        </>
    )
}
