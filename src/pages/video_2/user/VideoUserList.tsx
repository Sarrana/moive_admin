import { useEffect, useState } from 'react';
import { Button, Row, Col, Switch, Table, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { VideoUserQuerier } from './VideoUserQuerier';
import { momentToTime } from '@/utils';
import { getVideoAllSiteApi_2, getVideoUserListApi_2, getVideoUserStateApi_2 } from '@/request';
import { terminalOp, VideoUserInfo } from '@/type';

export const VideoUserList = () => {
    const navigate = useNavigate();
    const [siteArr, setSiteArr] = useState([]);
    const [terminalArr, setTerminalArr] = useState(terminalOp);
    const [forQueryParam, setForQueryParam] = useState({});
    const [queryParam, setQueryParam] = useState({ account: '', date: ['', ''], website: null, terminal: null, isMember: false, open: false, close: false });
    const onValueChange = (type: string, key: string, v: any, o?: any) => {
        // console.log('onValueChange  ', key, v, o);
        if (type == "input") {
            setQueryParam({ ...queryParam, [key]: v.target.value });
        } else if (type == "dateRange") {
            const d = v ? [momentToTime(v[0], 'YYYY-MM-DD'), momentToTime(v[1], 'YYYY-MM-DD')] : ['', ''];
            setQueryParam({ ...queryParam, [key]: d });
        } else if (type == "checkbox") {
            setQueryParam({ ...queryParam, [key]: v.target.checked });
        } else {
            setQueryParam({ ...queryParam, [key]: v });
        }
    }
    const onQuery = () => {
        let data: any = {};
        if (queryParam.account) data.name = queryParam.account;
        if (queryParam.date[0]) data.time_1 = queryParam.date[0];
        if (queryParam.date[1]) data.time_2 = queryParam.date[1];
        if (queryParam.website) data.web_id = queryParam.website;
        if (queryParam.terminal) data.guard_name = queryParam.terminal;
        // if (queryParam.serial) data.video_mode = queryParam.terminal;
        if (queryParam.open && !queryParam.close) data.state = 1;
        if (!queryParam.open && queryParam.close) data.state = 2;
        // console.log('onQuery ', queryParam, data);
        setForQueryParam({ ...data });
        getDataList({ ...data });
    }
    const onReset = () => {
        setQueryParam({ account: '', date: ['', ''], website: null, terminal: null, isMember: false, open: false, close: false });
        setForQueryParam({});
        getDataList({});
    }

    const testData = [
        { index: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: true },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: true },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false }
    ]
    const [dataSource, setDataSource] = useState<VideoUserInfo[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [loading, setLoading] = useState<boolean>(false);
    const onDetail = (id: number) => {
        navigate(`/Video2/UserMgr/UserList/Detail?id=${id}`, { replace: false });
    }
    const onStateChange = (id: number, status: boolean) => {
        getVideoUserStateApi_2({ id: id }).then((res: any) => {
            message.success('操作成功');
            getDataList({ ...forQueryParam, page: currentPage, per_page: pageSize });
        });
    }
    const onPageSizeChange = (current, size) => {
        setCurrentPage(current);
        setPageSize(size);
    }
    const onPageChange = (page, pageSize) => {
        setCurrentPage(page);
    }
    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            render: (text: any, record: any, index: number) => `${index + 1}`,
            align: 'center'
        },
        {
            title: '用户账号/邮箱号',
            dataIndex: 'account',
            key: 'account',
            align: 'center'
        },
        {
            title: '注册子网站',
            dataIndex: 'web_name',
            key: 'web_name',
            align: 'center'
        },
        {
            title: '注册终端',
            dataIndex: 'guard_name',
            key: 'guard_name',
            align: 'center'
        },
        {
            title: '注册时间',
            dataIndex: 'created_at',
            key: 'created_at',
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
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text: any, item: any) => (<Button type="link" onClick={() => { onDetail(item.id) }}>详情</Button>),
            align: 'center'
        }
    ]
    const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: pageSize,
        current: currentPage,
        total: total,
        showTotal: () => `共${total}条`,
        onShowSizeChange: (current, size) => onPageSizeChange(current, size),
        onChange: (page, pageSize) => onPageChange(page, pageSize)
    }
    const getDataList = (data) => {
        console.log('getDataList ', data);
        setLoading(true);
        getVideoUserListApi_2(data).then((res: any) => {
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
        getVideoAllSiteApi_2().then((res: any) => {
            setSiteArr(res.data);
        });
    }

    useEffect(() => {
        console.log("useEffect", currentPage, pageSize);
        getDataList({ ...forQueryParam, page: currentPage, per_page: pageSize });
    }, [currentPage, pageSize])

    useEffect(() => {
        getOpList();
    }, [])

    return (
        <Row gutter={[12, 30]}>
            <Col span={24}>
                <Card>
                    <VideoUserQuerier
                        params={queryParam}
                        siteArr={siteArr}
                        terminalArr={terminalArr}
                        onValueChange={onValueChange}
                        onQuery={onQuery}
                        onReset={onReset} />
                </Card>
            </Col>
            <Col span={24}>
                <Card>
                    {/* @ts-ignore */}
                    <Table bordered columns={columns} dataSource={dataSource} pagination={paginationProps} rowKey={(record) => `${record.id}`} loading={loading} />
                </Card>
            </Col>
        </Row>
    )
}
