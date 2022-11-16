import { STATUS } from '@/constants/video2'
import { updateAppAnnouncementApi_2 } from '@/request/api/video_2/config'
import { AppAnnouncementBaseData } from '@/type'
import { Form, Input, InputNumber, message, Modal, Switch } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { useState } from 'react'

type Props = {
    visible: boolean,
    initDataSource: AppAnnouncementBaseData,
    onCancel: () => void,
    onOk: () => void
}

function AddModal({visible, initDataSource,  onCancel, onOk }: Props){

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
            let res:any = await updateAppAnnouncementApi_2(params)
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
                <Form.Item label='内容' name='content' rules={[{ required: true, message: '请输入公告内容' }]}>
                    <TextArea placeholder='请填写公告内容' autoSize={{ minRows: 3, maxRows: 5 }}/>
                </Form.Item>
                <Form.Item label='是否启用' name='status'>
                    <Switch onChange={onChange} checked={isStatusOn == STATUS.ON}/>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AddModal