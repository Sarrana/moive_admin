import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Row, Col, Switch, Card, message, Select } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { NovelUserInfo, opIdToVal, stateOp, terminalOp } from '@/type';
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm';
import BaseTable from '@/components/base/BaseTable';
import { getNovelAllSiteApi, getNovelUserListApi, getNovelUserStateApi } from '@/request';
import { momentToTime } from '@/utils';

export const NovelUserList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;

    const [queryParam, setQueryParam] = useState({ keywords: '', time_1: '', time_2: '', web_id: null, guard_name: '', status: null, vip: null });
    const [siteArr, setSiteArr] = useState([]);
    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'name',
                type: 'input',
                placeholder: "按用户账号/用户名搜索",
                width: 200
            },
            {
                name: 'date',
                type: 'rangePicker'
            },
            {
                name: 'website',
                placeholder: '注册网站',
                type: 'select',
                selectOp: siteArr,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
                width: 100
            },
            {
                name: 'terminal',
                placeholder: '注册终端',
                type: 'select',
                selectOp: terminalOp,
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
            },
            {
                name: 'member',
                type: 'checkbox',
                valuePropName: 'checked',
                checkbox: { text: '会员', value: '会员' }
            }
        ],
        [siteArr]
    )
    const onSearch = useCallback(
        (params) => {
            let data: any = {
                keywords: params.name,
                time_1: params.date ? momentToTime(params.date[0], 'YYYY-MM-DD') : '',
                time_2: params.date ? momentToTime(params.date[1], 'YYYY-MM-DD') : '',
                web_id: params.website,
                guard_name: params.terminal,
                status: params.status,
                vip: params.member ? 1 : 2
            }
            setCurrentPage(1);
            setQueryParam(data);
        },
        []
    )

    const testData = [
        { id: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: true },
        { id: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: true },
        { id: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { id: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { id: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { id: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { id: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { id: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { id: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { id: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { id: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { id: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { id: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { id: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false }
    ]
    const [dataSource, setDataSource] = useState<NovelUserInfo[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(state?.currentPage || 1);
    const [pageSize, setPageSize] = useState<number>(state?.pageSize || 10);
    const [loading, setLoading] = useState<boolean>(false);
    const onDetail = (id: number) => {
        navigate(`/Novel/UserMgr/UserList/Detail?id=${id}`, { state: { currentPage, pageSize }, replace: false });
    }
    const onStateChange = (id: number) => {
        getNovelUserStateApi(id).then((res: any) => {
            message.success('操作成功');
            getDataList();
        });
    }
    const onTableChange = (pageParams) => {
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
                title: '用户账号/邮箱号',
                dataIndex: 'account',
                key: 'account',
                align: 'center'
            },
            {
                title: '注册子网站',
                dataIndex: 'web_id',
                key: 'web_id',
                render: (text: any, item: any, index: number) => `${opIdToVal(siteArr, item.web_id)}`,
                align: 'center'
            },
            {
                title: '注册终端',
                dataIndex: 'guard_name',
                key: 'guard_name',
                align: 'center'
            },
            {
                title: '注册时间',
                dataIndex: 'created_at',
                key: 'created_at',
                align: 'center'
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text: any, item: any) => (<Switch onClick={() => { onStateChange(item.id) }} checked={`${item.status}` == '1'} />),
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: (text: any, item: any) => (<Button type="link" onClick={() => { onDetail(item.id) }}>详情</Button>),
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
        getNovelUserListApi({ page: currentPage, per_page: pageSize, ...queryParam }).then((res: any) => {
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
        getNovelAllSiteApi().then((res: any) => {
            setSiteArr(res.data);
        });
    }

    useEffect(() => {
        getDataList();
    }, [currentPage, pageSize, queryParam])

    useEffect(() => {
        getOpList();
    }, [])

    return (
        <Row gutter={[12, 30]}>
            <Col span={24}>
                <SearchForm formList={formList} onSearch={onSearch} />
            </Col>
            <Col span={24}>
                <Card>
                    <BaseTable data={paramsData} onChange={onTableChange} loading={loading} />
                </Card>
            </Col>
        </Row>
    )
}
