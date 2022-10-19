import { Button, Row, Col, Space, Card, Typography, message, Select } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NovelContentChapterModal } from './NovelContentChapterModal';
import { momentToTime } from '@/utils';
import { NovelChapterInfo, novelCostTypeOp, NovelInfo, novelPublishOp } from '@/type';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm';
import BaseTable from '@/components/base/BaseTable';
import { delChapterApi, getChapterContentApi, getChapterListApi, postChapterBatchApi } from '@/request';

const { Title } = Typography;

export const NovelContentChapter = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params: NovelInfo = location.state.data;
    const lastPageSize = location.state.pageSize;
    const lastCurrentPage = location.state.currentPage;
    const lastQueryParam = location.state.queryParam;

    const [queryParam, setQueryParam] = useState({ time_1: '', time_2: '', release_status: null, vip: null, status: null });
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
                selectOp: novelPublishOp,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
                width: 100
            },
            {
                name: 'costType',
                placeholder: '付费模式',
                type: 'select',
                selectOp: novelCostTypeOp,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
                width: 100
            }
            // {
            //     name: 'status',
            //     placeholder: '状态',
            //     type: 'select',
            //     selectOp: stateOp,
            //     selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
            //     width: 100
            // }
        ],
        []
    )
    const onSearch = useCallback(
        (params) => {
            let data: any = {
                time_1: params.date ? momentToTime(params.date[0], 'YYYY-MM-DD') : '',
                time_2: params.date ? momentToTime(params.date[1], 'YYYY-MM-DD') : '',
                release_status: params.publish,
                vip: params.costType,
                status: params.status
            }
            setCurrentPage(1);
            setQueryParam(data);
        },
        []
    )

    const onBack = () => {
        navigate('/Novel/ContentMgr', { state: { currentPage: lastCurrentPage, pageSize: lastPageSize, queryParam: lastQueryParam }, replace: false });
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
    const [dataSource, setDataSource] = useState<NovelChapterInfo[]>([]);
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
        postChapterBatchApi(params.id, { ids: selectedRowKeys.join(',') }).then((res: any) => {
            message.success('发布成功');
            setSelectedRowKeys([]);
            getDataList();
        });
    }
    const onEdit = (item: any) => {
        getChapterContentApi({ novel_id: params.id, chapter_id: item.id }).then((res: any) => {
            setSelectData({ content: res.data.content, ...item });
            setModalShow(true);
        });
    }
    const onDelete = (id: number) => {
        delChapterApi(params.id, { id }).then((res: any) => {
            message.success('删除成功');
            getDataList();
        });
    }
    const onStatusChange = (id: number, status: number) => {
        // getChapterStateApi({ id: id }).then((res: any) => {
        //     message.success('操作成功');
        //     getDataList();
        // });
    }
    const onTableChange = (pageParams) => {
        // console.log("onTableChange", pageParams);
        setCurrentPage(pageParams.current)
        setPageSize(pageParams.pageSize)
    }
    const paramsData = {
        list: dataSource,
        columns: [
            {
                title: '章节',
                dataIndex: 'xid',
                key: 'xid',
                align: 'center'
            },
            {
                title: '章节名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '付费模式',
                dataIndex: 'vip_text',
                key: 'vip_text',
                align: 'center'
            },
            {
                title: '发布状态',
                dataIndex: 'release_text',
                key: 'release_text',
                align: 'center'
            },
            {
                title: '定时发布时间',
                dataIndex: 'timingtime',
                key: 'timingtime',
                align: 'center'
            },
            {
                title: '阅读量',
                dataIndex: 'reading',
                key: 'reading',
                render: (text: any, item: any) => Number(item.reading),
                align: 'center'
            },
            {
                title: '发布时间',
                dataIndex: 'release_at',
                key: 'release_at',
                align: 'center'
            },
            // {
            //     title: '状态',
            //     dataIndex: 'status',
            //     key: 'status',
            //     render: (v: any, item: any) => (<Switch onClick={() => { onStatusChange(item.id, item.status) }} checked={item.status + '' === '1'} />),
            //     align: 'center'
            // },
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
        ],
        showPagination: true,
        page: {
            dataTotal: total,
            size: pageSize,
            page: currentPage
        }
    }
    const rowSelection = {
        type: 'checkbox',
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            console.log('selectedRowKeys', selectedRowKeys);
            setSelectedRowKeys(selectedRowKeys);
        },
        getCheckboxProps: (item: any) => ({
            disabled: item.yid == 1,
            name: item.id
        })
    };
    const getDataList = () => {
        setLoading(true);
        getChapterListApi(params.id, { page: currentPage, per_page: pageSize, ...queryParam }).then((res: any) => {
            setDataSource(res.data.data);
            setCurrentPage(Number(res.data.current_page));
            setPageSize(Number(res.data.per_page));
            setTotal(Number(res.data.total));
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        // console.log("useEffect", currentPage, pageSize);
        getDataList();
    }, [currentPage, pageSize, queryParam])

    return (
        <>
            <Row gutter={[12, 30]}>
                <Col span={24}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Title level={5}>{`${params.name}    章节管理`}</Title>
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
                            <BaseTable data={paramsData} onChange={onTableChange} loading={loading} rowSelection={rowSelection} />
                        </Space>
                    </Card>
                </Col>
            </Row>
            {modalShow && (
                <NovelContentChapterModal
                    show={modalShow}
                    id={params.id}
                    params={selectData}
                    onOk={onOk}
                    onCancel={onCancel} />
            )}
        </>
    )
}
