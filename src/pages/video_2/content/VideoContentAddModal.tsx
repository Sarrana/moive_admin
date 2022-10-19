import { Row, Col, Space, Image, Card, Typography, Button, Form, Input, Select, Upload, message, DatePicker, Modal, List } from 'antd';
import React, { createRef, useEffect, useRef, useState } from 'react';
import { momentToTime, timeToMoment, uploadUrlFormatter } from '@/utils';
import { getActorOpApi_2, postActorAddApi_2, searchActorApi_2, searchActorInfoApi_2, videoWebQueryApi_2 } from '@/request';
import ImgCrop from 'antd-img-crop';
import loading from '@/components/loading/Loading';
import { ImgUploader } from '@/components/upload';
import { RichTextEditor } from '@/components/editor';

const { Text } = Typography;
const { Search } = Input;

type modalPropType = {
    horImgUrl: string
    verImgUrl: string
    onHide: () => void
    onOk: (horImgUrl: string, verImgUrl: string) => void
}

export const UploadPosterModal = (props: modalPropType) => {
    const {
        horImgUrl,
        verImgUrl,
        onHide,
        onOk
    } = props

    const [form] = Form.useForm();
    const horImgArr = horImgUrl ? [{ status: 'done', url: horImgUrl }] : [];
    const verImgArr = verImgUrl ? [{ status: 'done', url: verImgUrl }] : [];
    const [isHorFileList, setHorFileList] = useState(horImgArr);
    const [isVerFileList, setVerFileList] = useState(verImgArr);
    const [isHorImgUrl, setHorImgUrl] = useState<string>(horImgUrl);
    const [isVerImgUrl, setVerImgUrl] = useState<string>(verImgUrl);
    const uploadHorProp = {
        accept: 'image/jpeg,image/png,image/webp,image/avif',
        action: uploadUrlFormatter(`/api/uploads/common_upload/pic/video_poster`),
        // 上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
        listType: 'picture-card',
        fileList: isHorFileList,
        maxCount: 1,
        onChange: (e) => {
            setHorFileList(e.fileList);
            if (e.file.status === 'uploading') {
                return;
            }
            if (e.file.status === 'done') {
                const { response } = e.file;
                message.success(`${e.file.name} 上传成功`);
                setHorImgUrl(response.data.url);
            } else if (e.file.status === 'error') {
                message.error(`${e.file.name} 上传失败`);
            }
        }
    }
    const uploadVerProp = {
        accept: 'image/jpeg,image/png,image/webp,image/avif',
        action: uploadUrlFormatter(`/api/uploads/common_upload/pic/video_poster`),
        // 上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
        listType: 'picture-card',
        fileList: isVerFileList,
        maxCount: 1,
        onChange: (e) => {
            setVerFileList(e.fileList);
            if (e.file.status === 'uploading') {
                return;
            }
            if (e.file.status === 'done') {
                const { response } = e.file;
                message.success(`${e.file.name} 上传成功`);
                setVerImgUrl(response.data.url);
            } else if (e.file.status === 'error') {
                message.error(`${e.file.name} 上传失败`);
            }
        }
    }
    const footerNode = (
        <Space size={[20, 10]}>
            <Button
                type="primary"
                onClick={() => onOk(isHorImgUrl, isVerImgUrl)}>
                保存
            </Button>
            <Button onClick={onHide}>
                取消
            </Button>
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
                    <ImgCrop aspect={3 / 4}>
                        {/* @ts-ignore */}
                        <Upload
                            {...uploadVerProp}>
                            <Button type="primary">上传</Button>
                        </Upload>
                    </ImgCrop>
                </Form.Item>
                <Form.Item label="横屏封面" name="cover_h">
                    <ImgCrop aspect={16 / 9}>
                        {/* @ts-ignore */}
                        <Upload
                            {...uploadHorProp}>
                            <Button type="primary">上传</Button>
                        </Upload>
                    </ImgCrop>
                    {/* <ImgCrop1 ref={cropperRef} aspect={16 / 9}>
                        <Upload {...uploadProp2}>
                            <Button type="primary">上传</Button>
                        </Upload>
                    </ImgCrop1> */}
                </Form.Item>
            </Form>
        </Modal>
    )
}

