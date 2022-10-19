import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Button, Row, Col, Card, message, Select } from 'antd'
import { getNovelSearchListApi, delNovelSearchApi, getNovelAllSiteApi } from '@/request'
import BaseTable from '@/components/base/BaseTable'
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm';
import { Moment } from 'moment/moment'
import { NovelSearchInfo, opIdToVal, resultOp, terminalOp, userTypeOp } from '@/type';

type SearchParamType = {
    keywords: string
    web_id: string
    guard_name: string
    result: string
    user_from: string
    date: Moment[] | null
}
export const NovelSearchList: React.FC = () => {
    const [webData, setWebData] = useState([]);
    const [searchParamsData, setSearchParamsData] = useState<SearchParamType>({
        keywords: '',
        web_id: '',
        guard_name: '',
        result: '',
        user_from: '',
        date: null
    })
    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'keywords',
                placeholder: '按网站名称/搜索内容关键字搜索',
                type: 'input',
                width: 250
            },
            {
                name: 'web_id',
                placeholder: '来源网站',
                type: 'select',
                selectOp: webData,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
                width: 100
            },
            {
                name: 'guard_name',
                placeholder: '来源渠道',
                type: 'select',
                selectOp: terminalOp,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.value} key={String(item.value)}>{item.label}</Select.Option>,
                width: 100
            },
            {
                name: 'result',
                placeholder: '搜索结果',
                type: 'select',
                selectOp: resultOp,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
                width: 100
            },
            {
                name: 'user_from',
                placeholder: '用户',
                type: 'select',
                selectOp: userTypeOp,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
                width: 100
            },
            {
                name: 'date',
                type: 'rangePicker'
            }
        ],
        [webData]
    );
    const onSearch = useCallback(
        (params) => {
            setPage(1)
            setSearchParamsData(params)
        },
        []
    );

    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState<NovelSearchInfo[]>()
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [dataTotal, setDataTotal] = useState<number>(0)
    const handleDel = (id: number) => {
        delNovelSearchApi(id).then((res: any) => {
            if (res.code == 200) {
                message.success(res.message)
                initData()
            } else {
                message.error(res.message)
            }
        }).catch((e) => {

        })
    }
    const onChange = (pageParams) => {
        setPage(pageParams.current)
        setPer_page(pageParams.pageSize)
    }
    const paramsData = {
        list: baseData,
        columns: [
            {
                title: '#',
                dataIndex: 'id',
                key: 'id',
                align: 'center',
                render: (text: any, record: any, index: number) => `${index + 1}`
            },
            {
                title: '搜索关键字',
                dataIndex: 'keyword',
                key: 'keyword',
                align: 'center'
            },
            {
                title: '搜索结果',
                dataIndex: 'result',
                key: 'result',
                render: (text: any, record: any) => opIdToVal(resultOp, Number(record.result)),
                align: 'center'
            },
            {
                title: '来源网站',
                dataIndex: 'web_id',
                key: 'web_id',
                render: (text: any, record: any) => opIdToVal(webData, Number(record.web_id)),
                align: 'center'
            },
            {
                title: '渠道',
                dataIndex: 'guard_name',
                key: 'guard_name',
                align: 'center'
            },
            {
                title: '用户',
                dataIndex: 'account',
                key: 'account',
                align: 'center'
            },
            {
                title: '搜索时间',
                dataIndex: 'created_at',
                key: 'created_at',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: (v: any, item: any) => (
                    <Button type="link" size="small" onClick={() => { handleDel(item.id) }}>删除</Button>
                ),
                align: 'center'
            }
        ],
        showPagination: true,
        page: { dataTotal, page, size: per_page }
    }

    const getWebList = () => {
        getNovelAllSiteApi().then((res: any) => {
            if (res.code == 200) {
                setWebData(res.data);
            } else {
                message.error(res.message)
            }
        }).catch((e) => {

        })
    }

    const initData = () => {
        setLoadingTable(true)
        let params = {
            page,
            per_page,
            keywords: searchParamsData.keywords,
            web_id: searchParamsData.web_id,
            guard: searchParamsData.guard_name,
            result: searchParamsData.result,
            user_from: searchParamsData.user_from,
            time_1: searchParamsData.date ? searchParamsData.date[0].format('YYYY-MM-DD') : '',
            time_2: searchParamsData.date ? searchParamsData.date[1].format('YYYY-MM-DD') : ''
        }
        getNovelSearchListApi(params).then((res: any) => {
            if (res.code == 200) {
                setBaseData(res.data.data)
                setPage(Number(res.data.current_page));
                setPer_page(Number(res.data.per_page));
                setDataTotal(Number(res.data.total));
                setLoadingTable(false)
            } else {
                message.error(res.message)
                setLoadingTable(false)
            }
        }).catch(() => {
            setLoadingTable(false)
        })
    }

    useEffect(() => {
        getWebList()
    }, [])

    useEffect(() => {
        initData()
    }, [page, per_page, searchParamsData])

    return (
        <Row gutter={[12, 30]}>
            <Col span={24}>
                <SearchForm
                    formList={formList}
                    onSearch={onSearch} />
            </Col>
            <Col span={24}>
                <Card>
                    <BaseTable data={paramsData} onChange={onChange} loading={loadingTable} />
                </Card>
            </Col>
        </Row>
    )
}
