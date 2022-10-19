import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Space, Switch, Row, Col, Select, message, Card, Image } from 'antd'
import {
    getActorListApi_2, delActorApi_2, getActorDetailApi_2, postActorEditApi_2
} from '@/request'
import BaseTable from '@/components/base/BaseTable'
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm'
import { stateOp } from '@/type'
import { momentToTime } from '@/utils'
import { useLocation, useNavigate } from 'react-router-dom'

export const ActorMgr: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;

    const [queryParam, setQueryParam] = useState(state?.queryParam || { keywords: '', start_date: '', end_date: '', status: null });
    const [initQueryParam, setInitQueryParam] = useState(state?.queryParam || { keywords: '', start_date: '', end_date: '', status: null });
    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'keywords',
                placeholder: '按明星名字搜索',
                type: 'input',
                width: 200
            },
            {
                name: 'date',
                type: 'rangePicker'
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
        []
    )
    const onSearch = useCallback(
        (params) => {
            let data: any = {
                keywords: params.keywords,
                start_date: params.date ? momentToTime(params.date[0], 'YYYY-MM-DD') : '',
                end_date: params.date ? momentToTime(params.date[1], 'YYYY-MM-DD') : '',
                status: params.status
            }
            setCurrentPage(1);
            setQueryParam(data);
        },
        []
    )

    const [dataSource, setDataSource] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(state?.currentPage || 1);
    const [pageSize, setPageSize] = useState<number>(state?.pageSize || 10);
    const [loading, setLoading] = useState<boolean>(false);
    const onAdd = () => {
        navigate('/Video2/ConfigMgr/ActorMgr/Add', { state: { currentPage, pageSize, queryParam }, replace: false });
    }
    const onDetail = (id: number) => {
        // navigate('/Cartoon/UserMgr/UserList/Detail?id=' + id, { state: { currentPage, pageSize }, replace: false });
    }
    const onStateChange = (id: number, status: string) => {
        postActorEditApi_2(id, { status: (`${status}`) === '1' ? 2 : 1 }).then((res: any) => {
            message.success('操作成功');
            getDataList();
        });
    }
    const onEdit = (item: any) => {
        getActorDetailApi_2(item.id).then((res: any) => {
            navigate('/Video2/ConfigMgr/ActorMgr/Edit', { state: { currentPage, pageSize, queryParam, data: res.data }, replace: false });
        });
    }
    const onDelete = (id: number) => {
        delActorApi_2(id).then((res: any) => {
            message.success('删除成功');
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
                title: '头像',
                dataIndex: 'avatar',
                key: 'avatar',
                render: (text: any, item: any) => (<Image src={item.avatar} width={80} />),
                align: 'center'
            },
            {
                title: '明星中文名',
                dataIndex: 'zh_name',
                key: 'zh_name',
                align: 'center'
            },
            {
                title: '性别',
                dataIndex: 'gender_text',
                key: 'gender_text',
                align: 'center'
            },
            {
                title: '英文名',
                dataIndex: 'en_name',
                key: 'en_name',
                align: 'center'
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text: any, item: any) => (<Switch onClick={() => { onStateChange(item.id, item.status) }} checked={`${item.status}` == '1'} />),
                align: 'center'
            },
            {
                title: '操作员',
                dataIndex: 'created_by',
                key: 'created_by',
                align: 'center'
            },
            {
                title: '创建时间',
                dataIndex: 'created_at',
                key: 'created_at',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: (text: any, item: any) => (
                    <Space size={[4, 4]}>
                        <Button type="link" size="small" onClick={() => { onEdit(item) }}>编辑</Button>
                        <Button type="link" size="small" onClick={() => { onDelete(item.id) }}>删除</Button>
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
        getActorListApi_2({ page: currentPage, per_page: pageSize, ...queryParam }).then((res: any) => {
            setDataSource(res.data.data);
            setCurrentPage(Number(res.data.current_page));
            setPageSize(Number(res.data.per_page));
            setTotal(Number(res.data.total));
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        getDataList();
    }, [currentPage, pageSize, queryParam])

    return (
        <Row gutter={[12, 40]}>
            <Col span={24}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <SearchForm formList={formList} onSearch={onSearch} params={initQueryParam} />
                </Space>
            </Col>
            <Col span={24}>
                <Card>
                    <Space direction="vertical" size={[4, 30]} style={{ width: '100%' }}>
                        <Button type="primary" danger onClick={onAdd}>新增</Button>
                        <BaseTable data={paramsData} onChange={onTableChange} loading={loading} />
                    </Space>
                </Card>
            </Col>
        </Row>
    )
}
