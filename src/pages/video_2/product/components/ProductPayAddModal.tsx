import { ImgUploader } from '@/components/upload'
import { STATUS } from '@/constants/video2'
import { updateProductPayApi_2 } from '@/request/api/video_2/product'
import { PayGatewayBasedata, PayTypeBasedata, ProductBasedata, ProductPayBasedata, productVipLevelOP } from '@/type'
import { Form, Input, InputNumber, message, Modal, Select, Switch } from 'antd'
import { useState } from 'react'

type Props = {
    visible: boolean,
    initDataSource: ProductPayBasedata,
    onCancel: () => void,
    onOk: () => void,
    payTypeList: PayTypeBasedata[],
    payGatewayList: PayGatewayBasedata[],
    productList: ProductBasedata[]
}

function ProductPayAddModal({ visible, initDataSource, onCancel, onOk, payTypeList, payGatewayList, productList }: Props) {

    const [form] = Form.useForm()


    const onFinish = async () => {
        let values = await form.validateFields()
        console.log(values);
        let params = JSON.parse(JSON.stringify(values))

        if (initDataSource.id !== null) {
            params.id = initDataSource.id
        }

        
        try {
            let res: any = await updateProductPayApi_2(params)
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

    return (
        <Modal
            title={initDataSource.id !== null ? '编辑' : '创建'}
            visible={visible}
            onCancel={onCancel}
            onOk={onFinish}
        >
            <Form
                labelCol={{ span: 5 }}
                initialValues={initDataSource}
                form={form}
            >
                <Form.Item label='产品' name='product_id' rules={[{ required: true, message: '请选择产品' }]}>
                    <Select>
                        {
                            productList.map(item => (
                                <Select.Option value={item.id} key={item.id}>
                                    {item.id}: {item.title}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item label='支付类型' name='type_id' rules={[{ required: true, message: '请选择支付类型' }]}>
                    <Select>
                        {
                            payTypeList.map(item => (
                                <Select.Option value={item.id} key={item.id}>
                                    {item.id}: {item.ch_name}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item label='支付网关' name='way_id' rules={[{ required: true, message: '请选择支付网关' }]}>
                    <Select>
                        {
                            payGatewayList.map(item => (
                                <Select.Option value={item.id} key={item.id}>
                                    {item.id}: {item.name}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ProductPayAddModal