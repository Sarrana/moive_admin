import { Button, Row, Col, Switch, Space, Image, Card, message, Select } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { momentToTime, timeToMoment } from '@/utils';
import { CartoonInfo, cartoonSerialOp, stateOp } from '@/type';
import BaseTable from '@/components/base/BaseTable';
import { delCartoonApi, getCartoonListApi, getCartoonStateApi, getCartoonAllTypeApi } from '@/request';
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm';

export const CartoonContentList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // console.log("CartoonContentList", location);
    const state = location.state;
    const [typeArr, setTypeArr] = useState([]);
    const [queryParam, setQueryParam] = useState(state?.queryParam || { name: '', date: null, type_id: null, serialize: null, status: null });
    const [initQueryParam, setInitQueryParam] = useState(state?.queryParam || { name: '', date: null, type_id: null, serialize: null, status: null });

    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'name',
                type: 'input',
                placeholder: "按漫画名称搜索",
                width: 200
            },
            {
                name: 'date',
                type: 'rangePicker'
            },
            {
                name: 'type_id',
                placeholder: '类型',
                type: 'select',
                selectOp: typeArr,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
                width: 100
            },
            {
                name: 'serialize',
                placeholder: '连载',
                type: 'select',
                selectOp: cartoonSerialOp,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.value} key={String(item.value)}>{item.label}</Select.Option>,
                width: 100
            },
            {
                name: 'status',
                placeholder: '状态',
                type: 'select',
                selectOp: stateOp,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
                width: 100
            }
        ],
        [typeArr]
    )
    const onSearch = useCallback(
        (params) => {
            // console.log('onSearch', params);
            setCurrentPage(1);
            setQueryParam(params);
        },
        []
    )

    const testData = [
        {
            id: 1, cover: "", name: "子弹飞", classify: "封神", type: "封神", desc: "封神", count: "1", totle: "1",
            serial: "已完结", publish: "已发布", time: "2021-01-01 15:45", area: "中国", year: "2010", score: "10", playNum: 100000, state: 1
        }
    ]
    const [dataSource, setDataSource] = useState<CartoonInfo[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(state?.currentPage || 1);
    const [pageSize, setPageSize] = useState<number>(state?.pageSize || 10);
    const [loading, setLoading] = useState<boolean>(false);
    const onAdd = () => {
        navigate('/Cartoon/ContentMgr/Add', { state: { data: { id: null, status: 1 }, typeArr, currentPage, pageSize, queryParam }, replace: false });
    }
    const onEdit = (item: CartoonInfo) => {
        navigate('/Cartoon/ContentMgr/Edit', { state: { data: item, typeArr, currentPage, pageSize, queryParam }, replace: false });
    }
    const onManage = (item: CartoonInfo) => {
        navigate('/Cartoon/ContentMgr/Chapter', { state: { data: item, currentPage, pageSize, queryParam }, replace: false });
    }
    const onDelete = (id: number) => {
        delCartoonApi(id).then((res: any) => {
            message.success('删除成功');
            getDataList();
        });
    }
    const onStateChange = (id: number) => {
        getCartoonStateApi(id).then((res: any) => {
            message.success('操作成功');
            getDataList();
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
                title: '漫画封面',
                dataIndex: 'pic',
                key: 'pic',
                render: (text: any, item: any) => (<Image src={item.pic} width={80} />),
                align: 'center'
            },
            {
                title: '漫画名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                render: (text: any, item: any) => {
                    let str = '';
                    item.type && item.type.forEach((v, i) => {
                        str += i == 0 ? v.name : `,${v.name}`
                    });
                    return str;
                },
                align: 'center'
            },
            {
                title: '更新至',
                dataIndex: 'update_to',
                key: 'update_to',
                render: (text: any, item: any) => (`更新至${item.update_to}章`),
                align: 'center'
            },
            {
                title: '作者',
                dataIndex: 'author',
                key: 'author',
                align: 'center'
            },
            {
                title: '连载',
                dataIndex: 'serialize',
                key: 'serialize',
                align: 'center'
            },
            {
                title: '更新日期',
                dataIndex: 'updated_at',
                key: 'updated_at',
                align: 'center'
            },
            // {
            //     title: '评分',
            //     dataIndex: 'score',
            //     render: (text: any, item: any) => Number(item.score),
            //     key: 'score',
            //     align: 'center'
            // },
            {
                title: '阅读量',
                dataIndex: 'hits',
                key: 'hits',
                render: (text: any, item: any) => Number(item.hits),
                align: 'center'
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (v: any, item: any) => (<Switch onClick={() => { onStateChange(item.id) }} checked={`${item.status}` == '1'} />),
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: (v: any, item: any) => (
                    <Space direction="vertical" size={[4, 4]}>
                        <Space size={[4, 4]}>
                            <Button type="link" size="small" onClick={() => { onEdit(item) }}>编辑</Button>
                            <Button type="link" size="small" onClick={() => { onDelete(item.id) }}>删除</Button>
                        </Space>
                        <Space size={[4, 4]}>
                            <Button type="link" size="small" onClick={() => { onManage(item) }}>章节管理</Button>
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

    const getDataList = () => {
        setLoading(true);
        let params: any = { page: currentPage, per_page: pageSize };
        if (queryParam.name) params.name = queryParam.name;
        if (queryParam.date && queryParam.date[0]) params.time_1 = momentToTime(queryParam.date[0]);
        if (queryParam.date && queryParam.date[1]) params.time_2 = momentToTime(queryParam.date[1]);
        if (queryParam.type_id) params.type_id = queryParam.type_id;
        if (queryParam.serialize) params.serialize = queryParam.serialize;
        if (queryParam.status) params.status = queryParam.status;
        // console.log('getDataList', params);
        getCartoonListApi(params).then((res: any) => {
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
        getCartoonAllTypeApi().then((res: any) => {
            setTypeArr(res.data);
        });
    }

    useEffect(() => {
        // console.log("useEffect", currentPage, pageSize);
        getDataList();
    }, [currentPage, pageSize, queryParam])

    useEffect(() => {
        getOpList();
    }, [])

    return (
        <Row gutter={[12, 30]}>
            <Col span={24}>
                <SearchForm formList={formList} onSearch={onSearch} params={initQueryParam} />
            </Col>
            <Col span={24}>
                <Card>
                    <Space direction="vertical" size={[4, 20]} style={{ width: '100%' }}>
                        <Button type="primary" danger onClick={onAdd}>新增</Button>
                        <BaseTable data={paramsData} onChange={onTableChange} loading={loading} />
                    </Space>
                </Card>
            </Col>
        </Row>
    )
}