type WebSearchModalPropType = {
    dataSource: any
    onHide: () => void
    onOk: (v) => void
}
export const WebSearchModal = (props: WebSearchModalPropType) => {
    // console.log('UploadPosterModal ', props)
    const { dataSource, onHide, onOk } = props
    const [selectIndex, setSelectIndex] = useState(null);
    const [selectItem, setSelectItem] = useState(null);

    const onConfirm = () => {
        // let dataa = { status: "success", code: 200, message: "", data: { name: "\u8ba9\u5b50\u5f39\u98de (2010)", pic: "https:\/\/group-data1.s3.ap-southeast-1.amazonaws.com\/video\/info\/b022c63e6af611164dfd260b8f9024259fccb2cf.webp", level_pic: "https:\/\/group-data1.s3.ap-southeast-1.amazonaws.com\/video\/info\/b022c63e6af611164dfd260b8f9024259fccb2cf.webp", introduction: "\u6c11\u56fd\u5e74\u95f4\uff0c\u82b1\u94b1\u6350\u5f97\u53bf\u957f\u7684\u9a6c\u90a6\u5fb7\uff08\u845b\u4f18 \u9970\uff09\u643a\u59bb\uff08\u5218\u5609\u73b2 \u9970\uff09\u53ca\u968f\u4ece\u8d70\u9a6c\u4e0a\u4efb\u3002\u9014\u7ecf\u5357\u56fd\u67d0\u5730\uff0c\u906d\u52ab\u532a\u5f20\u9ebb\u5b50\uff08\u59dc\u6587 \u9970\uff09\u4e00\u4f19\u4f0f\u51fb\uff0c\u968f\u4ece\u5c3d\u6b7b\uff0c\u53ea\u592b\u59bb\u4e8c\u4eba\u4fa5\u5e78\u6d3b\u547d\u3002\u9a6c\u4e3a\u4fdd\u547d\uff0c\u8c0e\u79f0\u81ea\u5df1\u662f\u53bf\u957f\u7684\u6c64 \u5e08\u7237\u3002\u4e3a\u6c64\u5e08\u7237\u8bb8\u4e0b\u7684\u8d22\u5bcc\u6240\u52a8\uff0c\u5f20\u9ebb\u5b50\u6447\u8eab\u4e00\u53d8\u5316\u8eab\u53bf\u957f\uff0c\u5e26\u7740\u624b\u4e0b\u8d76\u8d74\u9e45\u57ce\u4e0a\u4efb\u3002\u6709\u9053\u662f\u5929\u9ad8\u7687\u5e1d\u8fdc\uff0c\u9e45\u57ce\u5730\u5904\u504f\u50fb\uff0c\u4e00\u65b9\u9738\u4e3b\u9ec4\u56db\u90ce\uff08\u5468\u6da6\u53d1 \u9970\uff09\u53ea\u624b\u906e\u5929\uff0c\u5168\u7136\u4e0d\u5c06\u8fd9\u4e2a\u65b0\u6765\u7684\u53bf\u957f\u653e\u5728\u773c\u91cc\u3002\u5f20\u9ebb\u5b50\u75db\u6253\u4e86\u9ec4\u7684\u6b66\u6559\u5934\uff08\u59dc\u6b66 \u9970\uff09\uff0c\u9ec4\u5219\u8bbe\u8ba1\u5bb3\u6b7b\u5f20\u7684\u4e49\u5b50\u5c0f\u516d\uff08\u5f20\u9ed8 \u9970\uff09\u3002\u539f\u672c\u53ea\u60f3\u8d5a\u94b1\u7684\u9a6c\u90a6\u5fb7\uff0c\u600e\u4e48\u4e5f\u60f3\u4e0d\u5230\u7adf\u4f1a\u88ab\u5377\u5165\u8fd9\u573a\u571f\u532a\u548c\u6076\u9738\u7684\u89d2\u529b\u4e4b\u4e2d\u3002\u9e45\u57ce\u4e0a\u7a7a\u6101\u4e91\u5bc6\u5e03\uff0c\u8840\u96e8\u8165\u98ce\u5728\u6240\u96be\u514d\u2026\u2026 \u3000\u3000\u672c\u7247\u6839\u636e\u9a6c\u8bc6\u9014\u7684\u5c0f\u8bf4\u300a\u591c\u8c2d\u5341\u8bb0\u300b\u4e2d\u7684\u300a\u76d7\u5b98\u8bb0\u300b\u4e00\u7ae0\u6539\u7f16\u3002", total: 0, section: 1, type: "\u5267\u60c5,\u559c\u5267,\u52a8\u4f5c,\u897f\u90e8", cid: 1, area: "\u4e2d\u56fd\u5927\u9646 \/ \u4e2d\u56fd\u9999\u6e2f", year: 2010, basic_score: "8.9", alias: ["\u8ba9\u5b50\u5f39\u98de\u4e00\u4f1a\u513f", "\u706b\u70e7\u4e91", "Let The Bullets Fly"], starring: [{ id: 112, name: "\u5ed6\u51e1" }, { id: 371, name: "\u80e1\u660e" }, { id: 628, name: "\u59dc\u6587" }, { id: 774, name: "\u9a6c\u73c2" }, { id: 832, name: "\u59dc\u6b66" }, { id: 873, name: "\u59da\u6a79" }, { id: 1085, name: "\u675c\u5955\u8861" }, { id: 1118, name: "\u51af\u5c0f\u521a" }, { id: 1183, name: "\u845b\u4f18" }, { id: 1703, name: "\u90b5\u5175" }, { id: 3140, name: "\u5f20\u9ed8" }, { id: 4389, name: "\u5371\u7b11" }, { id: 4896, name: "\u674e\u9759" }, { id: 6026, name: "\u767d\u51b0" }, { id: 6031, name: "\u5468\u97f5" }, { id: 6305, name: "\u82d7\u5703" }, { id: 7687, name: "\u8d75\u94ed" }, { id: 8092, name: "\u674e\u9759" }, { id: 10315, name: "\u5218\u5609\u73b2" }, { id: 11692, name: "\u5468\u6da6\u53d1" }, { id: 13654, name: "\u59dc\u6587" }, { id: 14809, name: "\u51af\u5c0f\u521a" }, { id: 18785, name: "\u5371\u7b11" }], director: [{ id: 628, name: "\u59dc\u6587" }, { id: 13654, name: "\u59dc\u6587" }] } }
        // onOk(dataa.data)
        // return
        loading.show("查询中...")
        videoWebQueryApi_2({ link: selectItem.link }).then((res: any) => {
            onOk(res.data)
            loading.hide();
        }).catch(() => {
            loading.hide();
        })
    }
    const onCancel = () => {
        onHide();
    }

    const onSelect = (val, index) => {
        setSelectIndex(index)
        setSelectItem(val)
    }

    const renderList = dataSource.map((val, index) => {
        return (
            <React.Fragment key={`key_${index}`}>
                <Space
                    size={[20, 10]}
                    align="start"
                    onClick={() => onSelect(val, index)}
                    style={{ width: '100%', margin: '5px 0px', backgroundColor: selectIndex == index ? "#eee" : "#fff" }}>
                    <Image style={{ display: 'inline-block' }} placeholder src={val.cover_image_url} width={100} height={146} />
                    <Row>
                        <Col span={24}>{`名称：${val.title}`}</Col>
                        <Col span={24}>{`演员：${val.actors}`}</Col>
                        <Col span={24}>{`标签：${val.attr}`}</Col>
                    </Row>
                </Space>
            </React.Fragment>
        )
    })

    const footerNode = (
        <Space size={[20, 10]}>
            <Button type="primary" disabled={!selectItem} onClick={onConfirm}>确认</Button>
            <Button onClick={onCancel}>取消</Button>
        </Space>
    )

    return (
        <Modal
            centered
            closable={false}
            title={<div style={{ textAlign: 'center' }}>搜索结果</div>}
            visible
            width={800}
            destroyOnClose
            footer={footerNode}>
            <Card style={{ minHeight: 100, border: 0 }} bodyStyle={{ padding: 0 }}>
                {
                    (renderList && renderList.length > 0)
                    && <List size="small" dataSource={renderList} renderItem={(item) => item} style={{ maxHeight: 500, overflowY: 'auto' }} />
                }
            </Card>
        </Modal>
    )
}

