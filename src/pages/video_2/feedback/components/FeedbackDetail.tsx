import { getFeedbackDetailApi_2, setFeedbackReplyApi_2 } from '@/request/api/video_2/feedback';
import { Avatar, Button, Divider, Form, Image, List, message, Modal, Skeleton } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import React, { useEffect, useState } from 'react'

interface DataType {
    id: string
    user_id: string
    user_ip: string
    question: string
    message_type: string
    image: string
    status: number
    is_reply: number
    is_read: number
    created_at: string
    updated_at: string
}

interface FeedbackDetailProps {
    visible: boolean
    selectedUserId: string
    onCancel: () => void
}

enum REPLYTYPE {
    USER = 1,
    ADMIN = 2
}

function FeedbackDetail(props: FeedbackDetailProps) {
    const { visible, selectedUserId, onCancel } = props
    // const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DataType[]>([]);
    // const [list, setList] = useState<DataType[]>([]);
    const [dataSource, setDataSource] = useState<DataType[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [lastPage, setLastPage] = useState<number>(1)

    useEffect(() => {
        getUserfeedDetail()
    }, [currentPage]);

    const getUserfeedDetail = async (userId: string = selectedUserId) => {
        setLoading(true)
        console.log('-------getUserfeedDetail-------');
        console.log(currentPage);
        try {
            let data = {
                per_age: pageSize,
                page: currentPage,
                user_id: userId,         // 用户ID
            }
            let res: any = await getFeedbackDetailApi_2(data)
            setLastPage(res.data.last_page)
            setPageSize(res.data.per_page)
            setDataSource([...dataSource, ...res.data.data])
            
        } catch (error) {
            
        } finally {
            setLoading(false)
        }
    }

    const hanleFinishReply = async (values) => {
        console.log('--------hanleFinishReply---------');
        console.log(values);
        try {
            let params = {
                user_id: selectedUserId,      // 用户id
                content: values.content   // 工单内容
            }
            let res: any = await setFeedbackReplyApi_2(params)
            message.success(res?.message)
            onCancel()
        } catch (err) {

        }

    }

    const onLoadMore = () => {
        setCurrentPage(currentPage + 1)
    };

    const loadMore =
        currentPage < lastPage && !loading ? ( // 
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    height: 32,
                    lineHeight: '32px',
                }}
            >
                <Button style={{ marginBottom: 20 }} onClick={onLoadMore}>加载更多</Button>
            </div>
        ) : <Divider style={{color: '#ccc'}}>没有更多了</Divider>

    return (
        <Modal
            title="回复工单"
            footer={null}
            visible={visible}
            onCancel={onCancel}
        >
            <Form
                onFinish={hanleFinishReply}
            >
                <Form.Item label='' name={'content'} rules={[{ required: true, message: '请输入回复内容' }]}>
                    <TextArea placeholder="请输入回复内容" autoSize={{ minRows: 2, maxRows: 6 }} />
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit'>
                        回复
                    </Button>
                </Form.Item>
            </Form>
            <List
                style={{ height: '50vh', overflowY: 'scroll', paddingRight: 10 }}
                className="demo-loadmore-list"
                split={false}
                loading={loading}
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={dataSource}
                renderItem={item => (
                    <List.Item style={{ display: 'flex', justifyContent: (item.status == REPLYTYPE.USER) ? 'flex-left' : 'flex-end' }}>
                        <div style={{display:'flex', flexDirection: 'column', alignItems: (item.status == REPLYTYPE.USER) ? 'flex-start' : 'flex-end'}}>
                        {/* textAlign: (item.status == REPLYTYPE.USER) ? 'left' : "right"  */}
                            <span style={{color: '#ccc', fontSize: 10}}>
                                {item.status == REPLYTYPE.USER ? <Avatar size="small" style={{ backgroundColor: '#87d068' }}>Q</Avatar> : ''}
                                {item.created_at.substring(0,16)}
                                {item.status == REPLYTYPE.ADMIN ? <Avatar size="small" >A</Avatar> : ''}
                            </span>
                            <div style={{
                                textAlign: 'justify',
                                lineHeight: 2,
                                padding: '2px 10px',
                                borderRadius: 8,
                                backgroundColor: (item.status == REPLYTYPE.USER) ? '#87d068' : '#f7f7f7',
                                color: (item.status == REPLYTYPE.USER) ? 'white': '',
                                marginLeft: (item.status == REPLYTYPE.USER) ? 24 : '',
                                marginRight: (item.status == REPLYTYPE.ADMIN) ? 24 : ''
                            }}
                            >
                                {item.question}
                            </div>
                            {item.image != '' ? <Image style={{
                                objectFit: 'contain',
                                paddingLeft: (item.status == REPLYTYPE.USER) ? 24 : '',
                                paddingRight: (item.status == REPLYTYPE.ADMIN) ? 24 : ''
                            }} height={50} src={item.image} /> : ''
                            }
                        </div>
                    </List.Item>
                )}
            />
        </Modal>
    )
}

export default FeedbackDetail