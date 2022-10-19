import { Button, Row, Col, Switch, Space, Card, message, Select } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { delCartoonSiteApi, getCartoonSiteListApi, getCartoonSiteStateApi } from '@/request';
import { CartoonSiteInfo, stateOp } from '@/type';
import SearchForm, { SearchFormItem, SelectOpType } from '@/components/searchForm';
import BaseTable from '@/components/base/BaseTable';
import { CartoonSiteListModal } from './CartoonSiteListModal';

export const CartoonSiteList = () => {
    const [queryParam, setQueryParam] = useState({ web_name: '', status: null });
    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'web_name',
                type: 'input',
                placeholder: "按网站名称搜索",
                width: 200
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
            setCurrentPage(1);
            setQueryParam(params);
        },
        []
    )

    const [modalShow, setModalShow] = useState<boolean>(false);
    const [selectData, setSelectData] = useState({});
    const onAdd = () => {
        setSelectData({});
        setModalShow(true);
    }
    const onOk = () => {
        setModalShow(false);
        getDataList();
    }
    const onCancel = () => {
        setModalShow(false);
    }

    const testData = [
        {
            index: 1, logo: "", name: "子弹飞", applogo: "封神", subTit: "封神", appdomain: "www.baidu.com", domain: "www.baidu.com", desc: "1",
            oper: "已完结", createTime: "2021-01-01 15:88", status: 1
        },
        {
            index: 2, logo: "", name: "子弹", applogo: "封神", subTit: "封神", appdomain: "www.bayyyidu.com", domain: "www.baiyyyydu.com", desc: "1",
            oper: "已完结", createTime: "2021-01-01 20:56", status: 1
        }
    ]
    const [dataSource, setDataSource] = useState<CartoonSiteInfo[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [loading, setLoading] = useState<boolean>(false);
    const onEdit = (item) => {
        setSelectData({ ...item });
        setModalShow(true);
    }
    const onDelete = (id: number) => {
        delCartoonSiteApi(id).then((res: any) => {
            message.success('删除成功');
            getDataList();
        });
    }
    const onSiteStatusChange = (id: number) => {
        getCartoonSiteStateApi(id).then((res: any) => {
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
                title: '网站名称',
                dataIndex: 'web_name',
                key: 'web_name',
                align: 'center'
            },
            {
                title: '副标',
                dataIndex: 'subtitle',
                key: 'subtitle',
                align: 'center'
            },
            {
                title: '网站域名',
                dataIndex: 'domain_name',
                key: 'domain_name',
                align: 'center'
            },
            {
                title: '网站说明',
                dataIndex: 'illustrate',
                key: 'illustrate',
                align: 'center'
            },
            {
                title: '关键字',
                dataIndex: 'key_words',
                key: 'key_words',
                align: 'center'
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text: any, item: any) => (<Switch onClick={() => { onSiteStatusChange(item.id) }} checked={`${item.status}` == '1'} />),
                align: 'center'
            },
            {
                title: '操作员',
                dataIndex: 'admin_name',
                key: 'admin_name',
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
        getCartoonSiteListApi({ page: currentPage, per_page: pageSize, ...queryParam }).then((res: any) => {
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
        <>
            <Row gutter={[12, 30]}>
                <Col span={24}>
                    <SearchForm formList={formList} onSearch={onSearch} />
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
            {
                modalShow && (
                    <CartoonSiteListModal
                        show={modalShow}
                        params={selectData}
                        onOk={onOk}
                        onCancel={onCancel} />
                )
            }
        </>
    )
}
