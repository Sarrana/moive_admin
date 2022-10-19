import React, {
    useCallback, useEffect, useMemo, useState
} from 'react'
import {
    Space, Row, Col, message, Card, Statistic
} from 'antd'
import {
    getPointLogsListApi_2, getWebListApi_2
} from '@/request'
import BaseTable from '@/components/base/BaseTable'
import SearchForm, { SearchFormItem } from '@/components/searchForm'
import { Moment } from 'moment/moment'

type BaseDataType = {
  account: string
  content: string
  created_at: string
  id: number
  number: number
  type: string
  web_name: string
}
type SearchParamType = {
  keywords: string
  web_id: string
  date: Moment[] | null
}
type WebDataType = {
  name: string
  value: number
}
export const VideoGold: React.FC = () => {
    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState<BaseDataType[]>([])
    const [dataTotal, setDataTotal] = useState<number>(0)
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [webData, setWebData] = useState<WebDataType[] | null>(null)
    const [searchParamsData, setSearchParamsData] = useState<SearchParamType>({
        keywords: '',
        web_id: '',
        date: null
    })
    const [countTotal, setCountTotal] = useState({
        total_number: 0,
        today_total_number: 0,
        total_count: 0,
        today_total_count: 0
    })
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
                title: '用户账号',
                dataIndex: 'account',
                key: 'account',
                align: 'center'
            },
            {
                title: '网站',
                dataIndex: 'web_name',
                key: 'web_name',
                align: 'center'
            },
            {
                title: '金豆付费视频',
                dataIndex: 'content',
                key: 'content',
                align: 'center'
            },
            {
                title: '付费（金币）',
                dataIndex: 'number',
                key: 'number',
                align: 'center'
            },
            {
                title: '付费时间',
                dataIndex: 'created_at',
                key: 'created_at',
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
    const initData = () => {
        setLoadingTable(true)
        let params = {
            page,
            per_page,
            keywords: searchParamsData.keywords,
            web_id: searchParamsData.web_id,
            start_date: searchParamsData.date ? searchParamsData.date[0].format('YYYY-MM-DD') : '',
            end_date: searchParamsData.date ? searchParamsData.date[1].format('YYYY-MM-DD') : ''
        }
        getPointLogsListApi_2(params).then((res: any) => {
            if (res.code == 200) {
                setBaseData(res.data.data)
                setDataTotal(res.data.total)
                setCountTotal({
                    total_number: res.data.total_number,
                    today_total_number: res.data.today_total_number,
                    total_count: res.data.total_count,
                    today_total_count: res.data.today_total_count
                })
                setLoadingTable(false)
            } else {
                message.error(res.message)
                setLoadingTable(false)
            }
        }).catch(() => {
            setLoadingTable(false)
        })
    }
    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'keywords',
                placeholder: '按用户账号/电影名搜索',
                type: 'input',
                width: 200
            },
            {
                name: 'web_id',
                placeholder: '请选择来源网站',
                label: '',
                type: 'select',
                selectOp: webData
            },
            {
                name: 'date',
                type: 'rangePicker'
            }
        ],
        [webData]
    )
    const onSearch = useCallback(
        (params) => {
            setPage(1)
            setSearchParamsData(params)
        },
        []
    )
    const getWebList = () => {
        getWebListApi_2().then((res: any) => {
            if (res.code == 200) {
                let data: WebDataType[] = []
                res.data.web_sites.forEach((item: { web_name: string; label: string, id: number, value: number }) => {
                    data.push({
                        name: item.web_name,
                        value: item.id
                    })
                })
                setWebData(data)
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
        <Row gutter={[12, 40]}>
            <Col span={24}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <SearchForm formList={formList} onSearch={onSearch} />
                </Space>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="金币累计总量"
                        value={countTotal.total_number} />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="今日金币"
                        value={countTotal.today_total_number} />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="累计金币单量"
                        value={countTotal.total_count} />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="今日单量"
                        value={countTotal.today_total_count} />
                </Card>
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
