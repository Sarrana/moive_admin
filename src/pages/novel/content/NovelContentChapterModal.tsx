import { Modal, Space, Form, Input, DatePicker, Select, Checkbox, Button, Radio, message } from "antd"
import { momentToTime, timeToMoment } from "@/utils";
import { NovelChapterInfo, novelCostTypeOp, _OptionType } from "@/type";
import { useState } from "react";
import { postChapterAddApi, postChapterEditApi } from "@/request";

type modalPropType = {
    show: boolean
    params: any,
    id: any,
    onOk: () => void
    onCancel: () => void
}

export const NovelContentChapterModal = (props: modalPropType) => {
    let params: NovelChapterInfo = props.params;
    let isEdit = Object.keys(params).length > 0;
    const title = isEdit ? "编辑内容" : "新增内容";
    const [publish, setPublish] = useState(!params.yid ? 1 : Number(params.yid));
    // console.log("VideoContentDramaModal ", publish, props);

    const [form] = Form.useForm();
    const onConfirm = () => {
        form.validateFields().then((v) => {
            console.log('values ...', v, publish);
            let data: any = {
                xid: v.index,
                name: v.name,
                vip: v.costType,
                content: v.content
            }
            if (!isEdit) data.is_end = v.end ? 1 : 0
            if (publish == 2) data.timingtime = momentToTime(v.timingtime, 'YYYY-MM-DD HH:mm');
            if (isEdit) {
                data.yid = publish;
                data.bid = props.id;
                data.id = params.id;
                postChapterEditApi(props.id, data).then((res: any) => {
                    message.success('修改成功');
                    props.onOk();
                });
            } else {
                data.yid = publish;
                postChapterAddApi(props.id, data).then((res: any) => {
                    message.success('添加成功');
                    props.onOk();
                });
            }
        }).catch((errorInfo) => {
            console.log('errorInfo ...', errorInfo);
        });
    }
    const onCancel = () => {
        props.onCancel();
    }
    const footerNode = (
        <Space size={[20, 10]}>
            <Button type="primary" onClick={onConfirm}>保存</Button>
            <Button onClick={onCancel}>取消</Button>
        </Space>
    )
    const onRadioChange = (v) => {
        // console.log('onRadioChange', v);
        form.setFieldsValue({ publish: v.target.value });
        setPublish(v.target.value);
    }

    return (
        <Modal
            centered
            closable={false}
            title={<div style={{ textAlign: 'center' }}>{title}</div>}
            visible={props.show}
            width={600}
            destroyOnClose
            footer={footerNode}>
            <Form labelCol={{ span: 4 }} form={form} preserve={false}>
                <Form.Item label="章节顺序">
                    <Form.Item name="index" rules={[{ required: true, message: '请输入章节顺序' }]} initialValue={params?.xid} style={{ marginBottom: 0 }}>
                        <Input style={{ width: 150 }} type="number" />
                    </Form.Item>
                    <div>章节顺序由系统自动排序、可修改</div>
                </Form.Item>
                <Form.Item label="章节标题" name="name" rules={[{ required: true, message: '请输入章节标题' }]} initialValue={params?.name}>
                    <Input style={{ width: 150 }} />
                </Form.Item>
                <Form.Item label="付费模式" name="costType" rules={[{ required: true, message: '请选择付费模式' }]} initialValue={params?.vip}>
                    <Select style={{ width: 150 }}>
                        {
                            novelCostTypeOp.map((status) => (
                                <Select.Option value={status.id} key={status.label}>
                                    {status.label}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                {/* <Form.Item label="排序" name="ep1" initialValue={0}>
                    <Input type={'number'} style={{ width: 150 }} />
                </Form.Item> */}
                {
                    !isEdit && (
                        <Form.Item label="已完结" name="end" valuePropName="checked" initialValue={false}>
                            <Checkbox>已完结</Checkbox>
                        </Form.Item>
                    )
                }
                {
                    params.yid != 1 && (
                        <Form.Item label="发布状态">
                            <Form.Item
                                name="publish"
                                initialValue={publish}
                                style={{ display: 'inline-block', margin: 0 }}>
                                <Radio.Group onChange={onRadioChange}>
                                    <Radio value={1}>立即发布</Radio>
                                    <Radio value={2}>定时发布</Radio>
                                </Radio.Group>
                            </Form.Item>
                            {
                                publish == 2
                                    ? (
                                        <Form.Item
                                            name="timingtime"
                                            initialValue={timeToMoment(params?.timingtime || '')}
                                            style={{ display: 'inline-block', width: 150, margin: 0 }}
                                            rules={[{ required: true, message: '请选择发布时间' }]}>
                                            <DatePicker
                                                showTime={{ format: 'HH:mm' }}
                                                onOk={() => { }}
                                                format="YYYY-MM-DD HH:mm" />
                                        </Form.Item>
                                    ) : null
                            }
                        </Form.Item>
                    )
                }
                <Form.Item label="章节内容" name="content" rules={[{ required: true, message: '请输入章节内容' }]} initialValue={params?.content}>
                    <Input.TextArea allowClear autoSize={{ minRows: 2, maxRows: 6 }} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
