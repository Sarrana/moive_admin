import { Row, Col, Space, Image, Card, Typography, Button, Form, Input, Select, Upload, message, Tag, Tooltip, Switch, Checkbox } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { uploadUrlFormatter } from '@/utils';
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { novelChannelOp, NovelInfo } from '@/type';
import { postNovelAddApi, postNovelEditApi } from '@/request';
import loading from '@/components/loading/Loading';

const { Title } = Typography;

export const NovelContentAdd = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // console.log("NovelContentAdd", location);
    const params: NovelInfo = location.state.data;
    const classifyArr1 = location.state.classifyArr1;
    const classifyArr2 = location.state.classifyArr2;
    const pageSize = location.state.pageSize;
    const currentPage = location.state.currentPage;
    const queryParam = location.state.queryParam;
    const tagArr = params && params.keywords ? params.keywords.split(',') : [];
    const imageArr = params && params.pic ? [{ status: 'done', url: params.pic }] : [];
    const isEdit = !!params.id;
    const title = isEdit ? "编辑内容" : "新增内容";
    const [form] = Form.useForm();
    const [isChannel, setIsChannel] = useState(Number(params.channel) || null);
    const [isClassify, setIsClassify] = useState(Number(params.cid) || null);
    const [classifyArr, setClassifyArr] = useState([]);
    const [subClassifyArr, setSubClassifyArr] = useState([]);

    const initClassOp = () => {
        // console.log("initClassOp", isChannel, isClassify);
        const channel = isChannel;
        if (channel) {
            const cArr = channel == 1 ? classifyArr1 : classifyArr2;
            setClassifyArr(cArr);
            if (isClassify) {
                const arr = cArr.filter((val) => val.id == isClassify);
                arr && arr[0] ? setSubClassifyArr(arr[0].book_type) : setSubClassifyArr([]);
            } else {
                setSubClassifyArr([]);
            }
        } else {
            setClassifyArr([]);
            setSubClassifyArr([]);
        }
    }

    const onChannelChange = (v) => {
        form.setFieldsValue({ channel: v });
        form.setFieldsValue({ classify: null });
        form.setFieldsValue({ type: [] });
        setIsChannel(v);
    }
    const onClassifyChange = (v) => {
        form.setFieldsValue({ classify: v });
        form.setFieldsValue({ type: [] });
        setIsClassify(v);
    }
    const onCancel = () => {
        console.log("onCancel");
        setFileList(imageArr);
        setImageUrl(params?.pic || '');
        setLoading(false);
        setTags(tagArr);
        setIsChannel(Number(params.channel) || null);
        setIsClassify(Number(params.cid) || null);
        form.resetFields();
    }
    const onFinish = (v: any) => {
        const data = {
            status: v.state ? 1 : 2,
            serialize: v.end ? 2 : 1,
            name: v.name,
            pic: imageUrl,
            // text: v.desc1 || '',
            content: v.desc2 || '',
            author: v.author || '',
            channel: v.channel,
            cid: v.classify,
            tags: v.type.join('/'),
            score: v.score,
            hits: v.reads,
            keywords: tags.join(',')
        }
        console.log("onFinish", v, data);
        loading.show();
        if (isEdit) {
            postNovelEditApi(params.id, data).then((res: any) => {
                message.success('修改成功');
                loading.hide();
            }).catch(() => {
                loading.hide();
            });
        } else {
            postNovelAddApi(data).then((res: any) => {
                message.success('添加成功');
                loading.hide();
            }).catch(() => {
                loading.hide();
            });
        }
    }
    const onBack = () => {
        navigate('/Novel/ContentMgr', { state: { currentPage, pageSize, queryParam }, replace: false });
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
        action: uploadUrlFormatter(`/api/uploads/common_upload/pic/novel_poster`),
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
        message: '请输入小说关键字',
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

    const readsRule = {
        required: true,
        message: '阅读量为大于0的整数',
        validator: (rule, value) => {
            return new Promise((resolve, reject) => {
                if (!value) {
                    reject();
                } else {
                    const arr = (`${value}`).split('.');
                    const v = Number(value);
                    if (arr.length > 1) {
                        reject();
                    } else {
                        (!v || Number.isNaN(v) || v < 1) ? reject() : resolve(null);
                    }
                }
            });
        }
    }

    useEffect(() => {
        const tagNode = renderTag();
        setTagsNode(tagNode);
    }, [tags]);

    useEffect(() => {
        initClassOp();
    }, [isChannel, isClassify]);

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
                            <Form.Item label="小说名称" name="name" rules={[{ required: true, message: '请输入小说名称!' }]} initialValue={params.name}>
                                <Input allowClear />
                            </Form.Item>
                            {/* <Form.Item label="小说简介" name="desc1" rules={[{ required: true, message: '请输入小说简介!' }]} initialValue={params.text}>
                                <Input allowClear />
                            </Form.Item> */}
                            <Form.Item label="小说介绍" name="desc2" rules={[{ required: true, message: '请输入小说介绍!' }]} initialValue={params.content}>
                                <Input allowClear />
                            </Form.Item>
                            <Form.Item label="小说作者" name="author" initialValue={params.author}>
                                <Input allowClear />
                            </Form.Item>
                            <Form.Item label="小说频道" name="channel" rules={[{ required: true, message: '请选择小说频道!' }]} initialValue={Number(params.channel) || null}>
                                <Select style={{ width: 100 }} placeholder="小说频道" onChange={(v, o) => onChannelChange(v)}>
                                    {
                                        novelChannelOp.map((status) => (
                                            <Select.Option value={status.id} key={status.value}>
                                                {status.value}
                                            </Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="小说分类"
                                name="classify"
                                rules={[{ required: true, message: '请选择小说分类!' }]}
                                // initialValue={params && params.class_name ? params.class_name.split(',').filter(v => !!v) : []}>
                                initialValue={Number(params.cid) || null}>
                                <Select style={{ width: 100 }} placeholder="小说分类" onChange={(v, o) => onClassifyChange(v)}>
                                    {
                                        classifyArr.map((status) => (
                                            <Select.Option value={status.id} key={status.value}>
                                                {status.value}
                                            </Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="细分标签"
                                name="type"
                                initialValue={params && params.tags ? params.tags.split('/').filter((v) => !!v) : []}>
                                <Select placeholder="细分标签" mode="multiple">
                                    {
                                        subClassifyArr.map((status) => (
                                            <Select.Option value={status.value} key={status.value}>
                                                {status.value}
                                            </Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="阅读量" name="reads" initialValue={Number(params.hits) || null} rules={[readsRule]}>
                                <Input style={{ width: 120 }} />
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
