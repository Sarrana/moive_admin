import {
  Modal,
  Space,
  Form,
  Input,
  Button,
  message,
  Select,
  Upload
} from 'antd'
import {
  event,
  formatDuration,
  formatResolution,
  momentToTime,
  uploadUrlFormatter
} from '@/utils'
import { costOp, DramaInfo, _OptionType } from '@/type'
import { postDramaAddApi_2, postDramaEditApi_2 } from '@/request'
import { useState } from 'react'

type modalPropType = {
  show: boolean
  params: any
  id: any
  category: any
  definitionArr: _OptionType[]
  onOk: () => void
  onCancel: () => void
}

export const VideoNewContentDramaModal = (props: modalPropType) => {
  let params: DramaInfo = props.params

  let isEdit = Object.keys(params).length > 0

  const title = isEdit ? '编辑内容' : '新增内容'
  const [free, setFree] = useState(params.is_free ? Number(params.is_free) : 1)
  const [videoUrl, setVideoUrl] = useState(params.url || '')
  const [duration, setDuration] = useState(params.duration || '')
  const [resData, setResdata] = useState(null)
  const [isUpload, setIsUpload] = useState(false)
  const [resolution, setResolution] = useState(params.resolution || '')

  const [form] = Form.useForm()
  const resolutionList = [
    { id: 1, value: '标清' },
    { id: 2, value: '高清' },
    { id: 3, value: '超清' },
    { id: 4, value: '2K' },
    { id: 5, value: '4K' }
  ]
  const onFreeChange = v => {
    setFree(v)
  }
 const onResolutionChange = v => {
    setResolution(v)
  }
  const [fileList, setFileList] = useState([])
  const videoRule = {
    required: true,
    message: '请上传视频文件',
    validator: (rule, value) =>
      new Promise((resolve, reject) => {
        if (isEdit) {
          if (value && value.fileList.length) {
            resolve(null)
          } else {
            videoUrl && videoUrl.length ? resolve(null) : reject()
          }
        } else {
          value && value.fileList.length ? resolve(null) : reject()
        }
      })
  }

  const onCancel = () => {
    props.onCancel()
  }
  const onConfirm = () => {
    form
      .validateFields()
      .then(v => {
        if (props.params.isEdit) {
          postDramaEditApi_2(props.params.id, {
            ...props.params,
            episode: v.ep,
            amount: v.amount,
            isEdit: false,
            is_free: v.isFree,
            vid: props.id,
            name: v.epname,
            url: v.url,
            duration: v.duration,
            resolution: v.resolution
          }).then((res: any) => {
            message.success('修改成功')
            event.emit('refreshDramaList')
          })
        } else {
          postDramaAddApi_2({
            episode: v.ep,
            amount: v.amount,
            isEdit: false,
            is_free: v.isFree,
            name: v.epname,
            url: v.url,
            vid: props.id,
            duration: v.duration,
            resolution: v.resolution
          }).then((res: any) => {
            console.log(res)
            message.success('添加成功')
            event.emit('refreshDramaList')
          })
        }
        props.onCancel()
      })
      .catch(errorInfo => {
        console.error('errorInfo ...', errorInfo)
      })
  }

  const footerNode = (
    <Space size={[20, 10]}>
      <Button type="primary" onClick={onConfirm}>
        保存
      </Button>
      <Button onClick={onCancel}>取消</Button>
    </Space>
  )

  return (
    <Modal
      centered
      closable={false}
      title={<div style={{ textAlign: 'center' }}>{title}</div>}
      visible={props.show}
      width={600}
      destroyOnClose
      footer={footerNode}
    >
      <Form labelCol={{ span: 4 }} form={form} preserve={false}>
        <Form.Item
          label="剧集显示"
          name="epname"
          rules={[{ required: true, message: '填写剧集具体第几集' }]}
          initialValue={params.name}
        >
          <Input
            min={1}
            style={{ width: 200 }}
            placeholder="显示剧集具体第几集"
          />
        </Form.Item>
        <Form.Item
          label="剧集编号"
          name="ep"
          rules={[{ required: true, message: '请输入剧集编号' }]}
          initialValue={params.episode}
        >
          <Input
            type="number"
            style={{ width: 200 }}
            placeholder="请输入剧集编号"
          />
        </Form.Item>
        <Form.Item
          label="视频地址"
          name="url"
          rules={[{ required: true, message: '请输入视频地址' }]}
          initialValue={params.url}
        >
          <Input
            type="text"
            style={{ width: 200 }}
            placeholder="请输入视频地址"
          />
        </Form.Item>
        <Form.Item
          label="剧集时长"
          name="duration"
          rules={[{ required: true, message: '请输入剧集时长(秒)' }]}
          initialValue={params.duration.toString()}
        >
          <Input style={{ width: 200 }} placeholder="请输入剧集时长(秒)" />
        </Form.Item>
        <Form.Item
          label="分辨率"
          name="resolution"
          rules={[{ required: true, message: '请输入分辨率' }]}
          initialValue={params.resolution}
        >
          <Select style={{ width: 100 }} onChange={onResolutionChange}>
            {resolutionList.map(status => (
              <Select.Option value={status.value} key={status.value}>
                {status.value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="付费状态">
          <Form.Item
            name="isFree"
            initialValue={free}
            style={{ display: 'inline-block', margin: 0 }}
            rules={[{ required: true, message: '选择付费状态' }]}
          >
            <Select style={{ width: 100 }} onChange={onFreeChange}>
              {costOp.map(status => (
                <Select.Option value={status.id} key={status.value}>
                  {status.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {free != 1 ? (
            <Form.Item
              name="amount"
              initialValue={params.amount || ''}
              style={{ display: 'inline-block', width: 100, margin: 0 }}
              rules={[{ required: true, message: '填写付费积分' }]}
            >
              <Input
                type="number"
                style={{ width: 100 }}
                placeholder="付费积分"
              />
            </Form.Item>
          ) : null}
        </Form.Item>
      </Form>
    </Modal>
  )
}