type AddStarModalPropType = {
    title: string
    onHide: () => void
    onOk: (v) => void
    onEdit: (v, type) => void
    type: string
}
export const AddStarModal = (props: AddStarModalPropType) => {
    const { title, onHide, onOk, onEdit, type } = props
    const [inputVal, setInputVal] = useState('');
    const [queryData, setQueryData] = useState([]);
    const [canSearch, setCanSearch] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const onConfirm = () => {
    }
    const onCancel = () => {
        onHide();
    }

    const onInputChange = () => {
        setCanSearch(false)
    }

    const onQuery = (v) => {
        if (!v) return
        setIsSearch(false)
        loading.show("查询中...");
        setInputVal(v)
        searchActorApi_2({ keywords: v }).then((res: any) => {
            if (res.data && res.data.length > 0) {
                setCanSearch(false)
                setQueryData(res.data)
            } else {
                setCanSearch(true)
                setQueryData([])
            }
            loading.hide();
        }).catch(() => {
            loading.hide();
        })
    }

    const onSearch = () => {
        loading.show("搜索中...")
        setIsSearch(true)
        searchActorInfoApi_2({ star_name: inputVal }).then((res: any) => {
            setCanSearch(false)
            setQueryData([res.data])
            loading.hide();
        }).catch(() => {
            loading.hide();
        })
    }

    const onSelect = (val) => {
        onOk({ key: val.id, label: val.zh_name, value: val.id })
    };

    const onEditStar = (v) => {
        onEdit(v, type)
    };

    const renderList = queryData.map((val, index) => {
        return (
            <React.Fragment key={val.id || `key_${index}`}>
                <Row justify="space-between" align="middle" style={{ margin: '5px 0px', padding: '0px 4px', backgroundColor: "#eee" }}>
                    {
                        val.avatar
                        && (
                            <Col>
                                <Image style={{ display: 'inline-block' }} src={val.avatar} width={40} />
                            </Col>
                        )
                    }
                    <Col>
                        <Text style={{ margin: 0, padding: '4px 0' }}>
                            {`${val.zh_name}${val.en_name ? `（${val.en_name}）` : ''}${val.gender ? `${val.gender}` == '1' ? '（男）' : '（女）' : ''}`}
                        </Text>
                    </Col>
                    <Col>
                        {isSearch
                            ? <Button type="link" size="small" onClick={() => { onEditStar(val) }}>选中编辑</Button>
                            : <Button type="link" size="small" onClick={() => { onSelect(val) }}>选中</Button>}
                    </Col>
                </Row>
            </React.Fragment>
        )
    })

    const footerNode = (
        <Space size={[20, 10]}>
            {/* <Button type="primary" onClick={onConfirm}>保存</Button> */}
            <Button onClick={onCancel}>取消</Button>
        </Space>
    )

    return (
        <Modal
            centered
            closable={false}
            title={<div style={{ textAlign: 'center' }}>{title}</div>}
            visible
            width={450}
            destroyOnClose
            footer={footerNode}>
            <Card style={{ minHeight: 100, maxHeight: 400, border: 0 }} bodyStyle={{ padding: 0 }}>
                <Space style={{ width: '100%' }} direction="vertical">
                    <Search enterButton="查询" onSearch={onQuery} allowClear onChange={onInputChange} />
                    {
                        (renderList && renderList.length > 0)
                        && <List size="small" dataSource={renderList} renderItem={(item) => item} style={{ maxHeight: 300, overflowY: 'auto' }} />
                    }
                    {
                        canSearch && (
                            <Button type="link" size="small" onClick={onSearch}>查无数据，点击搜索</Button>
                        )
                    }
                </Space>
            </Card>
        </Modal>
    )
}

