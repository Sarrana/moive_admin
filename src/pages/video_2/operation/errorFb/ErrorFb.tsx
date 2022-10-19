import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
    Button, Space, Row, Col, message, Card, Select
} from 'antd'
import { getVideoFeedBackListApi_2, getVideoFeedBackWebListApi_2, getVideoFeedBackDelApi_2, getVideoFeedBackHandApi_2, getVideoFeedBackTerListApi_2 } from '@/request'
import BaseTable from '@/components/base/BaseTable'
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm'
import { Moment } from 'moment/moment'
import { terminalOp, _OptionType } from '@/type'

type BaseDataType = {
    id: number
    video_name: string
    guard_name: string
    content: string
    status: { value: number, text: string }
    web_name: string
    account: string
}

type SearchParamType = {
    keywords: string
    date: Moment[] | null
    web_id: number
    terminal: string
    type: string
}

export const ErrorFb: React.FC = () => {
    const [webData, setWebData] = useState<_OptionType[] | null>(null)
    const [terData, setTerData] = useState<_OptionType[] | null>(null)
    const [searchParamsData, setSearchParamsData] = useState<SearchParamType>({
        keywords: '',
        web_id: null,
        type: '',
        terminal: null,
        date: null
    })
    const formList = useMemo<SearchFormItem[]>(
        () => [
            // {
            //     name: 'keywords',
            //     placeholder: '按用户手机号/用户昵称搜索',
            //     type: 'input',
            //     width: 200
            // },
            {
                name: 'date',
                type: 'rangePicker'
            },
            {
                name: 'web_id',
                placeholder: '网站',
                type: 'select',
                selectOp: webData || [],
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.id)}>{item.label}</Select.Option>,
                width: 100
            },
            {
                name: 'terminal',
                placeholder: '终端',
                type: 'select',
                selectOp: terData || [],
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.value} key={String(item.id)}>{item.label}</Select.Option>,
                width: 100
            },
            {
                name: 'type',
                placeholder: '问题类型',
                type: 'select',
                selectOp: [
                    { id: 1, label: '视频无法播放', value: '视频无法播放' },
                    { id: 2, label: '视频加载过慢', value: '视频加载过慢' },
                    { id: 3, label: '视频内容出错', value: '视频内容出错' }
                ],
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.value} key={String(item.id)}>{item.label}</Select.Option>,
                width: 200
            }
        ],
        [webData, terData]
    )
    const onSearch = useCallback(
        (params) => {
            // console.log('onSearch', params)
            setPage(1)
            setSearchParamsData(params)
        },
        []
    )

    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState<BaseDataType[]>([])
    const [dataTotal, setDataTotal] = useState<number>(0)
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)

    const handleSend = (id: number) => {
        getVideoFeedBackHandApi_2({ id: id }).then((res: any) => {
            message.success('操作成功')
            initData()
        })
    }
    const handleDel = (id: number) => {
        getVideoFeedBackDelApi_2({ id: id }).then((res: any) => {
            message.success('操作成功')
            initData()
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
                dataIndex: 'index',
                key: 'index',
                render: (text: any, record: any, index: number) => `${index + 1}`,
                align: 'center',
                width: '80px'
            },
            {
                title: '网站',
                dataIndex: 'web_name',
                key: 'web_name',
                align: 'center'
            },
            {
                title: '提交用户账号',
                dataIndex: 'content',
                key: 'content',
                align: 'center'
            },
            {
                title: '观看视频名',
                dataIndex: 'video_name',
                key: 'video_name',
                align: 'center'
            },
            {
                title: '应用端',
                dataIndex: 'guard_name',
                key: 'guard_name',
                align: 'center'
            },
            {
                title: '反馈问题类型',
                dataIndex: 'content',
                key: 'content',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                align: 'center',
                width: 200,
                render: (_: any, item: BaseDataType) => (
                    <Space>
                        <Button type="link" size="small" disabled={`${item.status.value}` != '1'} onClick={() => { handleSend(item.id) }}>
                            {`${item.status.value}` == '1' ? '处理' : '已处理'}
                        </Button>
                        <Button type="link" size="small" onClick={() => { handleDel(item.id) }}>删除</Button>
                    </Space>
                )
            }
        ],
        showPagination: true,
        page: { dataTotal, page, size: per_page }
    }

    const initData = () => {
        setLoadingTable(true)
        let params = {
            page,
            per_page,
            content: searchParamsData.type,
            web_id: searchParamsData.web_id,
            guard_name: searchParamsData.terminal,
            start_date: searchParamsData.date ? searchParamsData.date[0].format('YYYY-MM-DD') : '',
            end_date: searchParamsData.date ? searchParamsData.date[1].format('YYYY-MM-DD') : ''
        }
        getVideoFeedBackListApi_2(params).then((res: any) => {
            setBaseData(res.data.data);
            setPage(Number(res.data.current_page));
            setPer_page(Number(res.data.per_page));
            setDataTotal(Number(res.data.total));
            setLoadingTable(false);
        }).catch(() => {
            setLoadingTable(false)
        })
    }

    const getOpList = () => {
        getVideoFeedBackWebListApi_2().then((res: any) => {
            let data: _OptionType[] = []
            res.data.forEach((item: { web_name: string; id: number }) => {
                data.push({
                    id: item.id,
                    label: item.web_name,
                    value: item.web_name
                })
            })
            setWebData(data)
        }).catch((e) => {
            // message.error(e)
        })
        getVideoFeedBackTerListApi_2().then((res: any) => {
            let data: _OptionType[] = []
            res.data.forEach((item: { text: string; value: number }) => {
                data.push({
                    id: item.value,
                    label: item.text,
                    value: item.text
                })
            })
            setTerData(data)
        }).catch((e) => {
            // message.error(e)
        })
    }

    useEffect(() => {
        getOpList()
    }, [])

    useEffect(() => {
        initData()
    }, [page, per_page, searchParamsData])

    return (
        <Row gutter={[12, 40]}>
            <Col span={24}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <SearchForm formList={formList} onSearch={onSearch} />
                </Space>
            </Col>
            <Col span={24}>
                <Card>
                    <Space direction="vertical" size={[4, 30]} style={{ width: '100%' }}>
                        <BaseTable data={paramsData} onChange={onChange} loading={loadingTable} />
                    </Space>
                </Card>
            </Col>
        </Row>
    )
}
