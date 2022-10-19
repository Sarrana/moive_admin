import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, Card, message, Switch, Modal, Form, Input, Statistic, Space } from 'antd'
import { getVideoSearchListApi, delVideoSearchApi, getVideoAllSiteApi, updateUserAgreementsStatuslApi } from '@/request'
import BaseTable from '@/components/base/BaseTable'
import SearchForm, { SearchFormItem } from '@/components/searchForm';
import { Moment } from 'moment/moment'

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

type WebDataType = {
    name: string
    value: number
}
type SearchParamType = {
    keywords: string
    web_id: string
    guard_name: string
    result: string
    user_from: string
    date: Moment[] | null
}
export const VipOrder: React.FC = () => {
    const navigate = useNavigate();
    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState<BaseDataType[]>()
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [dataTotal, setDataTotal] = useState<number>(0)
    const [webData, setWebData] = useState<WebDataType[] | null>(null)
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
                title: '订单号',
                dataIndex: 'keyword',
                key: 'keyword',
                align: 'center'
            },
            {
                title: '下单用户',
                dataIndex: 'result_text',
                key: 'result_text',
                align: 'center'
            },
            {
                title: '会员类型',
                dataIndex: 'web_name',
                key: 'web_name',
                align: 'center'
            },
            {
                title: '费用(￥)',
                dataIndex: 'guard_name',
                key: 'guard_name',
                align: 'center'
            },
            {
                title: '订单网站',
                dataIndex: 'guard_name',
                key: 'guard_name',
                align: 'center'
            },
            {
                title: '终端类型',
                dataIndex: 'guard_name',
                key: 'guard_name',
                align: 'center'
            },
            {
                title: '付费方式',
                dataIndex: 'guard_name',
                key: 'guard_name',
                align: 'center'
            },
            {
                title: '付费单号',
                dataIndex: 'guard_name',
                key: 'guard_name',
                align: 'center'
            },
            {
                title: '创建时间',
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
    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'keywords',
                placeholder: '按用户账号搜索',
                label: '',
                type: 'input',
                width: 200
            },
            {
                name: 'result',
                placeholder: '请选择会员类型',
                label: '',
                type: 'select',
                selectOp: [
                    {
                        name: '开',
                        value: '1'
                    }, {
                        name: '关',
                        value: '2'

                    }
                ]
            },
            {
                name: 'web_id',
                placeholder: '请选择订单网站',
                label: '',
                type: 'select',
                selectOp: webData || []
            },
            {
                name: 'result',
                placeholder: '请选择终端',
                label: '',
                type: 'select',
                selectOp: [
                    {
                        name: '开',
                        value: '1'
                    }, {
                        name: '关',
                        value: '2'

                    }
                ]
            },
            {
                name: 'date',
                label: '',
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
        getVideoSearchListApi(params).then((res: any) => {
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
        getVideoAllSiteApi().then((res: any) => {
            if (res.code == 200) {
                let data: WebDataType[] = []
                res.data.forEach((item: { name: string; label: string, id: number, value: number }) => {
                    data.push({
                        name: item.label,
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
        <Row gutter={[12, 20]}>
            <Col span={24}>
                <SearchForm
                    formList={formList}
                    onSearch={onSearch} />
            </Col>
            <Col span={12}>
                <Card>
                    <Statistic
                        title="购买数"
                        value="1笔" />
                </Card>
            </Col>
            <Col span={12}>
                <Card>
                    <Statistic
                        title="累计金额"
                        value="￥1231" />
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
