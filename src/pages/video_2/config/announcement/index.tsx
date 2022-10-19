import React, { useEffect, useState } from 'react'
import { Button, Card, Form, Input, message, Switch } from 'antd'
import { fetchAnnouncementApi, updateAnnouncementApi } from '@/request'

type ParamsDataType = {
    status: boolean
    content: string
}
const Announcement: React.FC = () => {
    const [form] = Form.useForm();
    const [isParams, setParams] = useState<ParamsDataType>(null)
    const changeStatus = (value: boolean) => {
        setParams({
            ...isParams,
            status: value
        })
    }
    const changeContent = (value: string) => {
        setParams({
            ...isParams,
            content: value
        })
    }

    const initParams = () => {
        fetchAnnouncementApi()
            .then((res: any) => {
                if (res.code == 200) {
                    console.log(res.data)
                    setParams(res.data)
                } else {
                    message.info(res.message)
                }
            })
            .catch(() => {
                message.error('服务错误,初始化失败')
            })
    }

    const save = (params: ParamsDataType) => {
        console.log({ params })
        updateAnnouncementApi(params)
            .then((res: any) => {
                if (res.code == 200) {
                    message.success(res.message)
                } else {
                    message.info(res.message)
                }
            })
            .catch(() => {
                message.error('服务错误，保存失败')
            })
    }

    useEffect(() => {
        initParams()
    }, [])

    return (
        <Card>
            {
                isParams && (
                    <>
                        <Form
                            autoComplete="off"
                            form={form}
                            initialValues={isParams}>
                            <Form.Item
                                label="状态"
                                name="status">
                                <Switch
                                    onClick={(e) => { changeStatus(e) }}
                                    checked={isParams.status} />
                            </Form.Item>
                            <Form.Item
                                label="内容"
                                name="content">
                                <Input.TextArea
                                    placeholder="请输入公告内容"
                                    allowClear
                                    value={isParams.content}
                                    onChange={(e) => changeContent(e.target.value)} />
                            </Form.Item>
                        </Form>
                        <Button
                            onClick={() => save(isParams)}>
                            保存
                        </Button>
                    </>
                )
            }
        </Card>
    )
}

export default Announcement
