import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
    Button, Space, Row, Col, message, Card, Modal, Form, Input
} from 'antd'
import {
    getIWantListApi_2, getWebListApi_2, sendEmailWantAPi_2, delIWantListApi_2
} from '@/request'
import BaseTable from '@/components/base/BaseTable'
import SearchForm, { SearchFormItem } from '@/components/searchForm'
import { Moment } from 'moment/moment'

type BaseDataType = {
  account: string
  content: string
  created_at: string
  id: number
  status: string
  status_text: string
  web_name: string
}
type WebDataType = {
  id: number
  name: string
  value: string
}
type SearchParamType = {
  keywords: string
  web_id: string
  status: string
  date: Moment[] | null
}

export const IWant: React.FC = () => {
    const { TextArea } = Input
    const [form] = Form.useForm();
    const [loadingTable, setLoadingTable] = useState<boolean>(true)
    const [baseData, setBaseData] = useState<BaseDataType[]>([])
    const [dataTotal, setDataTotal] = useState<number>(0)
    const [per_page, setPer_page] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [webData, setWebData] = useState<WebDataType[] | null>(null)
    const [visible, setVisible] = useState<boolean>(false)
    const [searchParamsData, setSearchParamsData] = useState<SearchParamType>({
        keywords: '',
        web_id: '',
        status: '',
        date: null
    })
    const [params, setParams] = useState<{ send_content: string } | null>(null)
    const [currendId, setCurrendId] = useState<number | null>(null)
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
                title: '提交内容',
                dataIndex: 'content',
                key: 'content',
                align: 'center'
            },
            {
                title: '提交网站',
                dataIndex: 'web_name',
                key: 'web_name',
                align: 'center'
            },
            {
                title: '状态',
                dataIndex: 'status_text',
                key: 'status_text',
                align: 'center'
            },
            {
                title: '提交时间',
                dataIndex: 'created_at',
                key: 'created_at',
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
                        <Button
                            type="link"
                            onClick={() => { handleSend(item.id) }}>
                            发送邮件
                        </Button>
                        <Button
                            type="link"
                            onClick={() => { handleDel(item.id) }}>
                            删除
                        </Button>
                    </Space>
                )
            }
        ],
        showPagination: true,
        page: { dataTotal, page, size: per_page }
    }
    const handleSend = (id: number) => {
        setParams({ send_content: '' })
        setVisible(true)
        setCurrendId(id)
    }
    const onChange = (pageParams) => {
        setPage(pageParams.current)
        setPer_page(pageParams.pageSize)
    }
    const handleDel = (id: number) => {
        delIWantListApi_2(id).then((res: any) => {
            if (res.code == 200) {
                message.success('操作成功')
                initData()
            } else {
                message.error(res.message)
            }
        }).catch((e) => {
            // message.error(e)
        })
    }
    const initData = () => {
        setLoadingTable(true)
        let params = {
            page,
            per_page,
            keywords: searchParamsData.keywords,
            web_id: searchParamsData.web_id,
            status: searchParamsData.status,
            start_date: searchParamsData.date ? searchParamsData.date[0].format('YYYY-MM-DD') : '',
            end_date: searchParamsData.date ? searchParamsData.date[1].format('YYYY-MM-DD') : ''
        }
        getIWantListApi_2(params).then((res: any) => {
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
                placeholder: '请选择网站',
                label: '',
                type: 'select',
                selectOp: webData || []
            },
            {
                name: 'status',
                placeholder: '请选择状态',
                label: '',
                type: 'select',
                selectOp: [
                    {
                        name: '待处理',
                        value: '1'
                    }, {
                        name: '已处理',
                        value: '2'

                    }
                ]
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
                res.data.web_sites.forEach((item: { web_name: string; label: string, id: number, value: string }) => {
                    data.push({
                        id: item.id,
                        name: item.web_name,
                        value: String(item.id)
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
    const handleCancel = () => {
        setParams(null)
        setVisible(false)
    }
    const onFinish = () => {
        const formData = new FormData()
        formData.append('send_content', params.send_content)
        sendEmailWantAPi_2(formData, currendId).then((res: any) => {
            if (res.code == 200) {
                message.success('发送成功')
                handleCancel()
                initData()
            } else {
                message.error(res.message)
            }
        }).catch((e) => {
            // message.error(e.message)
        })
    }
    const changeValue = (e: string) => {
        setParams({ send_content: e })
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
            <Col span={24}>
                <Card>
                    <Space direction="vertical" size={[4, 30]} style={{ width: '100%' }}>
                        <BaseTable data={paramsData} onChange={onChange} loading={loadingTable} />
                    </Space>
                </Card>
            </Col>
            {
                params
        && (
            <Modal
                title="邮件内容"
                visible={visible}
                width={800}
                centered
                onCancel={handleCancel}
                okText="保存发送"
                cancelText="取消"
                onOk={onFinish}>
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    form={form}
                    // initialValues={params || {}}
                    preserve={false}>
                    <Form.Item label="邮件内容" name="send_content" rules={[{ required: true, message: '请输入邮件内容' }]} initialValue={params.send_content}>
                        <TextArea
                            placeholder="请输入邮件内容"
                            autoSize={{ minRows: 2, maxRows: 6 }}
                            onChange={(e) => { changeValue(e.target.value) }} />
                    </Form.Item>
                </Form>
            </Modal>
        )
            }
        </Row>
    )
}
