import { Row, Col, Space, Image, Card, Typography, Button, Form, Input, Select, Upload, message, Tag, Tooltip, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment'
import { momentToTime, timeToMoment, uploadUrlFormatter } from '@/utils';
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { opValToId, VideoDetail, videoEpOp } from '@/type';
import { postVideoAddApi, postVideoEditApi } from '@/request/api/video/content';
import { ImgUploader } from '@/components/upload';
import loading from '@/components/loading/Loading';

const { Title } = Typography;

export const VideoContentAdd = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // console.log("VideoContentAdd", location);
    const params: VideoDetail = location.state.data;
    const classifyArr = location.state.classifyArr;
    const cTypeArr = location.state.cTypeArr;
    const areaArr = location.state.areaArr;
    const serialArr = location.state.serialArr;
    const yearArr = location.state.yearArr;
    const pageSize = location.state.pageSize;
    const currentPage = location.state.currentPage;
    const queryParam = location.state.queryParam;
    const tagArr = params && params.tags ? params.tags.split(',') : [];
    const imageArr = params && params.pic ? [{ status: 'done', url: params.pic }] : [];
    const isEdit = Object.keys(params).length > 0;
    const title = isEdit ? "编辑内容" : "新增内容";
    const tempSelectCid = params && params.cid ? Number(params.cid) : null;
    const tempTypeArr = cTypeArr.filter((v) => v.id == tempSelectCid)[0]?.video_type || [];
    const [form] = Form.useForm();
    const [selectCid, setSelectCid] = useState(tempSelectCid);
    const [typeArr, setTypeArr] = useState(tempTypeArr);

    const onCancel = () => {
        // console.log("onCancel");
        setFileList(imageArr);
        setImageUrl(params?.pic || '');
        setLoading(false);
        setTags(tagArr);
        setSelectCid(tempSelectCid);
        setTypeArr(tempTypeArr);
        form.resetFields();
    }
    const onFinish = (v: any) => {
        // console.log("onFinish", v);
        loading.show();
        const data = {
            name: v.name,
            pic: imageUrl,
            cid: v.classify,
            tags: tags.join(','),
            director: v.director,
            starring: v.leadAct,
            type: v.type.join(','),
            area: v.area,
            // year: momentToTime(v.year, 'YYYY'),
            year: v.year,
            introduction: v.desc1 || '',
            present: v.desc2 || '',
            basic_score: v.score,
            total: v.totle,
            section: v.section,
            videomode: v.serial
        }

        if (isEdit) {
            postVideoEditApi(params.id, data).then((res: any) => {
                message.success('修改成功');
                loading.hide();
            }).catch(() => {
                loading.hide();
            });
        } else {
            postVideoAddApi(data).then((res: any) => {
                message.success('添加成功');
                loading.hide();
            }).catch(() => {
                loading.hide();
            });
        }
    }
    const onBack = () => {
        navigate('/Video/ContentMgr', { state: { currentPage, pageSize, queryParam }, replace: false });
    }

    const [fileList, setFileList] = useState(imageArr);
    const [imageUrl, setImageUrl] = useState<string>(params?.pic || '');
    const [isLoading, setLoading] = useState<boolean>(false);
    const normFile = (e: any) => {
        console.log('Upload event:', e);
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

    const getBase64 = (file) => new Promise<string | ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    })
    const uploadProp = {
        accept: 'image/jpeg,image/png',
        action: uploadUrlFormatter(`/api/uploads/common_upload/pic/video_poster`),
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
                // let pp = (await getBase64(e.file.originFileObj)) as any;
                // setImageUrl(pp);
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

    const startDate = timeToMoment('1900', 'YYYY');
    const getDefaultYear = (year: string) => {
        if (year) {
            return timeToMoment(year, 'YYYY');
        }
        return timeToMoment(moment(), 'YYYY');
    }
    const disabledDate = (current) => {
        const now = moment();
        if (current) {
            return current < startDate || current > now;
        }
        return false;
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
        message: '请输入视频关键字',
        validator: (rule, value) => new Promise((resolve, reject) => {
            tags && tags.length ? resolve(null) : reject();
        })
    }

    const scoreRule = {
        required: true,
        message: '分数为1到10的整数或一位小数',
        validator: (rule, value) => new Promise((resolve, reject) => {
            // console.log('scoreRule ', value);
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
        })
    }

    const onClassifyChange = (v) => {
        console.log('onClassifyChange', v);
        form.setFieldsValue({ classify: v });
        form.setFieldsValue({ type: [] });
        setSelectCid(v);
    }

    useEffect(() => {
        const tagNode = renderTag();
        setTagsNode(tagNode);
    }, [tags]);

    useEffect(() => {
        if (selectCid) {
            setTypeArr(cTypeArr.filter((v) => v.id == selectCid)[0]?.video_type || []);
        }
    }, [selectCid]);

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
                                    <div style={{ width: '200px', height: '300px', display: "flex", alignItems: "center" }}>
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
                                    {/* <div style={{ marginTop: 100 }}>
                                        <ImgUploader
                                            label="封面图片"
                                            file_type='pic'
                                            category={params.cid_text}
                                            src={imageUrl}
                                            handleOk={(id, url) => { console.log(id, url, '11111111111'); setImageUrl(url); }}
                                        />
                                    </div> */}
                                </Form.Item>
                            </Space>
                        </Card>
                    </Col>
                    <Col span={18}>
                        <Card>
                            <Form.Item label="视频名称" name="name" rules={[{ required: true, message: '请输入视频名称!' }]} initialValue={params.name}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="视频简介" name="desc1" rules={[{ required: true, message: '请输入视频简介!' }]} initialValue={params.introduction}>
                                <Input allowClear />
                            </Form.Item>
                            <Form.Item label="视频介绍" name="desc2" initialValue={params.present}>
                                <Input allowClear />
                            </Form.Item>
                            <Form.Item label="视频主演" name="leadAct" initialValue={params.starring}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="视频导演" name="director" initialValue={params.director}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="视频分类" name="classify" rules={[{ required: true, message: '请选择视频分类!' }]} initialValue={Number(params.cid) || null}>
                                <Select style={{ width: 100 }} placeholder="视频分类" onChange={onClassifyChange}>
                                    {
                                        classifyArr.map((status) => (
                                            <Select.Option value={status.id} key={status.value}>
                                                {status.value}
                                            </Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            {/* <Form.Item label="视频类型" name="type" rules={[{ required: true, message: '请选择视频类型!' }]} */}
                            <Form.Item
                                label="视频类型"
                                name="type"
                                initialValue={params && params.type ? params.type.split(',').map((v) => opValToId(tempTypeArr, v)).filter((v) => !!v) : []}>
                                <Select placeholder="视频类型" mode="multiple">
                                    {
                                        typeArr.map((status) => (
                                            <Select.Option value={status.id} key={status.value}>
                                                {status.value}
                                            </Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            {/* <Form.Item label="视频模式" name="serial" initialValue={Number(params.videomode) || null}>
                                <Select style={{ width: 100 }} placeholder={"视频模式"}>
                                    {
                                        serialArr.map((status) => (
                                            <Select.Option value={status.id} key={status.value}>
                                                {status.value}
                                            </Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item> */}
                            {/* <Form.Item label="地区" name="area" rules={[{ required: true, message: '请选择视频地区!' }]} initialValue={params.area}> */}
                            <Form.Item label="地区" name="area" initialValue={Number(params.area_id) || null}>
                                <Select style={{ width: 100 }} placeholder="地区">
                                    {
                                        areaArr.map((status) => (
                                            <Select.Option value={status.id} key={status.value}>
                                                {status.value}
                                            </Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            {/* <Form.Item label="年份" name="year" initialValue={getDefaultYear(params.year)}>
                                <DatePicker style={{ width: 100 }} picker="year" disabledDate={disabledDate} />
                            </Form.Item> */}
                            {/* <Form.Item label="年份" name="year" rules={[{ required: true, message: '请选择视频年份!' }]} initialValue={getVideoYearOpId(yearArr, params.year)}> */}
                            {/* <Form.Item label="年份" name="year" initialValue={getVideoYearOpId(yearArr, params.year) || null}> */}
                            <Form.Item label="年份" name="year" initialValue={Number(params.year_id) || null}>
                                <Select style={{ width: 100 }} placeholder="年份">
                                    {
                                        yearArr.map((status) => (
                                            <Select.Option value={status.id} key={status.value}>
                                                {status.value}
                                            </Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="总数">
                                <Form.Item
                                    name="totle"
                                    initialValue={params.total || null}
                                    rules={[{ required: true, message: '请输入视频总数!' }]}
                                    style={{ display: 'inline-block', width: 100, margin: 0 }}>
                                    <Input type="number" />
                                </Form.Item>
                                <Form.Item
                                    name="section"
                                    initialValue={Number(params.section) || null}
                                    rules={[{ required: true, message: '请选择总数类型!' }]}
                                    style={{ display: 'inline-block', width: 80, margin: '0 10px' }}>
                                    <Select placeholder="">
                                        {
                                            videoEpOp.map((status) => (
                                                <Select.Option value={status.id} key={status.value}>
                                                    {status.value}
                                                </Select.Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="基础评分" name="score" initialValue={Number(`${params.basic_score}`) || null} rules={[scoreRule]}>
                                <Input style={{ width: 120 }} placeholder="1到10分" />
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
