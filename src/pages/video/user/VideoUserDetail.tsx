import { getVideoUserDetailApi } from "@/request";
import { VideoUserInfo } from "@/type";
import { getSearchParams } from "@/utils";
import { Avatar, Card, Row, Space, Tabs, Col } from "antd"
import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";

const { TabPane } = Tabs;

const UserData = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const obj = getSearchParams(searchParams);
    console.log("UserData ", obj);
    const testData = { user_id: 1, avatar_url: "", nickname: "鸹貔", site: "baidu", terminal: "web", date: "2021-10-10 12:45" }
    const [userData, setUserData] = useState<VideoUserInfo>(null);

    const getData = () => {
        getVideoUserDetailApi({ id: obj.id }).then((res: any) => {
            setUserData(res.data);
        });
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <Row gutter={[12, 30]}>
            {userData && (
                <Col span={24}>
                    <Card>
                        <Space align="start">
                            <Avatar size={64} src={userData?.avatar_url || ''} />
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {`昵称：${userData.nickname}`}
                                {`注册时间：${userData.created_at}`}
                                {`注册终端：${userData.guard_name}`}
                                {`注册平台：${userData.web_name}`}
                            </Space>
                        </Space>
                    </Card>
                </Col>
            )}
        </Row>
    )
}

export const VideoUserDetail: React.FC = () => {
    return (
        <Tabs defaultActiveKey="1">
            <TabPane tab="基础资料" key="1">
                <UserData />
            </TabPane>
        </Tabs>
    )
}
