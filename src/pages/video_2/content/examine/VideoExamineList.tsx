import { Button, Row, Col, Space, Card, message, Table, Modal, Select } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { momentToTime } from '@/utils';
import { VideoInfo } from '@/type';
import { getVideoExamineListApi_2, getVideoBatchExamine_2, getVideoExamine_2, delVideoExamineApi_2, getVideoAllCategoryApi_2 } from '@/request';
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm';
import { ExamineModal } from './VideoExamineModal';

const { confirm } = Modal;

export const VideoExamineList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // console.log("VideoContentList", location);
    const state = location.state;
    const [classifyArr, setClassifyArr] = useState([]);
    const [queryParam, setQueryParam] = useState(state?.queryParam || { keywords: '', time_1: '', time_2: '', classify: null });
    const [initQueryParam, setInitQueryParam] = useState(state?.queryParam || { keywords: '', time_1: '', time_2: '', classify: null });
    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'keywords',
                placeholder: '按视频名称搜索',
                type: 'input',
                width: 200
            },
            {
                name: 'date',
                type: 'rangePicker'
            },
            {
                name: 'classify',
                placeholder: '视频分类',
                type: 'select',
                selectOp: classifyArr,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
                width: 100
            }
        ],
        [classifyArr]
    )
    const onSearch = useCallback(
        (params) => {
            const data: any = {
                keywords: params.keywords,
                cid: params.classify,
                time_1: params.date ? momentToTime(params.date[0], 'YYYY-MM-DD') : '',
                time_2: params.date ? momentToTime(params.date[1], 'YYYY-MM-DD') : ''
            }
            setCurrentPage(1);
            setQueryParam(data);
        },
        []
    )

    const [modalData, setModalData] = useState(null)
    const onHideModal = (v) => {
        setModalData(null)
        v && getDataList();
    }

    const [dataSource, setDataSource] = useState<VideoInfo[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(state?.currentPage || 1);
    const [pageSize, setPageSize] = useState<number>(state?.pageSize || 10);
    const [loading, setLoading] = useState<boolean>(false);
    const onConfirm = (callback) => {
        confirm({
            title: '是否确认审核通过？',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            centered: true,
            onOk() {
                callback()
            },
            onCancel() {

            }
        });
    }
    const onBatchExamine = () => {
        onConfirm(() => {
            getVideoBatchExamine_2({ ids: selectedRowKeys.join(',') }).then((res: any) => {
                message.success('审核成功');
                setSelectedRowKeys([]);
                getDataList();
            });
        })
    }
    const onExamine = (item: any) => {
        onConfirm(() => {
            getVideoExamine_2(item.id).then((res: any) => {
                message.success('审核成功');
                getDataList();
            });
        })
    }
    const onDelete = (id: number) => {
        delVideoExamineApi_2(id).then((res: any) => {
            message.success('删除成功');
            getDataList();
        });
    }
    const onPreview = (item: any) => {
        // navigate(`/Preview/${item.id}`);
        // navigate(`/Preview`);
        // navigate(`/Video2/ContentMgr/Preview?id=${item.id}`, { state: { currentPage, pageSize, queryParam }, replace: false });
        setModalData(item)
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
            title: '分类',
            dataIndex: 'cid_text',
            key: 'cid_text',
            align: 'center'
        },
        {
            title: '更新状况',
            dataIndex: 'update_episode',
            key: 'update_episode',
            align: 'center'
        },
        // {
        //     // title: '链接（可点击跳转）',
        //     title: '预览',
        //     dataIndex: 'url',
        //     key: 'url',
        //     // render: (v: any, item: any) => (<a href={item.url} target="_blank" rel="noreferrer">{item.url}</a>),
        //     render: (v: any, item: any) => (
        //         <Button type="link" size="small" onClick={() => { onPreview(item) }}>预览</Button>
        //     ),
        //     align: 'center'
        // },
        {
            title: '加密完成时间',
            dataIndex: 'encryption_time',
            key: 'encryption_time',
            align: 'center'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (v: any, item: any) => (
                // <Space size={[4, 4]}>
                //     <Button type="link" size="small" onClick={() => { onExamine(item) }}>审核通过</Button>
                //     <Button type="link" size="small" onClick={() => { onDelete(item.id) }}>删除</Button>
                // </Space>
                <Button type="link" size="small" onClick={() => { onPreview(item) }}>预览</Button>
            ),
            align: 'center'
        }
    ]
    const onPageSizeChange = (current, size) => {
        setCurrentPage(current);
        setPageSize(size);
    }
    const onPageChange = (page, _pageSize) => {
        setCurrentPage(page);
    }
    const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize,
        current: currentPage,
        total,
        showTotal: () => `共${total}条`,
        onShowSizeChange: (current, size) => onPageSizeChange(current, size),
        onChange: (page, _pageSize) => onPageChange(page, _pageSize)
    }

    const getDataList = () => {
        setLoading(true);
        getVideoExamineListApi_2({ page: currentPage, per_page: pageSize, ...queryParam }).then((res: any) => {
            setDataSource(res.data.data);
            setCurrentPage(Number(res.data.current_page));
            setPageSize(Number(res.data.per_page));
            setTotal(Number(res.data.total));
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }

    const getOpList = () => {
        getVideoAllCategoryApi_2().then((res: any) => {
            setClassifyArr(res.data);
        })
    }

    useEffect(() => {
        getDataList();
    }, [currentPage, pageSize, queryParam])

    useEffect(() => {
        getOpList();
    }, [])

    return (
        <>
            <Row gutter={[12, 30]}>
                <Col span={24}>
                    <SearchForm formList={formList} onSearch={onSearch} params={initQueryParam} />
                </Col>
                <Col span={24}>
                    <Card>
                        <Space direction="vertical" size={[4, 20]} style={{ width: '100%' }}>
                            {/* <Button type="primary" danger disabled={selectedRowKeys.length == 0} onClick={onBatchExamine}>批量通过</Button> */}
                            {/* <Table
                                bordered
                                // @ts-ignore
                                columns={columns}
                                dataSource={dataSource}
                                pagination={paginationProps}
                                loading={loading}
                                // @ts-ignore
                                rowSelection={rowSelection}
                                rowKey={(record) => `${record.id}`} /> */}
                            <Table
                                bordered
                                // @ts-ignore
                                columns={columns}
                                dataSource={dataSource}
                                pagination={paginationProps}
                                loading={loading}
                                rowKey={(record) => `${record.id}`} />
                        </Space>
                    </Card>
                </Col>
            </Row>
            {modalData && <ExamineModal params={modalData} onHide={onHideModal} />}
        </>
    )
}
