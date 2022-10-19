import { Row, Col, Space, Image, Card, Typography, Button, Form, Input, Select, Upload, message, Tag, Tooltip, Switch, Checkbox } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { uploadUrlFormatter } from '@/utils';
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { CartoonInfo } from '@/type';
import { postCartoonAddApi, postCartoonEditApi } from '@/request';
import loading from '@/components/loading/Loading';

const { Title } = Typography;

export const CartoonContentAdd = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // console.log("CartoonContentAdd", location);
    const params: CartoonInfo = location.state.data;
    const typeArr = location.state.typeArr;
    const pageSize = location.state.pageSize;
    const currentPage = location.state.currentPage;
    const queryParam = location.state.queryParam;
    const tagArr = params && params.keywords ? params.keywords.split(',') : [];
    const imageArr = params && params.pic ? [{ status: 'done', url: params.pic }] : [];
    const isEdit = !!params.id;
    const title = isEdit ? "编辑内容" : "新增内容";
    const [form] = Form.useForm();

    const onCancel = () => {
        console.log("onCancel");
        setFileList(imageArr);
        setImageUrl(params?.pic || '');
        setLoading(false);
        setTags(tagArr);
        form.resetFields();
    }
    const onFinish = (v: any) => {
        const data = {
            pic: imageUrl,
            name: v.name,
            // text: v.desc1 || '',
            content: v.desc2 || '',
            author: v.author || '',
            type_id: v.type.join(','),
            score: v.score,
            keywords: tags.join(','),
            status: v.state ? 1 : 2,
            serialize: v.end ? 2 : 1
        }
        console.log("onFinish", v, data);
        loading.show();
        if (isEdit) {
            postCartoonEditApi(params.id, data).then((res: any) => {
                message.success('修改成功');
                loading.hide();
            }).catch(() => {
                loading.hide();
            });
        } else {
            postCartoonAddApi(data).then((res: any) => {
                message.success('添加成功');
                loading.hide();
            }).catch(() => {
                loading.hide();
            });
        }
    }
    const onBack = () => {
        navigate('/Cartoon/ContentMgr', { state: { currentPage, pageSize, queryParam }, replace: false });
    }

    const [fileList, setFileList] = useState(imageArr);
    const [imageUrl, setImageUrl] = useState<string>(params?.pic || '');
    const [isLoading, setLoading] = useState<boolean>(false);
    const normFile = (e: any) => {
        // console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    const imgBox = () => {
        if (imageUrl) {
            return <Image src={imageUrl} alt="封面图片" />
        }
        return <div style={{ width: '100%', textAlign: 'center' }}>封面图片</div>
    }

    const uploadProp = {
        accept: 'image/jpeg,image/png',
        action: uploadUrlFormatter(`/api/uploads/common_upload/pic/cartoon_poster`),
        // 上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
        listType: 'picture',
        fileList: fileList,
        maxCount: 1,
        showUploadList: false,
        beforeUpload: (file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('只能上传 JPG/PNG 文件!');
            }
            return isJpgOrPng;
        },
        onChange: async (e) => {
            console.log('onChange', e);
            if (e.file.status === 'uploading') {
                setLoading(true);
                // setImageUrl('');
                return;
            }
            if (e.file.status === 'done') {
                const { response } = e.file;
                message.success(`${e.file.name} 上传成功`);
                setImageUrl(response.data.url);
                setFileList(e.fileList);
                setLoading(false);
            } else if (e.file.status === 'error') {
                message.error(`${e.file.name} 上传失败`);
            }
        }
    }
    const onDeleltImg = () => {
        setImageUrl('');
        setFileList([]);
        setLoading(false);
    }

    const [tagsNode, setTagsNode] = useState<React.ReactElement[]>([]);
    const [tags, setTags] = useState<string[]>(tagArr);
    const [inputTag, setInputTag] = useState<string>("");
    const onCloseTag = (removedTag) => {
        const newtags = tags.filter((v) => v !== removedTag);
        setTags(newtags);
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
    const keyNameRule = {
        required: true,
        message: '请输入漫画关键字',
        validator: (rule, value) => {
            return new Promise((resolve, reject) => {
                tags && tags.length ? resolve(null) : reject();
            });
        }
    }

    const scoreRule = {
        required: true,
        message: '分数为1到10的整数或一位小数',
        validator: (rule, value) => {
            return new Promise((resolve, reject) => {
                if (!value) {
                    reject();
                } else {
                    const arr = (`${value}`).split('.');
                    const v = Number(value);
                    if (arr.length > 1) {
                        if (arr[1].length != 1) {
                            reject();
                        } else {
                            (!v || Number.isNaN(v) || v < 1 || v > 10 || !Number(arr[1])) ? reject() : resolve(null);
                        }
                    } else {
                        (!v || Number.isNaN(v) || v < 1 || v > 10) ? reject() : resolve(null);
                    }
                }
            });
        }
    }

    useEffect(() => {
        const tagNode = renderTag();
        setTagsNode(tagNode);
    }, [tags]);

    return (
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} onFinish={onFinish} form={form} preserve={false}>
            <Space style={{ width: '100%' }} direction="vertical">
                <Row>
                    <Col span={24}>
                        <Card bodyStyle={{ padding: 18 }}>
                            <Row justify="space-between">
                                <Col>
                                    <Title level={5} style={{ margin: 0, padding: '4px 0' }}>{title}</Title>
                                </Col>
                                <Col>
                                    <Space>
                                        <Form.Item style={{ margin: 0 }}>
                                            <Button type="primary" danger htmlType="submit">保存</Button>
                                        </Form.Item>
                                        <Form.Item style={{ margin: 0 }}>
                                            <Button htmlType="button" onClick={onCancel}>取消</Button>
                                        </Form.Item>
                                        <Form.Item style={{ margin: 0 }}>
                                            <Button type="primary" onClick={onBack}>返回</Button>
                                        </Form.Item>
                                    </Space>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={[12, 30]}>
                    <Col span={6}>
                        <Card style={{ height: '100%' }}>
                            <Space direction="vertical" align="center" size={[12, 30]} style={{ width: '100%' }}>
                                <div style={{ width: '202px', height: '302px', border: '1px solid #000', position: 'relative' }}>
                                    <div style={{ width: '200px', height: '300px', display: "flex", alignItems: "center", justifyContent: 'center' }}>
                                        {imgBox()}
                                    </div>
                                    {isLoading ? <LoadingOutlined style={{ fontSize: 40, position: 'absolute', top: 130, left: 80 }} /> : null}
                                    {imageUrl && !isLoading ? <DeleteOutlined style={{ cursor: "pointer" }} onClick={onDeleltImg} /> : null}
                                </div>
                                <Form.Item style={{ margin: 0 }} name="cover" valuePropName="fileList" getValueFromEvent={normFile}>
                                    {/* @ts-ignore */}
                                    <Upload {...uploadProp}>
                                        <Button type="primary">上传</Button>
                                    </Upload>
                                </Form.Item>
                            </Space>
                        </Card>
                    </Col>
                    <Col span={18}>
                        <Card>
                            <Form.Item label="漫画名称" name="name" rules={[{ required: true, message: '请输入漫画名称!' }]} initialValue={params.name}>
                                <Input allowClear />
                            </Form.Item>
                            {/* <Form.Item label="漫画简介" name="desc1" rules={[{ required: true, message: '请输入漫画简介!' }]} initialValue={params.text}>
                                <Input allowClear />
                            </Form.Item> */}
                            <Form.Item label="漫画介绍" name="desc2" rules={[{ required: true, message: '请输入漫画介绍!' }]} initialValue={params.content}>
                                <Input allowClear />
                            </Form.Item>
                            <Form.Item label="漫画作者" name="author" rules={[{ required: true, message: '请输入漫画作者!' }]} initialValue={params.author}>
                                <Input allowClear />
                            </Form.Item>
                            <Form.Item
                                label="漫画类型"
                                name="type"
                                rules={[{ required: true, message: '请选择漫画类型!' }]}
                                initialValue={params && params.type ? params.type.map((v) => v.id) : []}>
                                <Select mode="multiple" placeholder="类型可多选">
                                    {
                                        typeArr.map((status) => (
                                            <Select.Option value={status.id} key={status.value}>
                                                {status.value}
                                            </Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="基础评分" name="score" initialValue={Number(`${params.score}`) || null} rules={[scoreRule]}>
                                <Input style={{ width: 120 }} placeholder="1到10分" />
                            </Form.Item>
                            <Form.Item label="已完结" name="end" valuePropName="checked" initialValue={params.serialize == '完结'}>
                                <Checkbox>已完结</Checkbox>
                            </Form.Item>
                            <Form.Item label="状态" name="state" valuePropName="checked" initialValue={`${params.status}` == '1'}>
                                <Switch checkedChildren="开" unCheckedChildren="关" />
                            </Form.Item>
                            <Form.Item label="搜索关键字" name="keyName" rules={[keyNameRule]} initialValue="">
                                <Space>
                                    <Input style={{ width: 250 }} value={inputTag} onChange={onInputTag} allowClear />
                                    <Button type="link" onClick={onAddTag}>添加</Button>
                                </Space>
                            </Form.Item>
                            <Row>
                                <Col offset={4}>{tagsNode}</Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Space>
        </Form>
    )
}
