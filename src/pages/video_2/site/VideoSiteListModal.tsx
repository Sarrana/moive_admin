import { postVideoSiteAddApi_2, postVideoSiteEditApi_2 } from "@/request";
import { VideoSiteInfo } from "@/type";
import { Modal, Form, Input, Button, Upload, Space, Row, Col, Tag, Tooltip, message } from "antd"
import React, { useEffect, useState } from "react";

const { TextArea } = Input;

type modalPropType = {
    show: boolean
    params: any,
    onOk: () => void
    onCancel: () => void
}

export const VideoSiteListModal = (props: modalPropType) => {
    const params: VideoSiteInfo = props.params;
    // console.log("VideoSiteListModal ", props);
    const isEdit = Object.keys(params).length > 0;
    const title = isEdit ? "编辑网站" : "添加网站";
    const tagArr = params && params.key_words ? params.key_words.split(',') : [];

    const [tagsNode, setTagsNode] = useState<React.ReactElement[]>([]);
    const [tags, setTags] = useState<string[]>(tagArr);
    const [inputTag, setInputTag] = useState<string>("");
    const onCloseTag = (removedTag) => {
        const newtags = tags.filter((v) => v !== removedTag);
        setTags(newtags);
        form.validateFields(['keyName']);
    }
    const renderTag = () => {
        if (!tags.length) return null;
        return tags.map((v, i) => {
            const isLongTag = v.length > 20;
            const tagElem = (
                <Tag key={v} closable onClose={() => onCloseTag(v)} style={{ marginBottom: '8px' }}>
                    {isLongTag ? `${v.slice(0, 20)}...` : v}
                </Tag>
            );
            return isLongTag ? <Tooltip title={v} key={v}>{tagElem}</Tooltip> : tagElem;
        });
    }
    const onInputTag = (e) => {
        // console.log("onInputTag >>> ", e.target.value);
        setInputTag(e.target.value);
    }
    const onAddTag = () => {
        const temp = inputTag.trim();
        if (temp && tags.every((v) => v != temp)) {
            const newtags = tags.concat([temp]);
            setTags(newtags);
            setInputTag('');
            form.validateFields(['keyName']);
        }
    }

    const [form] = Form.useForm();
    const onConfirm = () => {
        form.validateFields().then((v) => {
            // console.log('values ...', v);
            let data: any = {
                web_name: v.name,
                domain_name: v.domain,
                illustrate: v.desc,
                subtitle: v.subTit,
                key_words: tags.join(',')
                // logo_url: 'dsds',
            }
            if (isEdit) {
                postVideoSiteEditApi_2(params.id, data).then((res: any) => {
                    message.success('修改成功');
                    props.onOk();
                });
            } else {
                postVideoSiteAddApi_2(data).then((res: any) => {
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
    const keyNameRule = {
        required: true,
        message: '请输入网站关键字',
        validator: (rule, value) => {
            return new Promise((resolve, reject) => {
                tags && tags.length ? resolve(null) : reject();
            });
        }
    }

    useEffect(() => {
        const tagNode = renderTag();
        setTagsNode(tagNode);
    }, [tags]);

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
                <Form.Item label="网站名称" name="name" rules={[{ required: true, message: '请输入网站名称' }]} initialValue={params.web_name}>
                    <Input />
                </Form.Item>
                {/* <Form.Item label="网站logo" name="logo" valuePropName="fileList">
                    <Upload
                        action="/upload.do"
                        maxCount={1}
                    >
                        <Button type="primary">上传</Button>
                    </Upload>
                </Form.Item> */}
                {/* <Form.Item label="applogo" name="applogo11" valuePropName="fileList">
                    <Upload
                        action="/upload.do"
                        maxCount={1}
                        fileList={params?.fileList || []}
                    >
                        <Button type="primary">上传</Button>
                    </Upload>
                </Form.Item> */}
                {/* <Form.Item label="app域名" name="appdomain" rules={[{ required: true, message: '请输入app域名' }]} initialValue={params.appdomain}>
                    <Input />
                </Form.Item> */}
                <Form.Item label="网站域名" name="domain" rules={[{ required: true, message: '请输入网站域名' }]} initialValue={params.domain_name}>
                    <Input />
                </Form.Item>
                <Form.Item label="副标题" name="subTit" initialValue={params.subtitle}>
                    <Input />
                </Form.Item>
                <Form.Item label="网站说明" name="desc" initialValue={params.illustrate}>
                    <Input />
                </Form.Item>
                {/* <Form.Item label="网站说明" name="desc" style={{ marginBottom: 0 }} initialValue={params.desc}>
                    <TextArea allowClear autoSize />
                </Form.Item> */}
                <Form.Item label="网站关键字" name="keyName" rules={[keyNameRule]} initialValue="">
                    <Space>
                        <Input style={{ width: 250 }} value={inputTag} onChange={onInputTag} allowClear />
                        <Button type="link" onClick={onAddTag}>添加</Button>
                    </Space>
                </Form.Item>
                <Row>
                    <Col offset={4}>{tagsNode}</Col>
                </Row>
            </Form>
        </Modal>
    )
}
