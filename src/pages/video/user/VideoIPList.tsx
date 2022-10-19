import { Button, Row, Col, Switch, Table, Card } from 'antd';
import { useEffect, useState } from 'react';
import { VideoIPQuerier } from './VideoIPQuerier';
import { momentToTime } from '@/utils';
import { terminalOp, VideoUserIp } from '@/type';
import { getVideoAllSiteApi, getVideoUserIpListApi } from '@/request';

export const VideoIPList = () => {
    const [siteArr, setSiteArr] = useState([]);
    const [terminalArr, setTerminalArr] = useState(terminalOp);
    const [forQueryParam, setForQueryParam] = useState({});
    const [queryParam, setQueryParam] = useState({ account: '', date: ['', ''], website: null, terminal: null, ipDisable: false, ipEnable: false });
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
        if (queryParam.account) data.key_words = queryParam.account;
        if (queryParam.date[0]) data.time_1 = queryParam.date[0];
        if (queryParam.date[1]) data.time_2 = queryParam.date[1];
        if (queryParam.website) data.web_id = queryParam.website;
        if (queryParam.terminal) data.guard_name = queryParam.terminal;
        // if (queryParam.terminal) data.guard_name = queryParam.terminal;
        // if (queryParam.ipDisable && !queryParam.ipEnable) data.state = 1;
        // if (!queryParam.ipDisable && queryParam.ipEnable) data.state = 2;
        // console.log('onQuery ', queryParam, data);
        setForQueryParam({ ...data });
        getDataList({ ...data });
    }
    const onReset = () => {
        setQueryParam({ account: '', date: ['', ''], website: null, terminal: null, ipDisable: false, ipEnable: false });
        setForQueryParam({});
        getDataList({});
    }

    const testData = [
        { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 1 },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 1 },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 1 },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 },
        { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 }
        // { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 },
        // { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 },
        // { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 },
        // { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 },
        // { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 },
        // { index: 1, account: "15555", website: "sdg ", terminal: "web", ip: "123.3.3.3", date: "2021-01-01 15:88", status: 0 }
    ]
    const [dataSource, setDataSource] = useState<VideoUserIp[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [loading, setLoading] = useState<boolean>(false);
    const onIPStatusChange = (userId: number, status: number) => {

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
            title: '访问网站',
            dataIndex: 'web_name',
            key: 'web_name',
            align: 'center'
        },
        {
            title: '访问终端',
            dataIndex: 'guard_name',
            key: 'guard_name',
            align: 'center'
        },
        {
            title: 'IP地址',
            dataIndex: 'ip',
            key: 'ip',
            align: 'center'
        },
        {
            title: '注册时间',
            dataIndex: 'created_at',
            key: 'created_at',
            align: 'center'
        }
        // {
        //     title: '操作',
        //     dataIndex: 'operation',
        //     key: 'operation',
        //     render: (text: any, item: any) => {
        //         if (item.status === 0) {
        //             return (<Button type="link" onClick={() => { onIPStatusChange(item.index, item.status) }}>取消禁用IP</Button>)
        //         }
        //         return (<Button type="link" onClick={() => { onIPStatusChange(item.index, item.status) }}>禁用IP</Button>)
        //     },
        //     align: 'center'
        // }
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
        getVideoUserIpListApi(data).then((res: any) => {
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
        getVideoAllSiteApi().then((res: any) => {
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
                    <VideoIPQuerier
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
