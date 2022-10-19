import { Row, Col, Card, Select } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { momentToTime } from '@/utils';
import { CartoonUserIp, ipOp, terminalOp } from '@/type';
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm';
import BaseTable from '@/components/base/BaseTable';
import { getCartoonAllSiteApi, getCartoonUserIpListApi } from '@/request';

export const CartoonIPList = () => {
    const [queryParam, setQueryParam] = useState({ keywords: '', time_1: '', time_2: '', web_id: null, from_guard: null });
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
                from_guard: params.terminal
            }
            setCurrentPage(1);
            setQueryParam(data);
        },
        []
    )

    const testData = [
        { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 1 },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 1 },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 1 },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 }
        // { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 },
        // { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 },
        // { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 },
        // { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 },
        // { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 },
        // { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 }
    ]
    const [dataSource, setDataSource] = useState<CartoonUserIp[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [loading, setLoading] = useState<boolean>(false);
    const onIPStatusChange = (userId: number, status: number) => {

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
                title: '访问网站',
                dataIndex: 'web_name',
                key: 'web_name',
                align: 'center'
            },
            {
                title: '访问终端',
                dataIndex: 'guard_name',
                key: 'guard_name',
                align: 'center'
            },
            {
                title: 'IP地址',
                dataIndex: 'ip',
                key: 'ip',
                align: 'center'
            },
            {
                title: '访问时间',
                dataIndex: 'created_at',
                key: 'created_at',
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
        getCartoonUserIpListApi({ page: currentPage, per_page: pageSize, ...queryParam }).then((res: any) => {
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
        getCartoonAllSiteApi().then((res: any) => {
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
