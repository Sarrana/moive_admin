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

export const VideoContentDramaModal = (props: modalPropType) => {
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

  const onFreeChange = v => {
    setFree(v)
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
  const uploadOption = {
    action: '',
    accept: 'video/mp4',
    listType: 'text',
    maxCount: 1,
    fileList: fileList,
    showUploadList: true,
    onRemove: () => {
      location.reload()
    },
    customRequest: e => {
      form.validateFields().then(v => {
        const file = v.video?.fileList[0]
        if (v.video && file) {
          let data: any = {
            isEdit,
            did: params.id,
            vid: props.id,
            episode: v.ep,
            name: v.epname,
            is_free: v.isFree,
            amount: v.amount
          }
          if (v.publish == 2)
            data.timingtime = momentToTime(v.timingtime, 'YYYY-MM-DD HH:mm')
          if (isEdit) {
            if (params.release_status == 2) data.release = v.publish
          } else {
            data.release = v.publish
          }
          event.emit('addTask', {
            url: uploadUrlFormatter(`/api/admin/upload_test`),
            file: file.originFileObj,
            sendParams: { category: props.category },
            params: data,
            getProgress: e => {
              let newFileList = fileList
              newFileList[0].percent = e.percent
              setFileList([...newFileList])
            },
            addFun: (status, msg?) => {
              if (status == 'success') {
              } else {
                msg && message.warn(msg)
              }
            },
            uploadFun: (res: { url: string; mediaInfo: any; params: any }) => {
              setResdata(res)
              fileList[0].status = 'success'
              setFileList([...fileList])
              setIsUpload(true)
            }
          })
        }
      })
    },
    beforeUpload: file => {
      const canUp = file.type == 'video/mp4'
      if (!canUp) {
        message.error('只能上传 mp4 文件!')
      }
      return canUp
    },
    onChange: e => {
      setFileList([...e.fileList])
      if (e.file.status == 'uploading') {
        setVideoUrl('')
      } else if (e.file.status == 'removed') {
        setVideoUrl(params.url || '')
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068'
      },
      strokeWidth: 3,
      format: percent => percent && `${parseFloat(percent.toFixed(2))}%`
    }
  }

  const onCancel = () => {
    props.onCancel()
    location.reload()
  }
  const onConfirm = () => {
    form
      .validateFields()
      .then(v => {
        const file = v.video?.fileList[0]
        if (v.video && file) {
          if (!isUpload) {
            return message.warning('请等待视频上传完成再进行操作')
          }
          const res = resData
          const track = res.mediaInfo.media.track
          let fileDuration = '0'
          let resolution = ''
          if (track) {
            const fileWidth = track[1].Width
            const fileHeight = track[1].Height
            fileDuration = track[0].Duration
            resolution = formatResolution(fileWidth, fileHeight)
            console.log(
              'track >>> ',
              fileDuration,
              fileWidth,
              fileHeight,
              resolution
            )
          }

          if (res.params.isEdit) {
            postDramaEditApi_2(res.params.did, {
              ...res.params,
              url: res.url,
              duration: fileDuration,
              resolution: resolution
            }).then((res: any) => {
              message.success('修改成功')
              event.emit('refreshDramaList')
            })
          } else {
            postDramaAddApi_2({
              ...res.params,
              url: res.url,
              duration: fileDuration,
              resolution: resolution
            }).then((res: any) => {
              message.success('添加成功')
              event.emit('refreshDramaList')
            })
          }
          props.onCancel()
        } else {
          let data: any = {
            vid: props.id,
            episode: v.ep,
            url: videoUrl,
            duration: duration,
            resolution: resolution,
            name: v.epname,
            is_free: v.isFree,
            amount: v.amount
          }
          if (v.publish == 2)
            data.timingtime = momentToTime(v.timingtime, 'YYYY-MM-DD HH:mm')
          if (params.release_status == 2) data.release = v.publish
          postDramaEditApi_2(params.id, data).then((res: any) => {
            message.success('修改成功')
            props.onOk()
          })
        }
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
          <Input type="number" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="上传剧集" name="video" rules={[videoRule]}>
          {/* @ts-ignore */}
          <Upload {...uploadOption}>
            {fileList.length == 0 && <Button type="primary">上传</Button>}
          </Upload>
        </Form.Item>
        <Form.Item
          label="剧集时长"
          name="duration"
          initialValue={formatDuration(Number(params.duration))}
        >
          <Input style={{ width: 200 }} disabled />
        </Form.Item>
        <Form.Item
          label="分辨率"
          name="resolution"
          initialValue={params.resolution}
        >
          <Input style={{ width: 200 }} disabled />
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