type EditStarModalPropType = {
    params: any
    type: string
    onHide: () => void
    onOk: (v, type) => void
}
export const EditStarModal = (props: EditStarModalPropType) => {
    const [form] = Form.useForm();
    const { params, type, onHide, onOk } = props
    const [genderOp, setGenderOp] = useState([]);
    const [constellationOp, setConstellationOp] = useState([]);
    const [introduction, setIntroduction] = useState(params?.introduction || '');

    const onConfirm = () => {
        form.validateFields().then((v: any) => {
            if (v.avatar.some((v) => v.status == "uploading")) {
                message.warn('请等待图片上传完成');
                return;
            }
            loading.show()
            let head = ''
            if (v.avatar && v.avatar.length) {
                head = v.avatar[0].url
            }
            const data = {
                avatar: head,
                zh_name: v.zh_name,
                en_name: v.en_name,
                gender: v.gender,
                birthday: momentToTime(v.birthday, 'YYYY-MM-DD'),
                height: v.height,
                weight: v.weight,
                constellation: v.constellation,
                introduction: v.introduction,
                birthplace: params.birthplace,
                graduated_from: params.graduated_from,
                occupation: params.occupation,
                example: params.example,
                blood_type: params.blood_type
            }
            postActorAddApi_2(data).then((res: any) => {
                onOk({ key: res.data.id, label: res.data.zh_name, value: res.data.id }, type)
                loading.hide();
            }).catch(() => {
                loading.hide();
            });
        })
    }
    const onCancel = () => {
        onHide();
    }

    const handleChangeContent = (value: string) => {
        form.setFieldsValue({ introduction: value })
    }

    const footerNode = (
        <Space size={[20, 10]}>
            <Button type="primary" onClick={onConfirm}>确认并入库</Button>
            <Button onClick={onCancel}>取消</Button>
        </Space>
    )

    useEffect(() => {
        getActorOpApi_2().then((res: any) => {
            setGenderOp(res.data.genders)
            setConstellationOp(res.data.constellation)
        }).catch(() => {

        });
    }, [])

    return (
        <Modal
            centered
            closable={false}
            title={<div style={{ textAlign: 'center' }}>编辑信息</div>}
            visible
            width={1000}
            destroyOnClose
            footer={footerNode}>
            <Card style={{ maxHeight: 500, overflowY: 'auto', border: 0, padding: 0 }} bodyStyle={{ padding: 10 }}>
                <Form labelCol={{ span: 3 }} form={form} preserve={false}>
                    <Form.Item label="头像" name="avatar" rules={[{ required: true, message: '请上传头像' }]} initialValue={params?.avatar}>
                        <ImgUploader
                            label="上传"
                            file_type="pic"
                            category="actorHead"
                            maxCount={1} />
                    </Form.Item>
                    <Row>
                        <Col span={12}>
                            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="中文名" name="zh_name" rules={[{ required: true, message: '请输入中文名!' }]} initialValue={params?.zh_name}>
                                <Input allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="别名" name="en_name" initialValue={params?.en_name}>
                                <Input allowClear />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="性别" name="gender" rules={[{ required: true, message: '请选择性别!' }]} initialValue={Number(params?.gender) || null}>
                                <Select allowClear>
                                    {
                                        genderOp.map((status) => (
                                            <Select.Option value={status.value} key={status.value}>
                                                {status.text}
                                            </Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="生日" name="birthday" initialValue={timeToMoment(params?.birthday)}>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="身高" name="height" initialValue={params?.height}>
                                <Input type="number" min={0} allowClear addonAfter="cm" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="体重" name="weight" initialValue={params?.weight}>
                                <Input type="number" min={0} allowClear addonAfter="kg" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="星座" name="constellation" initialValue={params?.constellation}>
                                <Select allowClear>
                                    {
                                        constellationOp.map((status) => (
                                            <Select.Option value={status.value} key={status.value}>
                                                {status.text}
                                            </Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="影人简介">
                                <RichTextEditor
                                    category="agreement"
                                    content={introduction}
                                    onChange={handleChangeContent} />
                            </Form.Item>
                            <Form.Item labelCol={{ span: 3 }} name="introduction" initialValue={params?.introduction}>
                                <Input.TextArea allowClear autoSize={{ minRows: 3, maxRows: 10 }} style={{ display: 'none' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </Modal>
    )
}
