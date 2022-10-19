import { Button, Row, Col, Switch, Table, Space, Image, Card, message } from 'antd';
import { useEffect, useState } from 'react';
import { VideoSiteListQuerier } from './VideoSiteListQuerier';
import { VideoSiteListModal } from './VideoSiteListModal';
import { delVideoSiteApi_2, getVideoSiteListApi_2, getVideoSiteStateApi_2 } from '@/request';
import { VideoSiteInfo } from '@/type';

export const VideoSiteList = () => {
    const [forQueryParam, setForQueryParam] = useState({});
    const [queryParam, setQueryParam] = useState({ name: '', open: false, close: false });
    const onValueChange = (type: string, key: string, v: any, o?: any) => {
        // console.log('onValueChange  ', key, v, o);
        if (type == "input") {
            setQueryParam({ ...queryParam, [key]: v.target.value });
        } else if (type == "checkbox") {
            setQueryParam({ ...queryParam, [key]: v.target.checked });
        } else {
            setQueryParam({ ...queryParam, [key]: v });
        }
    }
    const onQuery = () => {
        let data: any = {};
        if (queryParam.name) data.name = queryParam.name;
        if (queryParam.open && !queryParam.close) data.state = 1;
        if (!queryParam.open && queryParam.close) data.state = 2;
        // console.log('onQuery ', queryParam, data);
        setForQueryParam({ ...data });
        getDataList({ ...data });
    }
    const onReset = () => {
        setQueryParam({ name: '', open: false, close: false });
        setForQueryParam({});
        getDataList({});
    }

    const [modalShow, setModalShow] = useState<boolean>(false);
    const [selectData, setSelectData] = useState({});
    const onAdd = () => {
        setSelectData({});
        setModalShow(true);
    }
    const onOk = () => {
        setModalShow(false);
        getDataList({});
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
    const [dataSource, setDataSource] = useState<VideoSiteInfo[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [loading, setLoading] = useState<boolean>(false);
    const onEdit = (item) => {
        setSelectData({ ...item });
        setModalShow(true);
    }
    const onDelete = (id: number) => {
        delVideoSiteApi_2(id).then((res: any) => {
            message.success('删除成功');
            getDataList({ ...forQueryParam, page: currentPage, per_page: pageSize });
        });
    }
    const onSiteStatusChange = (id: number, status: number) => {
        getVideoSiteStateApi_2({ id: id }).then((res: any) => {
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
        // {
        //     title: '网页logo',
        //     dataIndex: 'logo_url',
        //     key: 'logo_url',
        //     render: (text: any, item: any) => (<Image src={item.logo_url} width={80}></Image>),
        //     align: 'center'
        // },
        {
            title: '网站名称',
            dataIndex: 'web_name',
            key: 'web_name',
            align: 'center'
        },
        // {
        //     title: 'app logo',
        //     dataIndex: 'applogo',
        //     key: 'applogo',
        //     render: (text: any, item: any) => (<Image src={item.applogo}></Image>),
        //     align: 'center'
        // },
        {
            title: '副标',
            dataIndex: 'subtitle',
            key: 'subtitle',
            align: 'center'
        },
        // {
        //     title: 'app域名',
        //     dataIndex: 'appdomain',
        //     key: 'appdomain',
        //     align: 'center'
        // },
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
            dataIndex: 'state',
            key: 'state',
            render: (text: any, item: any) => (<Switch onClick={() => { onSiteStatusChange(item.id, item.status) }} checked={`${item.state}` == '1'} />),
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
        getVideoSiteListApi_2(data).then((res: any) => {
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
        console.log("useEffect", currentPage, pageSize);
        getDataList({ ...forQueryParam, page: currentPage, per_page: pageSize });
    }, [currentPage, pageSize])

    return (
        <>
            <Row gutter={[12, 30]}>
                <Col span={24}>
                    <Card>
                        <VideoSiteListQuerier
                            params={queryParam}
                            onValueChange={onValueChange}
                            onQuery={onQuery}
                            onReset={onReset} />
                    </Card>
                </Col>
                <Col span={24}>
                    <Card>
                        <Space direction="vertical" size={[4, 30]} style={{ width: '100%' }}>
                            <Button type="primary" danger onClick={onAdd}>新增</Button>
                            {/* @ts-ignore */}
                            <Table bordered columns={columns} dataSource={dataSource} pagination={paginationProps} rowKey={(record) => `${record.id}`} loading={loading} />
                        </Space>
                    </Card>
                </Col>
            </Row>
            {
                modalShow && (
                    <VideoSiteListModal
                        show={modalShow}
                        params={selectData}
                        onOk={onOk}
                        onCancel={onCancel} />
                )
            }
        </>
    )
}
