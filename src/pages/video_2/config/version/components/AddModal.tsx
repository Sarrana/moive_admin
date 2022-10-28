import { updateVersionSaveApi_2 } from '@/request'
import { versionOSOP } from '@/type'
import { Form, Input, message, Modal, Select, Switch } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import React, { useEffect, useState } from 'react'

/* 
mobile_os:android | ios | all
version_sn: 1.0.1
description:啊哈哈  
package_url:www.baidu.com/a.apk
is_force_update:T | F   
*/           // T 强制更新  F 不强制更新

enum FORCEUPDATE {
    YES = 'T',
    NO = 'F'
}

type BaseDataType = {
    id: number
    name: string
    mobile_os: string
    version_sn: string
    description: string
    package_url: string
    is_force_update: string
}




type Props = {
    visible: boolean,
    dataSource : BaseDataType,
    handleCancel: () => void,
    handleOk: () => void
}

function AddModal({ visible, dataSource, handleCancel, handleOk }: Props) {
    const [form] = Form.useForm()
    const [status, setStatus] = useState(dataSource.is_force_update)
    // const [params, setParams] = useState<BaseDataType>({
    //     id: 1,
    //     name: '',
    //     mobile_os: 'string',
    //     version_sn: 'string',
    //     description: 'string',
    //     package_url: 'string',
    //     is_force_update: 'string',
    // })

    useEffect(() => {
      console.log(dataSource);
    }, [])
    

    const onFinish =  (values) => {
        form.validateFields().then( async values =>  {
            let params = JSON.parse(JSON.stringify(values))
            if (dataSource.id) {
                params.id = dataSource.id
            }
            try {
                let res:any = await updateVersionSaveApi_2(params)
                if (res.code == 200) {
                    message.success('操作成功')
                }
                handleOk()
            } catch (err) {
                message.error(err.message)
            } 
            
        })
        
    }

    const changeStatus = (e:boolean) => {
        console.log(e);
        const is_force_update = e ? FORCEUPDATE.YES : FORCEUPDATE.NO
        setStatus(is_force_update)
    }

    return (
        <Modal
            onCancel={handleCancel}
            onOk={onFinish}
            visible={visible}
            title={dataSource.id ? '编辑' : '创建'}
        >
            <Form
                initialValues={dataSource || {}}
                labelCol={{ span: 5 }}
                form={form}
            >
                <Form.Item label='更新平台' name='mobile_os' rules={[{required: true, message: '请选择要更新的平台'}]}>
                    <Select placeholder='请选择要更新的平台'>
                        {
                            versionOSOP.map(item => (
                                <Select.Option value={item.value} key={item.id}>
                                    {item.label}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item label='版本' name='version_sn' rules={[{required: true, message: '请输入版本号'}]}>
                    <Input placeholder='请输入版本号' />
                </Form.Item>
                <Form.Item label='描述' name='description' rules={[{required: true, message: '请输入更新描述'}]}>
                    <TextArea placeholder='请输入更新描述' autoSize={{minRows: 2, maxRows: 6}} />
                </Form.Item>
                <Form.Item label='安装包地址' name='package_url' rules={[{required: true, message: '请填写安装包地址'}]}>
                    <Input placeholder='请输入安装包地址' />
                </Form.Item>
                <Form.Item label='强制更新' name='is_force_update'>
                    <Switch onClick={e => changeStatus(e)} checked={status == FORCEUPDATE.YES}/>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AddModal