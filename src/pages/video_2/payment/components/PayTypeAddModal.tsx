import { STATUS } from '@/constants/video2'
import { updatePayTypeApi_2 } from '@/request/api/video_2/payway'
import { PayTypeBasedata } from '@/type'
import { Form, Input, InputNumber, message, Modal, Switch } from 'antd'
import { useState } from 'react'

type Props = {
    visible: boolean,
    initDataSource: PayTypeBasedata,
    onCancel: () => void,
    onOk: () => void
}

function PayTypeAddModal({visible, initDataSource,  onCancel, onOk }: Props){

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
        let params = JSON.parse(JSON.stringify(values))
        params.status = isStatusOn
        if (initDataSource.id !== null) {
            params.id = initDataSource.id
        }
        try {
            let res:any = await updatePayTypeApi_2(params)
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
                <Form.Item label='名称' name='name' rules={[{ required: true, message: '请输入名称' }]}>
                    <Input placeholder='请填写name' />
                </Form.Item>
                <Form.Item label='中文名称' name='ch_name' rules={[{ required: true, message: '请输入中文名称' }]}>
                    <Input placeholder='请填写ch_name' />
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

export default PayTypeAddModal