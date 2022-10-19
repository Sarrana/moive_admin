import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Button, Row, Col, Card, message, Select } from 'antd'
import { getVideoSearchListApi_2, delVideoSearchApi_2, getVideoAllSiteApi_2 } from '@/request'
import BaseTable from '@/components/base/BaseTable'
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm';
import { Moment } from 'moment/moment'
import { resultOp, terminalOp, userTypeOp } from '@/type';

type BaseDataType = {
    created_at: string
    guard_name: string
    id: number
    keyword: string
    result: string
    result_text: string
    user_id: number
    user_name: string
    web_id: number
    web_name: string
}

type SearchParamType = {
    keywords: string
    web_id: string
    guard_name: string
    result: string
    user_from: string
    date: Moment[] | null
}
export const VideoSearchList: React.FC = () => {
    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState<BaseDataType[]>()
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [dataTotal, setDataTotal] = useState<number>(0)
    const [webData, setWebData] = useState<SelectOpType[] | null>(null)
    const [searchParamsData, setSearchParamsData] = useState<SearchParamType>({
        keywords: '',
        web_id: '',
        guard_name: '',
        result: '',
        user_from: '',
        date: null
    })
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
                dataIndex: 'result_text',
                key: 'result_text',
                align: 'center'
            },
            {
                title: '来源网站',
                dataIndex: 'web_name',
                key: 'web_name',
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
                dataIndex: 'user_name',
                key: 'user_name',
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
    const onChange = (pageParams) => {
        setPage(pageParams.current)
        setPer_page(pageParams.pageSize)
    }
    const handleDel = (id: number) => {
        delVideoSearchApi_2(id).then((res: any) => {
            if (res.code == 200) {
                message.success(res.message)
                initData()
            } else {
                message.error(res.message)
            }
        }).catch((e) => {
            // message.error(e)
        })
    }
    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'keywords',
                placeholder: '按网站名称/搜索内容关键字搜索',
                type: 'input',
                width: 200
            },
            {
                name: 'web_id',
                placeholder: '来源网站',
                type: 'select',
                selectOp: webData || [],
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
    const initData = () => {
        setLoadingTable(true)
        let params = {
            page,
            per_page,
            keywords: searchParamsData.keywords,
            web_id: searchParamsData.web_id,
            guard_name: searchParamsData.guard_name,
            result: searchParamsData.result,
            user_from: searchParamsData.user_from,
            time_1: searchParamsData.date ? searchParamsData.date[0].format('YYYY-MM-DD') : '',
            time_2: searchParamsData.date ? searchParamsData.date[1].format('YYYY-MM-DD') : ''
        }
        getVideoSearchListApi_2(params).then((res: any) => {
            if (res.code == 200) {
                setBaseData(res.data.data)
                setDataTotal(res.data.total)
                setLoadingTable(false)
            } else {
                message.error(res.message)
                setLoadingTable(false)
            }
        }).catch(() => {
            setLoadingTable(false)
        })
    }
    const getWebList = () => {
        getVideoAllSiteApi_2().then((res: any) => {
            if (res.code == 200) {
                setWebData(res.data)
            } else {
                message.error(res.message)
            }
        }).catch((e) => {
            // message.error(e)
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
