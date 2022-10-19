import { Button, Row, Col, Switch, Space, Image, Card, message, Table } from 'antd';
import { useEffect, useState } from 'react';
import { VideoContentListQuerier } from './VideoContentListQuerier';
import { useLocation, useNavigate } from 'react-router-dom';
import { momentToTime } from '@/utils';
import { VideoInfo, videoPublishOp, videoSerialOp } from '@/type';
import { getVideoAllAreaApi, getVideoAllCategoryApi, getVideoStateApi, delVideoApi, getVideoListApi, getVideoDetailApi, getVideoAllYearApi, getVideoAllCTypeApi } from '@/request';
import BaseTable from '@/components/base/BaseTable';

export const VideoContentList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // console.log("VideoContentList", location);
    const state = location.state;
    const [classifyArr, setClassifyArr] = useState([]);
    const [typeArr, setTypeArr] = useState([]);
    const [cTypeArr, setCTypeArr] = useState([]);
    const [serialArr, setSerialArr] = useState(videoSerialOp);
    // const [publishArr, setPublishArr] = useState(videoPublishOp);
    const [areaArr, setAreaArr] = useState([]);
    const [yearArr, setYearArr] = useState([]);
    const [queryParam, setQueryParam] = useState(state?.queryParam || { name: '', date: ['', ''], classify: null, type: null, serial: null, publish: null, open: false, close: false });
    const onValueChange = (type: string, key: string, v: any, o?: any) => {
        // console.log('onValueChange  ', key, v, o);
        if (type == "input") {
            setQueryParam({ ...queryParam, [key]: v.target.value });
        } else if (type == "dateRange") {
            const d = v ? [momentToTime(v[0], 'YYYY-MM-DD'), momentToTime(v[1], 'YYYY-MM-DD')] : ['', ''];
            setQueryParam({ ...queryParam, [key]: d });
        } else if (type == "checkbox") {
            setQueryParam({ ...queryParam, [key]: v.target.checked });
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
        getDataList({ currentPage: 1, pageSize, ...queryParam });
    }
    const onReset = () => {
        setQueryParam({ name: '', date: ['', ''], classify: null, type: null, serial: null, publish: null, open: false, close: false });
        getDataList({ currentPage: 1, pageSize, name: '', date: ['', ''], classify: null, type: null, serial: null, publish: null, open: false, close: false });
        setTypeArr([]);
    }

    const testData = [
        {
            id: 1, cover: "", name: "子弹飞", classify: "封神", type: "封神", desc: "封神", count: "1", totle: "1",
            serial: "已完结", publish: "已发布", time: "2021-01-01 15:45", area: "中国", year: "2010", score: "10", playNum: 100000, state: 1
        }
    ]
    const [dataSource, setDataSource] = useState<VideoInfo[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(state?.currentPage || 1);
    const [pageSize, setPageSize] = useState<number>(state?.pageSize || 10);
    const [loading, setLoading] = useState<boolean>(false);
    const onAdd = () => {
        navigate('/Video/ContentMgr/Add', {
            state: { data: {}, classifyArr, cTypeArr, areaArr, serialArr, yearArr, currentPage, pageSize, queryParam },
            replace: false
        });
    }
    const onDetail = (id: number) => {
        navigate(`/Video/ContentMgr/Detail?id=${id}`, { state: { currentPage, pageSize, queryParam }, replace: false });
    }
    const onEdit = (item: any) => {
        getVideoDetailApi(item.id).then((res: any) => {
            navigate('/Video/ContentMgr/Edit', {
                state: { data: res.data, classifyArr, cTypeArr, areaArr, serialArr, yearArr, currentPage, pageSize, queryParam },
                replace: false
            });
        });
    }
    const onManage = (item: any) => {
        navigate('/Video/ContentMgr/Drama', { state: { data: item, currentPage, pageSize, queryParam }, replace: false });
    }
    const onDelete = (id: number) => {
        delVideoApi(id).then((res: any) => {
            message.success('删除成功');
            getDataList({ currentPage, pageSize, ...queryParam });
        });
    }
    const onStateChange = (id: number, state: string) => {
        getVideoStateApi({ id: id }).then((res: any) => {
            message.success('操作成功');
            getDataList({ currentPage, pageSize, ...queryParam });
        });
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
                title: '#',
                dataIndex: 'id',
                key: 'id',
                align: 'center'
            },
            {
                title: '视频封面',
                dataIndex: 'pic',
                key: 'pic',
                render: (text: any, item: any) => (<Image src={item.pic} width={80} />),
                align: 'center'
            },
            {
                title: '视频名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '视频分类',
                dataIndex: 'cid_text',
                key: 'cid_text',
                align: 'center'
            },
            {
                title: '视频类型',
                dataIndex: 'type',
                key: 'type',
                align: 'center'
            },
            {
                title: '视频简介',
                dataIndex: 'introduction',
                key: 'introduction',
                render: (text: any, item: any) => (item.introduction.length > 30 ? `${item.introduction.slice(0, 30)}...` : item.introduction),
                align: 'center'
            },
            {
                title: '上传剧集',
                dataIndex: 'video_episodes_count',
                key: 'video_episodes_count',
                render: (text: any, item: any) => Number(item.video_episodes_count),
                align: 'center'
            },
            {
                title: '视频总数',
                dataIndex: 'total',
                key: 'total',
                render: (text: any, item: any) => Number(item.total),
                align: 'center'
            },
            {
                title: '视频模式',
                dataIndex: 'video_mode_text',
                key: 'video_mode_text',
                align: 'center'
            },
            // {
            //     title: '发布状态',
            //     dataIndex: 'release',
            //     key: 'release',
            //     align: 'center'
            // },
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
                dataIndex: 'playamount',
                render: (text: any, item: any) => Number(item.playamount),
                key: 'playamount',
                align: 'center'
            },
            {
                title: '状态',
                dataIndex: 'state',
                key: 'state',
                render: (v: any, item: any) => (<Switch onClick={() => { onStateChange(item.id, item.state) }} checked={`${item.state}` === '1'} />),
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: (v: any, item: any) => (
                    <Space direction="vertical" size={[4, 4]}>
                        <Space size={[4, 4]}>
                            <Button type="link" size="small" onClick={() => { onDetail(item.id) }}>查看详情</Button>
                            <Button type="link" size="small" onClick={() => { onEdit(item) }}>编辑</Button>
                        </Space>
                        <Space size={[4, 4]}>
                            <Button type="link" size="small" onClick={() => { onManage(item) }}>剧集管理</Button>
                            <Button type="link" size="small" onClick={() => { onDelete(item.id) }}>删除</Button>
                        </Space>
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

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            render: (text: any, record: any, index: number) => `${index + 1}`,
            align: 'center'
        },
        {
            title: '视频封面',
            dataIndex: 'pic',
            key: 'pic',
            render: (text: any, item: any) => (<Image src={item.pic} width={80} />),
            align: 'center'
        },
        {
            title: '视频名称',
            dataIndex: 'name',
            key: 'name',
            align: 'center'
        },
        {
            title: '视频分类',
            dataIndex: 'cid_text',
            key: 'cid_text',
            align: 'center'
        },
        {
            title: '视频类型',
            dataIndex: 'type',
            key: 'type',
            align: 'center'
        },
        {
            title: '视频简介',
            dataIndex: 'introduction',
            key: 'introduction',
            render: (text: any, item: any) => (item.introduction.length > 30 ? `${item.introduction.slice(0, 30)}...` : item.introduction),
            align: 'center'
        },
        {
            title: '上传剧集',
            dataIndex: 'video_episodes_count',
            key: 'video_episodes_count',
            render: (text: any, item: any) => Number(item.video_episodes_count),
            align: 'center'
        },
        {
            title: '视频总数',
            dataIndex: 'total',
            key: 'total',
            render: (text: any, item: any) => Number(item.total),
            align: 'center'
        },
        {
            title: '视频模式',
            dataIndex: 'video_mode_text',
            key: 'video_mode_text',
            align: 'center'
        },
        // {
        //     title: '发布状态',
        //     dataIndex: 'release',
        //     key: 'release',
        //     align: 'center'
        // },
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
            dataIndex: 'playamount',
            render: (text: any, item: any) => Number(item.playamount),
            key: 'playamount',
            align: 'center'
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: (v: any, item: any) => (<Switch onClick={() => { onStateChange(item.id, item.state) }} checked={`${item.state}` === '1'} />),
            align: 'center'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (v: any, item: any) => (
                <Space direction="vertical" size={[4, 4]}>
                    <Space size={[4, 4]}>
                        <Button type="link" size="small" onClick={() => { onDetail(item.id) }}>查看详情</Button>
                        <Button type="link" size="small" onClick={() => { onEdit(item) }}>编辑</Button>
                    </Space>
                    <Space size={[4, 4]}>
                        <Button type="link" size="small" onClick={() => { onManage(item) }}>剧集管理</Button>
                        <Button type="link" size="small" onClick={() => { onDelete(item.id) }}>删除</Button>
                    </Space>
                </Space>
            ),
            align: 'center'
        }
    ]
    const onPageSizeChange = (current, size) => {
        setCurrentPage(current);
        setPageSize(size);
    }
    const onPageChange = (page, pageSize) => {
        setCurrentPage(page);
    }
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

    const getDataList = (query) => {
        setLoading(true);
        let params: any = { page: query.currentPage, per_page: query.pageSize };
        if (query.name) params.name = query.name;
        if (query.date[0]) params.time_1 = query.date[0];
        if (query.date[1]) params.time_2 = query.date[1];
        if (query.classify) params.cid = query.classify;
        if (query.serial) params.video_mode = query.serial;
        if (query.type) params.type = query.type;
        if (query.open && !query.close) params.state = 1;
        if (!query.open && query.close) params.state = 2;
        // console.log('getDataList', params);
        getVideoListApi(params).then((res: any) => {
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
        getVideoAllCategoryApi().then((res: any) => {
            setClassifyArr(res.data);
        });
        getVideoAllAreaApi().then((res: any) => {
            setAreaArr(res.data);
        });
        getVideoAllYearApi().then((res: any) => {
            setYearArr(res.data);
        });
        getVideoAllCTypeApi().then((res: any) => {
            setCTypeArr(res.data);
        });
    }

    useEffect(() => {
        // console.log("useEffect", currentPage, pageSize);
        getDataList({ currentPage, pageSize, ...queryParam });
    }, [currentPage, pageSize])

    useEffect(() => {
        getOpList();
    }, [])

    return (
        <Row gutter={[12, 30]}>
            <Col span={24}>
                <Card>
                    <VideoContentListQuerier
                        params={queryParam}
                        classifyArr={classifyArr}
                        typeArr={typeArr}
                        serialArr={serialArr}
                        // publishArr={publishArr}
                        onValueChange={onValueChange}
                        onQuery={onQuery}
                        onReset={onReset} />
                </Card>
            </Col>
            <Col span={24}>
                <Card>
                    <Space direction="vertical" size={[4, 20]} style={{ width: '100%' }}>
                        <Button type="primary" danger onClick={onAdd}>新增</Button>
                        {/* <BaseTable data={paramsData} onChange={onTableChange} loading={loading} /> */}
                        {/* @ts-ignore */}
                        <Table bordered columns={columns} dataSource={dataSource} pagination={paginationProps} loading={loading} rowKey={(record) => `${record.id}`} />
                    </Space>
                </Card>
            </Col>
        </Row>
    )
}
