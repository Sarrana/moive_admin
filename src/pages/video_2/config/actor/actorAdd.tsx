import { Button, Space, Row, Col, Select, message, Card, Image, Form, Typography, Input, DatePicker } from 'antd'
import {
    postActorAddApi_2, postActorEditApi_2, getActorOpApi_2, searchActorInfoApi_2
} from '@/request'
import { momentToTime, timeToMoment } from '@/utils'
import { useLocation, useNavigate } from 'react-router-dom'
import { ImgUploader } from '@/components/upload'
import React, { useEffect, useState } from 'react'
import { RichTextEditor } from '@/components/editor'
import loading from '@/components/loading/Loading'

const { Title } = Typography;
const { Search } = Input;

export const ActorAdd: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params: any = location.state.data;
    const pageSize = location.state.pageSize;
    const currentPage = location.state.currentPage;
    const queryParam = location.state.queryParam;
    const isEdit = params !== null && params !== undefined
    console.log('ActorAdd   ', params)
    const [genderOp, setGenderOp] = useState([]);
    const [constellationOp, setConstellationOp] = useState([]);
    const [bloodTypeOp, setBloodTypeOp] = useState([]);
    const [baseInfo, setBaseInfo] = useState(null);
    const [introduction, setIntroduction] = useState(params?.introduction || '');

    const [form] = Form.useForm();

    const onBack = () => {
        navigate('/Video2/ConfigMgr/ActorMgr', { state: { currentPage, pageSize, queryParam }, replace: false });
    }
    const onCancel = () => {
        console.log("onCancel");
        form.resetFields();
        setIntroduction(params?.introduction || '')
    }
    const onFinish = (v: any) => {
        // console.log("onFinish", v, momentToTime(v.birthday), introduction);
        if (v.avatar.some((v) => v.status == "uploading")) {
            message.warn('请等待图片上传完成');
            return;
        }
        loading.show("请求中...");
        let head = ''
        if (v.avatar && v.avatar.length) {
            head = v.avatar[0].url
        }
        const data = {
            zh_name: v.zh_name,
            avatar: head,
            gender: v.gender,
            birthday: momentToTime(v.birthday, 'YYYY-MM-DD'),
            en_name: v.en_name,
            birthplace: v.birthplace,
            area: v.area,
            blood_type: v.blood_type,
            height: v.height,
            weight: v.weight,
            graduated_from: v.graduated_from,
            constellation: v.constellation,
            occupation: v.occupation,
            example: v.example,
            introduction: v.introduction,
            seo_keywords: v.seo_keywords
        }
        console.log("onFinish", data);
        if (isEdit) {
            postActorEditApi_2(params.id, data).then((res: any) => {
                message.success('修改成功');
                loading.hide();
            }).catch(() => {
                loading.hide();
            });
        } else {
            postActorAddApi_2(data).then((res: any) => {
                message.success('添加成功');
                loading.hide();
            }).catch(() => {
                loading.hide();
            });
        }
    }

    const onSearch = (v) => {
        if (!v) return
        loading.show("搜索中...")
        searchActorInfoApi_2({ star_name: v }).then((res: any) => {
            // console.log(111111111, res)
            setBaseInfo(res.data)
            for (const key in res.data) {
                const element = res.data[key]
                if (key == 'birthday') {
                    form.setFieldsValue({ [key]: timeToMoment(element || null, 'YYYY-MM-DD') })
                } else {
                    form.setFieldsValue({ [key]: element || null })
                }
                if (key == 'introduction') {
                    setIntroduction(element || '')
                }
            }
            loading.hide();
        }).catch(() => {
            loading.hide();
        })
    }

    const handleChangeContent = (value: string) => {
        // console.log('ChangeContent', value)
        form.setFieldsValue({ introduction: value })
    }

    useEffect(() => {
        getActorOpApi_2().then((res: any) => {
            setGenderOp(res.data.genders)
            setConstellationOp(res.data.constellation)
            setBloodTypeOp(res.data.blood_types)
        }).catch(() => {

        });
    }, [])

    return (
        <Form labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} onFinish={onFinish} form={form} preserve={false}>
            <Space style={{ width: '100%' }} direction="vertical">
                <Row>
                    <Col span={24}>
                        <Card bodyStyle={{ padding: 18 }}>
                            <Row justify="space-between">
                                <Col>
                                    <Title level={5} style={{ margin: 0, padding: '4px 0' }}>明星资料</Title>
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
                    <Col span={24}>
                        <Card>
                            <Form.Item label="头像" name="avatar" rules={[{ required: true, message: '请上传头像' }]} initialValue={params?.avatar}>
                                <ImgUploader
                                    className="actor_mgr_modal"
                                    label="上传"
                                    file_type="pic"
                                    category="actorHead"
                                    maxCount={1} />
                            </Form.Item>
                            <Row>
                                <Col span={8}>
                                    <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="中文名" name="zh_name" rules={[{ required: true, message: '请输入中文名!' }]} initialValue={params?.zh_name}>
                                        {/* <Input allowClear /> */}
                                        <Search onSearch={onSearch} allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="别名" name="en_name" initialValue={params?.en_name}>
                                        <Input allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="生日" name="birthday" rules={[{ required: true, message: '请选择生日!' }]} initialValue={timeToMoment(params?.birthday)}>
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="出生地" name="birthplace" initialValue={params?.birthplace}>
                                        <Input allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="地区" name="area" initialValue={params?.area}>
                                        <Input allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
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
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="血型" name="blood_type" initialValue={params?.blood_type}>
                                        <Select allowClear>
                                            {
                                                bloodTypeOp.map((status) => (
                                                    <Select.Option value={status.value} key={status.value}>
                                                        {status.text}
                                                    </Select.Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="身高" name="height" initialValue={params?.height}>
                                        <Input type="number" min={0} allowClear addonAfter="cm" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="体重" name="weight" initialValue={params?.weight}>
                                        <Input type="number" min={0} allowClear addonAfter="kg" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="毕业院校" name="graduated_from" initialValue={params?.graduated_from}>
                                        <Input allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="职业" name="occupation" initialValue={params?.occupation}>
                                        <Input allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
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
                            <Form.Item label="代表作品" name="example" initialValue={params?.example}>
                                <Input allowClear placeholder='用 "、" 分开' value={baseInfo?.example || ''} />
                            </Form.Item>
                            <Form.Item label="SEO关键字" name="seo_keywords" initialValue={params?.seo_keywords}>
                                <Input allowClear placeholder='用 "、" 分开' />
                            </Form.Item>
                            <Form.Item label="影人简介">
                                <RichTextEditor
                                    category="agreement"
                                    content={introduction}
                                    onChange={handleChangeContent} />
                            </Form.Item>
                            <Form.Item name="introduction" initialValue={params?.introduction}>
                                <Input.TextArea allowClear autoSize={{ minRows: 3, maxRows: 10 }} style={{ display: 'none' }} />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>
            </Space>
        </Form>
    )
}
