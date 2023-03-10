import { getVideoUserDetailApi_2, getVideoUserInviteRecordApi_2, getVideoUserScoreRecordApi_2 } from "@/request";
import { VideoUserInfo } from "@/type";
import { getSearchParams } from "@/utils";
import { Avatar, Card, Row, Space, Tabs, Col, Button, Modal, Table } from "antd"
import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";

const { TabPane } = Tabs;

type scoreModalPropType = {
    show: boolean
    userId: number,
    onCancel: () => void
}

const ScoreModal = (props: scoreModalPropType) => {
    const { userId, onCancel } = props;

    const testData = [
        { index: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: true },
        { index: 2, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: true },
        { index: 3, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 4, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 5, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 6, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 7, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 8, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 9, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 10, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 11, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 12, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 13, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 14, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false }
    ]
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [loading, setLoading] = useState<boolean>(false);
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
            title: '??????',
            dataIndex: 'content',
            key: 'content',
            align: 'center'
        },
        {
            title: '??????',
            dataIndex: 'created_at',
            key: 'created_at',
            align: 'center'
        },
        {
            title: '??????',
            dataIndex: 'number',
            key: 'number',
            align: 'center'
        },
        {
            title: '????????????',
            dataIndex: 'after',
            key: 'after',
            align: 'center'
        }
    ]
    const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: pageSize,
        current: currentPage,
        total: total,
        showTotal: () => `???${total}???`,
        onShowSizeChange: (current, size) => onPageSizeChange(current, size),
        onChange: (page, pageSize) => onPageChange(page, pageSize)
    }
    const getDataList = (data) => {
        // console.log('getDataList ', data);
        setLoading(true);
        getVideoUserScoreRecordApi_2(userId, data).then((res: any) => {
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
        getDataList({ page: currentPage, per_page: pageSize });
    }, [currentPage, pageSize])

    return (
        <Modal
            centered
            title={<div style={{ textAlign: 'center' }}>????????????</div>}
            visible={props.show}
            width={800}
            destroyOnClose
            footer={null}
            onCancel={onCancel}>
            {/* @ts-ignore */}
            <Table bordered columns={columns} dataSource={dataSource} pagination={paginationProps} rowKey={(record) => `${record.id}`} loading={loading} />
        </Modal>
    )
}

type inviteModalPropType = {
    show: boolean
    userId: number,
    onCancel: () => void
}

const InviteModal = (props: inviteModalPropType) => {
    const { userId, onCancel } = props;

    const testData = [
        { index: 1, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: true },
        { index: 2, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: true },
        { index: 3, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 4, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 5, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 6, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 7, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 8, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 9, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 10, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 11, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 12, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 13, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false },
        { index: 14, account: "15555", website: "sdg ", terminal: "web", date: "2021-01-01 15:88", status: false }
    ]
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [loading, setLoading] = useState<boolean>(false);
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
            title: '??????',
            dataIndex: 'account',
            key: 'account',
            align: 'center'
        },
        {
            title: '??????????????????',
            dataIndex: 'created_at',
            key: 'created_at',
            align: 'center'
        }
        // {
        //     title: '??????',
        //     dataIndex: 'guard_name',
        //     key: 'guard_name',
        //     align: 'center'
        // },
        // {
        //     title: '????????????',
        //     dataIndex: 'created_at',
        //     key: 'created_at',
        //     align: 'center'
        // }
    ]
    const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: pageSize,
        current: currentPage,
        total: total,
        showTotal: () => `???${total}???`,
        onShowSizeChange: (current, size) => onPageSizeChange(current, size),
        onChange: (page, pageSize) => onPageChange(page, pageSize)
    }
    const getDataList = (data) => {
        // console.log('getDataList ', data);
        setLoading(true);
        getVideoUserInviteRecordApi_2(userId, data).then((res: any) => {
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
        getDataList({ page: currentPage, per_page: pageSize });
    }, [currentPage, pageSize])

    return (
        <Modal
            centered
            title={<div style={{ textAlign: 'center' }}>??????????????????</div>}
            visible={props.show}
            width={800}
            destroyOnClose
            footer={null}
            onCancel={onCancel}>
            {/* @ts-ignore */}
            <Table bordered columns={columns} dataSource={dataSource} pagination={paginationProps} rowKey={(record) => `${record.id}`} loading={loading} />
        </Modal>
    )
}

const UserData = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const obj = getSearchParams(searchParams);
    console.log("UserData ", obj);
    const testData = { user_id: 1, avatar_url: "", nickname: "??????", site: "baidu", terminal: "web", date: "2021-10-10 12:45" }
    const [userData, setUserData] = useState<VideoUserInfo>(null);

    const [scoreModalShow, setScoreModalShow] = useState<boolean>(false);
    const onScoreModalShow = () => {
        setScoreModalShow(true);
    }
    // const onOk = () => {
    //     setModalShow(false);
    //     getDataList({});
    // }
    const onCloseScoreModal = () => {
        setScoreModalShow(false);
    }

    const [inviteModalShow, setInviteModalShow] = useState<boolean>(false);
    const onInviteModalShow = () => {
        setInviteModalShow(true);
    }
    // const onOk = () => {
    //     setModalShow(false);
    //     getDataList({});
    // }
    const onCloseInviteModal = () => {
        setInviteModalShow(false);
    }

    const getData = () => {
        getVideoUserDetailApi_2({ id: obj.id }).then((res: any) => {
            setUserData(res.data);
        });
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            <Row gutter={[12, 30]}>
                {userData && (
                    <Col span={24}>
                        <Card>
                            <Space align="start">
                                <Avatar size={64} src={userData?.avatar_url || ''} />
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    {`?????????${userData.nickname}`}
                                    {`???????????????${userData.created_at}`}
                                    {`???????????????${userData.guard_name}`}
                                    {`???????????????${userData.web_name}`}
                                    <Space style={{ width: '100%' }}>
                                        {`?????????${userData.point}`}
                                        <Button type="link" size="small" onClick={onScoreModalShow}>{'??????>>'}</Button>
                                    </Space>
                                    <Space style={{ width: '100%' }}>
                                        {`???????????????${+userData.invites_count}???`}
                                        <Button type="link" size="small" onClick={onInviteModalShow}>{'??????>>'}</Button>
                                    </Space>
                                </Space>
                            </Space>
                        </Card>
                    </Col>
                )}
            </Row>
            {
                scoreModalShow && (
                    <ScoreModal
                        userId={obj.id}
                        show={scoreModalShow}
                        onCancel={onCloseScoreModal} />
                )
            }
            {
                inviteModalShow && (
                    <InviteModal
                        userId={obj.id}
                        show={inviteModalShow}
                        onCancel={onCloseInviteModal} />
                )
            }
        </>
    )
}

export const VideoUserDetail: React.FC = () => {
    return (
        <Tabs defaultActiveKey="1">
            <TabPane tab="????????????" key="1">
                <UserData />
            </TabPane>
        </Tabs>
    )
}
