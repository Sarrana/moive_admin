import BaseTable from "@/components/base/BaseTable";
import SearchForm, { SearchFormItem, SelectOpType } from "@/components/searchForm";
import { getNovelUserBookshelfApi, getNovelUserDetailApi } from "@/request";
import { novelChannelOp, _OptionType } from "@/type";
import { getSearchParams, momentToTime } from "@/utils";
import { Avatar, Card, Row, Space, Tabs, Col, Button, Select, Modal } from "antd"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const { TabPane } = Tabs;

type modalPropType = {
    show: boolean
    params: any,
    onCancel: () => void
}

const NovelMemberModal = (props: modalPropType) => {
    let params: any = props.params;
    console.log("NovelMemberModal ", props);
    const [dataSource, setDataSource] = useState<any[]>([]);
    const onTableChange = (pageParams) => {
        // console.log("onTableChange", pageParams);
    }
    const paramsData = {
        list: dataSource,
        columns: [
            {
                title: '#',
                dataIndex: 'id',
                key: 'id',
                align: 'center'
            },
            {
                title: '订单号',
                dataIndex: 'account',
                key: 'account',
                align: 'center'
            },
            {
                title: '会员类型',
                dataIndex: 'web_name',
                key: 'web_name',
                align: 'center'
            },
            {
                title: '付费费用（元）',
                dataIndex: 'guard_name',
                key: 'guard_name',
                align: 'center'
            },
            {
                title: '付费方式',
                dataIndex: 'ip',
                key: 'ip',
                align: 'center'
            },
            {
                title: '微信单号',
                dataIndex: 'ip',
                key: 'ip',
                align: 'center'
            },
            {
                title: '付费时间',
                dataIndex: 'created_at',
                key: 'created_at',
                align: 'center'
            }
        ],
        showPagination: false
    }

    return (
        <Modal
            centered
            closable
            title={<div style={{ textAlign: 'center' }}>会员详情</div>}
            visible={props.show}
            width={800}
            destroyOnClose
            onCancel={props.onCancel}
            footer={null}>
            <BaseTable data={paramsData} onChange={onTableChange} />
        </Modal>
    )
}

const UserData = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const obj = getSearchParams(searchParams);
    // console.log("UserData ", obj);
    const testData = { user_id: 1, avatar_url: "", nickname: "鸹貔", site: "baidu", terminal: "web", date: "2021-10-10 12:45" }
    const [userData, setUserData] = useState<any>(null);
    const [modalShow, setModalShow] = useState<boolean>(false);

    const onCancel = () => {
        setModalShow(false);
    }
    const onDetail = (id) => {
        setModalShow(true);
    }
    const getData = () => {
        getNovelUserDetailApi(obj.id).then((res: any) => {
            setUserData(res.data);
        });
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            <Row gutter={[12, 30]}>
                <Col span={24}>
                    <Card>
                        <Space align="start">
                            <Avatar size={64} src={userData?.avatar_url || ''} />
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {`昵称：${userData?.nickname}`}
                                {`注册时间：${userData?.created_at}`}
                                {`注册终端：${userData?.guard_name}`}
                                {`注册平台：${userData?.web_name}`}
                                {
                                    userData?.vip && (
                                        <div>
                                            会员：2021-12-26  12：21  到期
                                            <Button type="link" onClick={() => { onDetail(obj.id) }}>详情</Button>
                                        </div>
                                    )
                                }
                            </Space>
                        </Space>
                    </Card>
                </Col>
            </Row>
            {
                modalShow && (
                    <NovelMemberModal
                        show={modalShow}
                        params={null}
                        onCancel={onCancel} />
                )
            }
        </>
    )
}

const Bookshelf = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const obj = getSearchParams(searchParams);
    // console.log("UserData ", obj);

    const [queryParam, setQueryParam] = useState({ keywords: '', time_1: '', time_2: '', cid: null });
    const formList = useMemo<SearchFormItem[]>(
        () => [
            {
                name: 'name',
                type: 'input',
                placeholder: "按书籍名搜索",
                width: 200
            },
            {
                name: 'date',
                type: 'rangePicker'
            },
            {
                name: 'channel',
                placeholder: '频道',
                type: 'select',
                selectOp: novelChannelOp,
                selectOpRender: (item: SelectOpType) => <Select.Option value={item.id} key={String(item.value)}>{item.label}</Select.Option>,
                width: 100
            }
        ],
        []
    )
    const onSearch = useCallback(
        (params) => {
            let data: any = {
                keywords: params.name,
                time_1: params.date ? momentToTime(params.date[0], 'YYYY-MM-DD') : '',
                time_2: params.date ? momentToTime(params.date[1], 'YYYY-MM-DD') : '',
                cid: params.channel
            }
            setCurrentPage(1);
            setQueryParam(data);
        },
        []
    )

    const [dataSource, setDataSource] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [loading, setLoading] = useState<boolean>(false);
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
                title: '书籍名称',
                dataIndex: 'book_name',
                key: 'book_name',
                align: 'center'
            },
            {
                title: '频道',
                dataIndex: 'channel',
                key: 'channel',
                align: 'center'
            },
            {
                title: '收藏时间',
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
        getNovelUserBookshelfApi(obj.id, { page: currentPage, per_page: pageSize, ...queryParam }).then((res: any) => {
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

export const NovelUserDetail: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;

    const onBack = () => {
        navigate('/Novel/UserMgr/UserList', { state: state, replace: false });
    }

    return (
        <>
            <Button type="primary" onClick={onBack}>返回</Button>
            <Tabs defaultActiveKey="1">
                <TabPane tab="基础资料" key="1">
                    <UserData />
                </TabPane>
                <TabPane tab="书架" key="2">
                    <Bookshelf />
                </TabPane>
            </Tabs>
        </>
    )
}
