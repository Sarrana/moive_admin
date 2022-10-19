import { Row, Col, Space, Image, Card, Typography, Button, Form, Input, Select, Upload, message, Tag, Tooltip, DatePicker, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { uploadUrlFormatter } from '@/utils';
import { opValToId, VideoDetail, videoEpOp, _OptionType } from '@/type';
import { postVideoAddApi_2, postVideoEditApi_2, searchActorApi_2 } from '@/request';
import loading from '@/components/loading/Loading';
import DebounceSelect from '@/components/debounceSelect';
import ImgCrop from 'antd-img-crop';

const { Title } = Typography;

type modalPropType = {
    image: string
    cropImage: string
    onHide: () => void
    onOk: (img: string, cropImg: string) => void
}

const UploadPosterModal = (props: modalPropType) => {
    // console.log('UploadPosterModal ', props)
    const { image, cropImage, onHide, onOk } = props
    const imageArr = image ? [{ status: 'done', url: image }] : [];
    const cropImageArr = cropImage ? [{ status: 'done', url: cropImage }] : [];
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState(imageArr);
    const [cropFileList, setCropFileList] = useState(cropImageArr);
    const [imageUrl, setImageUrl] = useState<string>(image);
    const [cropImageUrl, setCropImageUrl] = useState<string>(cropImage);
    const onConfirm = () => {
        // console.log(111, imageUrl, cropImageUrl)
        onOk(imageUrl, cropImageUrl)
    }
    const onCancel = () => {
        onHide();
    }
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传 JPG/PNG 文件!');
        }
        return isJpgOrPng;
    }
    const uploadProp = {
        accept: 'image/jpeg,image/png,image/webp,image/avif',
        action: uploadUrlFormatter(`/api/uploads/common_upload/pic/video_poster`),
        // 上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
        listType: 'picture-card',
        fileList: fileList,
        maxCount: 1,
        // previewFile: previewFile,
        // beforeUpload: beforeUpload,
        onChange: (e) => {
            // console.log('onChange', e);
            setFileList(e.fileList);
            if (e.file.status === 'uploading') {
                return;
            }
            if (e.file.status === 'done') {
                const { response } = e.file;
                message.success(`${e.file.name} 上传成功`);
                setImageUrl(response.data.url);
            } else if (e.file.status === 'error') {
                message.error(`${e.file.name} 上传失败`);
            }
        }
    }
    const uploadProp2 = {
        accept: 'image/jpeg,image/png,image/webp,image/avif',
        action: uploadUrlFormatter(`/api/uploads/common_upload/pic/video_poster`),
        // 上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
        listType: 'picture-card',
        fileList: cropFileList,
        maxCount: 1,
        // beforeUpload: beforeUpload,
        onChange: (e) => {
            // console.log('onChange', e);
            setCropFileList(e.fileList);
            if (e.file.status === 'uploading') {
                return;
            }
            if (e.file.status === 'done') {
                const { response } = e.file;
                message.success(`${e.file.name} 上传成功`);
                setCropImageUrl(response.data.url);
            } else if (e.file.status === 'error') {
                message.error(`${e.file.name} 上传失败`);
            }
        }
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
            title={<div style={{ textAlign: 'center' }}>上传封面</div>}
            visible
            width={600}
            destroyOnClose
            footer={footerNode}>
            <Form labelCol={{ span: 4 }} form={form} preserve={false}>
                <Form.Item label="竖屏封面" name="cover_v">
                    {/* @ts-ignore */}
                    <Upload {...uploadProp}>
                        <Button type="primary">上传</Button>
                    </Upload>
                </Form.Item>
                <Form.Item label="横屏封面" name="cover_h">
                    <ImgCrop aspect={16 / 9}>
                        {/* @ts-ignore */}
                        <Upload {...uploadProp2}>
                            <Button type="primary">上传</Button>
                        </Upload>
                    </ImgCrop>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export const VideoContentAdd = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // console.log("VideoContentAdd", location);
    const params: VideoDetail = location.state.data;
    const classifyArr = location.state.classifyArr;
    const cTypeArr = location.state.cTypeArr;
    const areaArr = location.state.areaArr;
    const yearArr = location.state.yearArr;
    const pageSize = location.state.pageSize;
    const currentPage = location.state.currentPage;
    const queryParam = location.state.queryParam;
    const tagArr = params && params.tags ? params.tags.split(',') : [];
    const isEdit = Object.keys(params).length > 0;
    const title = isEdit ? "编辑内容" : "新增内容";
    const tempSelectCid = params && params.cid ? Number(params.cid) : null;
    const tempTypeArr = cTypeArr.filter((v) => v.id == tempSelectCid)[0]?.video_type || [];
    const [form] = Form.useForm();
    const [selectCid, setSelectCid] = useState(tempSelectCid);
    const [typeArr, setTypeArr] = useState(tempTypeArr);
    const [imageUrl, setImageUrl] = useState<string>(params?.pic || '');
    const [cropImageUrl, setCropImageUrl] = useState<string>(params?.level_pic || '');

    const onCancel = () => {
        // console.log("onCancel");
        setImageUrl(params?.pic || '');
        setCropImageUrl(params?.level_pic || '');
        setTags(tagArr);
        setSelectCid(tempSelectCid);
        setTypeArr(tempTypeArr);
        form.resetFields();
    }
    const onFinish = (v: any) => {
        console.log("onFinish", v);
        loading.show("请求中...");
        const data = {
            name: v.name,
            pic: imageUrl,
            level_pic: cropImageUrl,
            cid: v.classify,
            tags: tags.join(','),
            type: v.type.join(','),
            area: v.area,
            year: v.year,
            introduction: v.desc1 || '',
            present: v.desc2 || '',
            basic_score: v.score,
            total: v.totle,
            section: v.section,
            videomode: v.serial,
            stars: v.leadAct.map((v) => ({ id: Number.isNaN(Number(v.value)) ? null : Number(v.value), name: v.label })),
            directors: v.director.map((v) => ({ id: Number.isNaN(Number(v.value)) ? null : Number(v.value), name: v.label }))
        }
        // console.log("onFinish", data);
        if (isEdit) {
            postVideoEditApi_2(params.id, data).then((res: any) => {
                message.success('修改成功');
                loading.hide();
            }).catch(() => {
                loading.hide();
            });
        } else {
            postVideoAddApi_2(data).then((res: any) => {
                message.success('添加成功');
                loading.hide();
            }).catch(() => {
                loading.hide();
            });
        }
    }
    const onBack = () => {
        navigate('/Video2/ContentMgr/ContentList', { state: { currentPage, pageSize, queryParam }, replace: false });
    }

    const [showModal, setShowModal] = useState(false)
    const onShowModal = () => {
        setShowModal(true)
    }
    const onHideModal = () => {
        setShowModal(false)
    }

    const onConfirm = (img1, img2) => {
        // console.log(11111111111, img1, img2)
        setImageUrl(img1);
        setCropImageUrl(img2);
        setShowModal(false)
    }

    const imgBox = (alt, url) => {
        if (url) {
            return <Image src={url} alt={alt} />
        }
        return <div style={{ width: '100%', textAlign: 'center' }}>{alt}</div>
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
            });
        }
    }

    const onClassifyChange = (v) => {
        console.log('onClassifyChange', v);
        form.setFieldsValue({ classify: v });
        form.setFieldsValue({ type: [] });
        setSelectCid(v);
    }

    const [actorValue, setActorValue] = useState<any[]>([{ key: 1, label: 'test-1', value: 'test1' }]);
    const fetchActorList = async (username: string): Promise<any[]> => {
        return new Promise((resolve) => {
            searchActorApi_2({ keywords: username }).then((res: any) => {
                let arr = []
                res.data.forEach((element) => {
                    arr.push({ key: element.id, label: element.zh_name, value: element.id })
                });
                resolve(arr);
            }).catch(() => {
                resolve([]);
            })
        })
    }

    const [directorValue, setDirectorValue] = useState([{ key: 1, label: 'test-1', value: 'test1' }]);
    const fetchDirectorList = async (username: string): Promise<any[]> => {
        return new Promise((resolve) => {
            searchActorApi_2({ keywords: username }).then((res: any) => {
                let arr = []
                res.data.forEach((element) => {
                    arr.push({ key: element.id, label: element.zh_name, value: element.id })
                });
                resolve(arr);
            }).catch(() => {
                resolve([]);
            })
        })
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
        <>
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
                                    <Button type="primary" onClick={onShowModal}>上传</Button>
                                    <div style={{ width: '202px', height: '302px', border: '1px solid #000', position: 'relative' }}>
                                        <div style={{ width: '200px', height: '300px', display: "flex", alignItems: "center" }}>
                                            {imgBox('竖屏封面', imageUrl)}
                                        </div>
                                    </div>
                                    <div style={{ width: '202px', height: '117px', border: '1px solid #000', position: 'relative' }}>
                                        <div style={{ width: '200px', height: '115px', display: "flex", alignItems: "center" }}>
                                            {imgBox('横屏封面', cropImageUrl)}
                                        </div>
                                    </div>
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
                                {/* <Form.Item label="视频主演" name="leadAct" initialValue={params.starring}>
                                <Input />
                            </Form.Item> */}
                                {/* <Form.Item label="视频主演" name="leadAct" initialValue={['视频主演', '视频主演']}>
                                <Select allowClear mode="tags" style={{ width: '100%' }} placeholder="Tags Mode"></Select>
                            </Form.Item> */}
                                <Form.Item label="视频主演" name="leadAct" initialValue={params.starring?.map((v, i) => ({ key: v.id || `key_${i}`, label: v.name, value: v.id || `key_${i}` })) || []}>
                                    <DebounceSelect
                                        mode="multiple"
                                        value={actorValue}
                                        fetchOptions={fetchActorList}
                                        onChange={(newValue) => { setActorValue(newValue) }}
                                        style={{ width: '100%' }} />
                                </Form.Item>
                                {/* <Form.Item label="视频导演" name="director" initialValue={params.director?.map((v) => ({ key: v.id, label: v.name, value: v.id })) || []}> */}
                                <Form.Item label="视频导演" name="director" initialValue={params.director?.map((v, i) => ({ key: v.id || `key_${i}`, label: v.name, value: v.id || `key_${i}` })) || []}>
                                    <DebounceSelect
                                        mode="multiple"
                                        value={directorValue}
                                        fetchOptions={fetchDirectorList}
                                        onChange={(newValue) => { setDirectorValue(newValue) }}
                                        style={{ width: '100%' }} />
                                </Form.Item>
                                {/* <Form.Item label="视频导演" name="director" initialValue={params.director}>
                                <Input />
                            </Form.Item> */}
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
            {
                showModal
                && <UploadPosterModal image={imageUrl} cropImage={cropImageUrl} onHide={onHideModal} onOk={onConfirm} />
            }
        </>
    )
}
