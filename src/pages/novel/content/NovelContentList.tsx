import { Button, Row, Col, Switch, Space, Image, Card, message } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { momentToTime } from '@/utils';
import { NovelInfo } from '@/type';
import BaseTable from '@/components/base/BaseTable';
import { delNovelApi, getNovelAllCategoryApi, getNovelListApi, getNovelStateApi } from '@/request';
import { NovelContentListQuerier } from './NovelContentListQuerier';

export const NovelContentList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    const [classifyArr1, setClassifyArr1] = useState([]);
    const [classifyArr2, setClassifyArr2] = useState([]);
    const [classifyArr, setClassifyArr] = useState([]);
    const [queryParam, setQueryParam] = useState(state?.queryParam || { name: '', date: ['', ''], channel: null, classify: null, serial: null, status: null });
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
            if (key == "channel") {
                setQueryParam({ ...queryParam, [key]: v, classify: null });
                if (v) {
                    v == 1 ? setClassifyArr(classifyArr1) : setClassifyArr(classifyArr2);
                } else {
                    setClassifyArr([]);
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
        setQueryParam({ name: '', date: ['', ''], channel: null, classify: null, serial: null, status: null });
        getDataList({ currentPage: 1, pageSize, name: '', date: ['', ''], channel: null, classify: null, serial: null, status: null });
        setClassifyArr([]);
    }

    const testData = [
        {
            id: 1, cover: "", name: "?????????", classify: "??????", type: "??????", desc: "??????", count: "1", totle: "1",
            serial: "?????????", publish: "?????????", time: "2021-01-01 15:45", area: "??????", year: "2010", score: "10", playNum: 100000, state: 1
        }
    ]
    const [dataSource, setDataSource] = useState<NovelInfo[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(state?.currentPage || 1);
    const [pageSize, setPageSize] = useState<number>(state?.pageSize || 10);
    const [loading, setLoading] = useState<boolean>(false);
    const onAdd = () => {
        navigate('/Novel/ContentMgr/Add', { state: { data: { id: null, status: 1 }, classifyArr1, classifyArr2, currentPage, pageSize, queryParam }, replace: false });
    }
    const onEdit = (item: NovelInfo) => {
        navigate('/Novel/ContentMgr/Edit', { state: { data: item, classifyArr1, classifyArr2, currentPage, pageSize, queryParam }, replace: false });
    }
    const onManage = (item: NovelInfo) => {
        navigate('/Novel/ContentMgr/Chapter', { state: { data: item, currentPage, pageSize, queryParam }, replace: false });
    }
    const onDelete = (id: number) => {
        delNovelApi(id).then((res: any) => {
            message.success('????????????');
            getDataList({ currentPage, pageSize, ...queryParam });
        });
    }
    const onStateChange = (id: number) => {
        getNovelStateApi(id).then((res: any) => {
            message.success('????????????');
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
                render: (text: any, item: any, index: number) => `${index + 1}`,
                align: 'center'
            },
            {
                title: '????????????',
                dataIndex: 'pic',
                key: 'pic',
                render: (text: any, item: any) => (<Image src={item.pic} width={80} />),
                align: 'center'
            },
            {
                title: '????????????',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '??????',
                dataIndex: 'channel_text',
                key: 'channel_text',
                align: 'center'
            },
            {
                title: '??????',
                dataIndex: 'class_name',
                key: 'class_name',
                align: 'center'
            },
            {
                title: '?????????',
                dataIndex: 'chapter_count',
                key: 'chapter_count',
                render: (text: any, item: any) => (`?????????${item.chapter_count}???`),
                align: 'center'
            },
            {
                title: '?????????',
                dataIndex: 'text_num',
                key: 'text_num',
                align: 'center'
            },
            {
                title: '??????',
                dataIndex: 'author',
                key: 'author',
                align: 'center'
            },
            {
                title: '??????',
                dataIndex: 'serialize',
                key: 'serialize',
                align: 'center'
            },
            {
                title: '????????????',
                dataIndex: 'created_at',
                key: 'created_at',
                align: 'center'
            },
            {
                title: '??????',
                dataIndex: 'score',
                render: (text: any, item: any) => Number(item.score),
                key: 'score',
                align: 'center'
            },
            {
                title: '?????????',
                dataIndex: 'hits',
                key: 'hits',
                render: (text: any, item: any) => Number(item.hits),
                align: 'center'
            },
            {
                title: '??????',
                dataIndex: 'status',
                key: 'status',
                render: (v: any, item: any) => (<Switch onClick={() => { onStateChange(item.id) }} checked={`${item.status}` == '1'} />),
                align: 'center'
            },
            {
                title: '??????',
                dataIndex: 'operation',
                key: 'operation',
                render: (v: any, item: any) => (
                    <Space direction="vertical" size={[4, 4]}>
                        <Space size={[4, 4]}>
                            <Button type="link" size="small" onClick={() => { onEdit(item) }}>??????</Button>
                            <Button type="link" size="small" onClick={() => { onDelete(item.id) }}>??????</Button>
                        </Space>
                        <Space size={[4, 4]}>
                            <Button type="link" size="small" onClick={() => { onManage(item) }}>????????????</Button>
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

    const getDataList = (query) => {
        // console.log('getDataList ', data);
        setLoading(true);
        let params: any = { page: query.currentPage, per_page: query.pageSize };
        if (query.name) params.keywords = query.name;
        if (query.date[0]) params.time_1 = query.date[0];
        if (query.date[1]) params.time_2 = query.date[1];
        if (query.channel) params.channel_id = query.channel;
        if (query.classify) params.cid = query.classify;
        if (query.serial) params.serialize = query.serial;
        if (query.status) params.status = query.status;
        // console.log('getDataList', params);
        getNovelListApi(params).then((res: any) => {
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
        getNovelAllCategoryApi(1).then((res: any) => {
            setClassifyArr1(res.data);
        });
        getNovelAllCategoryApi(2).then((res: any) => {
            setClassifyArr2(res.data);
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
                    <NovelContentListQuerier
                        params={queryParam}
                        classifyArr={classifyArr}
                        onValueChange={onValueChange}
                        onQuery={onQuery}
                        onReset={onReset} />
                </Card>
            </Col>
            <Col span={24}>
                <Card>
                    <Space direction="vertical" size={[4, 20]} style={{ width: '100%' }}>
                        <Button type="primary" danger onClick={onAdd}>??????</Button>
                        <BaseTable data={paramsData} onChange={onTableChange} loading={loading} />
                    </Space>
                </Card>
            </Col>
        </Row>
    )
}
