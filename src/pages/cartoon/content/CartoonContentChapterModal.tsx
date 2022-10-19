import { Modal, Space, Form, Input, DatePicker, Select, Checkbox, Button, Radio, message, Upload, Tooltip } from "antd"
import { momentToTime, timeToMoment } from "@/utils";
import { CartoonChapterInfo, cartoonCostTypeOp, _OptionType } from "@/type";
import { useState } from "react";
import { delCartoonChapterContentPicApi, postCartoonChapterAddApi, postCartoonChapterAddPicApi, postCartoonChapterEditApi } from "@/request";
import { ImgUploader, PicturesWall } from "@/components/upload";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import './CartoonContentChapterModal.scss'

const { confirm } = Modal;

type modalPropType = {
    show: boolean
    params: any,
    id: any,
    onOk: () => void
    onCancel: () => void
}

export const CartoonContentChapterModal = (props: modalPropType) => {
    let params: CartoonChapterInfo = props.params;
    console.log('CartoonContentChapterModal', params);
    let isEdit = Object.keys(params).length > 0;
    const title = isEdit ? "编辑内容" : "新增内容";
    const [publish, setPublish] = useState(!params.release_status ? 1 : Number(params.release_status));

    const [form] = Form.useForm();
    const onConfirm = () => {
        form.validateFields().then((v) => {
            console.log('values ...', v, publish);
            let data: any = {
                mid: props.id,
                xid: v.index,
                name: v.name,
                vip: v.costType
            }
            data.is_end = v.end ? 1 : 0;
            // if (!isEdit) data.is_end = v.end ? 1 : 0;
            if (publish == 2) data.timingtime = momentToTime(v.timingtime, 'YYYY-MM-DD HH:mm');
            data.release_status = publish;
            if (isEdit) {
                postCartoonChapterEditApi(params.id, data).then((res: any) => {
                    message.success('修改成功');
                    props.onOk();
                });
            } else {
                postCartoonChapterAddApi(data).then((res: any) => {
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
                    <Input />
                </Form.Item>
                <Form.Item label="付费模式" name="costType" rules={[{ required: true, message: '请选择付费模式' }]} initialValue={params?.vip}>
                    <Select style={{ width: 150 }}>
                        {
                            cartoonCostTypeOp.map((status) => (
                                <Select.Option value={status.id} key={status.label}>
                                    {status.label}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="已完结" name="end" valuePropName="checked" initialValue={!!params?.is_end}>
                    <Checkbox>已完结</Checkbox>
                </Form.Item>
                {
                    params.release_status != 1 && (
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
            </Form>
        </Modal>
    )
}

export const CartoonContentChapterImgModal = (props: modalPropType) => {
    let params: CartoonChapterInfo = props.params;
    // console.log("CartoonContentChapterImgModal", params)
    const title = "章节内容";
    const toLocData = (net) => {
        return net && net.length ? net.map((v) => ({ uid: v.id, url: v.img, name: v.name })) : [];
    }
    const toNetData = (loc) => {
        return loc && loc.length ? loc.map((v) => (v.url && { name: v.name, img: v.url, id: Number.isNaN(Number(v.uid)) ? null : Number(v.uid) })) : [];
    }

    const [form] = Form.useForm();
    const onConfirm = () => {
        form.validateFields().then((v) => {
            console.log('values ...', v);
            if (v.content.some((v) => v.status == "uploading")) {
                message.warn('请等待上传完成');
                return;
            }
            let data: any = {
                chapter_image: toNetData(v.content)
            }
            postCartoonChapterAddPicApi(params.id, data).then((res: any) => {
                message.success('操作成功');
                props.onOk();
            });
        }).catch((errorInfo) => {
            console.log('errorInfo ...', errorInfo);
        });
    }
    const onCancel = () => {
        props.onCancel();
    }
    const onRemove = (file) => {
        // console.log('onRemove', file);
        return new Promise<any>((resolve, reject) => {
            if (file && file.uid && !Number.isNaN(Number(file.uid))) {
                confirm({
                    title: '确定删除此图片?',
                    icon: <ExclamationCircleOutlined />,
                    content: '服务端将同步删除此图片。',
                    okText: '是',
                    okType: 'danger',
                    cancelText: '否',
                    centered: true,
                    onOk() {
                        delCartoonChapterContentPicApi(file.uid).then((res: any) => {
                            message.success('删除成功');
                            resolve(true);
                        }).catch(() => {
                            reject();
                        });
                    },
                    onCancel() {
                        reject();
                    }
                });
            } else {
                resolve(true);
            }
        });
    }
    const footerNode = (
        <Space size={[20, 10]}>
            <Button type="primary" onClick={onConfirm}>保存</Button>
            <Button onClick={onCancel}>取消</Button>
        </Space>
    )

    const customItem = (originNode, file) => {
        const isLongTag = file.name.length > 12;
        const tagElem = (
            <div className="ant-btn custom_desc_item">
                {isLongTag ? `${file.name.slice(0, 11)}...` : file.name}
            </div>
        );
        return (
            <>
                {originNode}
                {isLongTag ? <Tooltip title={file.name} key={file.name}>{tagElem}</Tooltip> : tagElem}
            </>
        )
    }

    return (
        <Modal
            centered
            closable={false}
            title={<div style={{ textAlign: 'center' }}>{title}</div>}
            visible={props.show}
            width={650}
            destroyOnClose
            footer={footerNode}>
            <Form labelCol={{ span: 4 }} form={form} preserve={false} style={{ maxHeight: 500, overflowY: 'auto' }}>
                <Form.Item label="章节内容" name="content" rules={[{ required: true, message: '请上传章节内容' }]} initialValue={toLocData(params?.content)}>
                    <ImgUploader
                        className="cartoon_content_chapter_modal"
                        label="上传"
                        file_type="pic"
                        category="comic"
                        // maxCount={10}
                        multiple
                        onRemove={onRemove}
                        itemRender={customItem} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export const CartoonContentChapterImgModal1 = (props: modalPropType) => {
    let params: CartoonChapterInfo = props.params;
    // console.log("CartoonContentChapterImgModal", params)
    const title = "章节内容";
    const toLocData = (net) => {
        return net && net.length ? net.map((v) => ({ index: v.xid, url: v.img, data: v })) : [];
    }
    const toNetData = (loc) => {
        return loc && loc.length ? loc.map((v) => (v.url && { xid: Number(v.index), img: v.url, id: v.data ? v.data.id : null })) : [];
    }
    const flagRepeat = (arr: any[]) => {
        let flag = false; let
            len = arr.length;
        for (let i = 0; i < len - 1; i++) {
            for (let j = i + 1; j < len; j++) {
                if (arr[j].index == arr[i].index) {
                    flag = true;
                    break;
                }
            }
        }
        return flag
    }

    const [form] = Form.useForm();
    const onConfirm = () => {
        form.validateFields().then((v) => {
            // console.log('values ...', v);
            if (v.content.some((v) => v.status == "uploading")) {
                message.warn('请等待上传完成');
                return;
            }
            if (flagRepeat(v.content)) {
                message.error('图片序号重复');
            } else {
                let data: any = {
                    chapter_image: toNetData(v.content)
                }
                postCartoonChapterAddPicApi(params.id, data).then((res: any) => {
                    message.success('操作成功');
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
    const onRemove = (file, data) => {
        // console.log('onRemove', data, file);
        return new Promise<any>((resolve, reject) => {
            if (data && data.id) {
                confirm({
                    title: '确定删除此图片?',
                    icon: <ExclamationCircleOutlined />,
                    content: '',
                    okText: '是',
                    okType: 'danger',
                    cancelText: '否',
                    centered: true,
                    onOk() {
                        delCartoonChapterContentPicApi(data.id).then((res: any) => {
                            message.success('删除成功');
                            resolve(true);
                        }).catch(() => {
                            reject();
                        });
                    },
                    onCancel() {
                        reject();
                    }
                });
            } else {
                resolve(true);
            }
        });
    }
    const footerNode = (
        <Space size={[20, 10]}>
            <Button type="primary" onClick={onConfirm}>保存</Button>
            <Button onClick={onCancel}>取消</Button>
        </Space>
    )

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
                <Form.Item label="章节内容" name="content" rules={[{ required: true, message: '请上传章节内容' }]} initialValue={toLocData(params?.content)}>
                    <PicturesWall category="comic" maxCount={30} showIndexInput onRemove={onRemove} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
