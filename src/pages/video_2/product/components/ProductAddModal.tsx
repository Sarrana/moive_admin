import { ImgUploader } from '@/components/upload/ImgUploader'
import { STATUS, VIPTYPE } from '@/constants/video2'
import { updateProductApi_2 } from '@/request/api/video_2/product'
import { ProductBasedata, productTypeOP, productVipLevelOP } from '@/type'
import { Card, Col, Form, Input, InputNumber, message, Modal, Row, Select, Space, Switch, Tree } from 'antd'
import Item from 'antd/lib/list/Item'
import { DataNode } from 'antd/lib/tree'
import { useEffect, useState } from 'react'

type Props = {
    visible: boolean,
    initDataSource: ProductBasedata,
    treeData: DataNode[],
    initCheckedKeys: string[],
    onCancel: () => void,
    onOk: () => void
}

function ProductAddModal({ visible, initDataSource, treeData, initCheckedKeys, onCancel, onOk }: Props) {
    const [selType, setSelType] = useState(initDataSource.type || null)
    const [isStatusOn, setIsStatusOn] = useState<string>(initDataSource.status || STATUS.OFF)
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(initCheckedKeys || []);
  
    const [form] = Form.useForm()

    useEffect(() => {
        console.log(initDataSource);
    }, [])

    const onCheck = (checkedKeysValue: React.Key[]) => {
        console.log('onCheck', checkedKeysValue);
        setCheckedKeys(checkedKeysValue);
    };

    const onChange = (checked: boolean) => {
        console.log('onChange', checked);
        const isStatusOn = checked ? STATUS.ON : STATUS.OFF
        setIsStatusOn(isStatusOn)
    }

    const changeSelectType = (value) => {
        console.log(value);

        setSelType(value)
    }

    const onFinish = async () => {
        let values = await form.validateFields()
        console.log('------ values -----');
        console.log(values);
        if (values.img.some((v) => v.status == "uploading")) {
            message.warn('请等待图片上传完成');
            return;
        }
        let imgUrl = ''
        if (values.img && values.img.length) {
            imgUrl = values.img[0].url
        }
        let params = JSON.parse(JSON.stringify(values))
        params.img = imgUrl
        params.status = isStatusOn
        !params.coins && (params.coins = 0)
        if (initDataSource.id !== null) {
            params.id = initDataSource.id
        }
        console.log(params);
        submitProductPay()
        try {
            let res: any = await updateProductApi_2(params)
            if (res.code == 200) {
                message.success('操作成功')
                onOk()
            } else {
                message.error(res.message || '请稍后重试')
            }
        } catch (err) {
            message.error(err.message)
        }
    }

    const submitProductPay = async () => {
        console.log(checkedKeys);
        
        let params = {
            id: 1,           // 添加可以不传。修改必传
            product_id: 1,
            type_id: 1,
            way_id: 2
        }
        
        for (const item of checkedKeys) {
            
        }
        /**
         * 先获取全部
         * 
         * 已有 pid 修改
         *  - 多个？ 
         * 
         * 没有 pid 添加
         *  - 每条数据添加一个
         * 
         * 现在没有 之前有 删除
         * 
         */
        // let res = await updateProductApi_2(params)
    }

    return (
        <Modal
            width={620}
            title={initDataSource.id !== null ? '编辑' : '创建'}
            visible={visible}
            onCancel={onCancel}
            onOk={onFinish}
        >
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 22 }}
                initialValues={initDataSource}
                form={form}
            >
                <Form.Item label='图片' name='img' rules={[{ required: true, message: '请上传图片' }]}>
                    <ImgUploader
                        label='上传'
                        file_type='pic'
                        category='video_poster'
                        maxCount={1}
                    />
                </Form.Item>
                <Row>
                    <Col span={12}>
                        <Form.Item labelCol={{ span: 8 }} label='标题' name='title' rules={[{ required: true, message: '请输入标题' }]}>
                            <Input placeholder='请填写标题' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item labelCol={{ span: 8 }} label='描述' name='description' rules={[{ required: true, message: '请输入描述' }]}>
                            <Input placeholder='请填写描述' />
                        </Form.Item>
                    </Col>
                </Row>


                <Form.Item label='类型' name='type' rules={[{ required: true, message: '请选择VIP类型' }]}>
                    <Select onSelect={changeSelectType}>
                        {
                            productTypeOP.map(item => (
                                <Select.Option value={item.value} key={item.value}>
                                    {item.label}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                {
                    selType == VIPTYPE.VIP
                    && <Row>
                        <Col span={12}>
                            <Form.Item labelCol={{ span: 8 }} label='vip等级' name='vip_level' rules={[{ required: true, message: '请选择VIP类型' }]}>
                                <Select>
                                    {
                                        productVipLevelOP.map(item => (
                                            <Select.Option value={item.value} key={item.value}>
                                                {item.label}
                                            </Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item labelCol={{ span: 8 }} label='vip天数' name='vip_day'>
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                }
                {
                    selType == VIPTYPE.COIN
                    && <Form.Item label='金币数量' name='coins' rules={[{ required: true, message: '请输入金币数量' }]}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                }

                <Row >
                    <Col span={12}>
                        <Form.Item labelCol={{ span: 8 }} label="原价" name='price' rules={[{ required: true, message: '请输入产品原价' }]}>
                            <InputNumber style={{ width: '100%' }} min={1} placeholder='请输入原价' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item labelCol={{ span: 8 }} label='购买价格' name='buy_price' rules={[{ required: true, message: '请输入产品现价' }]}>
                            <InputNumber style={{ width: '100%' }} min={1} placeholder='请输入购买价格' />
                        </Form.Item>
                    </Col>
                </Row>
                {/* <Form.Item label='支付方式'>
                    <Tree
                        checkable
                        defaultExpandAll
                        onCheck={onCheck}
                        checkedKeys={checkedKeys}
                        treeData={treeData}
                    />
                </Form.Item> */}
                <Form.Item label='排序' name='sort' rules={[{ required: true, message: '请输入排序' }]}>
                    <InputNumber style={{ width: '100%' }} min={1} placeholder='请输入数字排序' />
                </Form.Item>
                <Form.Item label='是否上架' name='status'>
                    <Switch onChange={onChange} checked={isStatusOn == STATUS.ON} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ProductAddModal