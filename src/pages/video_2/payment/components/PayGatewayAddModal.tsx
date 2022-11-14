import { ImgUploader } from '@/components/upload'
import { STATUS } from '@/constants/video2'
import { updatePayGatewayApi_2 } from '@/request/api/video_2/payway'
import { PayGatewayBasedata } from '@/type'
import { Form, Input, InputNumber, message, Modal, Switch } from 'antd'
import { useState } from 'react'

type Props = {
    visible: boolean,
    initDataSource: PayGatewayBasedata,
    onCancel: () => void,
    onOk: () => void
}

function PayGatewayAddModal({visible, initDataSource,  onCancel, onOk }: Props){

    const [isStatusOn, setIsStatusOn] = useState<string>(initDataSource.status)
    const [form] = Form.useForm()

    const onChange = (checked: boolean) => {
        console.log('onChange', checked);
        const isStatusOn = checked ? STATUS.ON : STATUS.OFF
        setIsStatusOn(isStatusOn)
    }

    const onFinish = async () => {
        let values = await form.validateFields()
        console.log(values);
        if (values.img_url.some((v) => v.status == "uploading")) {
            message.warn('请等待图片上传完成');
            return;
        }
        let imgUrl = ''
        if (values.img_url && values.img_url.length) {
            imgUrl = values.img_url[0].url
        }

        
        let params = JSON.parse(JSON.stringify(values))
        params.img_url = imgUrl
        params.status = isStatusOn
        
        if (initDataSource.id !== null) {
            params.id = initDataSource.id
        }
        try {
            let res:any = await updatePayGatewayApi_2(params)
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
                labelCol={{span: 5}}
                initialValues={initDataSource}
                form={form}
            >
                <Form.Item label='图标' name='img_url' rules={[{ required: true, message: '请上传图标' }]}>
                    <ImgUploader 
                        label='上传'
                        file_type='pic'
                        category='video_poster'
                        maxCount={1}
                    />
                </Form.Item>
                <Form.Item label='channel' name='channel' rules={[{ required: true, message: '请输入channel' }]}>
                    <Input placeholder='请填写channel' />
                </Form.Item>
                <Form.Item label='名称' name='name' rules={[{ required: true, message: '请输入名称' }]}>
                    <Input placeholder='请填写名称' />
                </Form.Item>

                <Form.Item label='排序' name='order' rules={[{ required: true, message: '请输入排序' }]}>
                    <InputNumber style={{width: '100%'}}  min={1} placeholder='请输入数字排序'/>
                </Form.Item>
                <Form.Item label='是否启用' name='status'>
                    <Switch onChange={onChange} checked={isStatusOn == STATUS.ON}/>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default PayGatewayAddModal