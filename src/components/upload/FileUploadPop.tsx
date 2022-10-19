/* global MediaInfo */
import { concatArrayBuffer, event } from '@/utils'
import {
  DeleteOutlined,
  LoadingOutlined,
  PaperClipOutlined
} from '@ant-design/icons'
import { Row, Col, Modal, Progress, List, Empty } from 'antd'
import React from 'react'
import SparkMD5 from 'spark-md5'

const processEnv = import.meta.env

type FileUploadPopProps = {
  maxTask?: number
  maxActive?: number
}

type FileUploadPopState = {
  show: boolean
  active: string[]
  tasks: {}
}

type TaskParams = {
  url: string
  file: File
  params?: any
  sendParams?: { category: any }
  addFun: (status: string, msg?: string) => void
  uploadFun: (res: { url: string; mediaInfo: any; params: any }) => void
  getProgress: (e: any) => void
}

type TaskItemParams = {
  id: string
  state: { code: TaskState; msg: string }
  fileReader: FileReader
  fileDataArr: ArrayBuffer[]
  xhr: XMLHttpRequest
  progress: {
    total: number
    loaded: number
    percent: number
    speed: number
    startTime: number
  }
} & TaskParams

enum TaskState {
  Idle,
  Read,
  Upload,
  Fail,
  Success
}

export class FileUploadPop extends React.Component {
  readonly state: FileUploadPopState = { show: false, active: [], tasks: {} }

  declare readonly props: FileUploadPopProps

  private readSize = 10 * 1024 * 1024 // 10M 为单位

  private chunkSize = 10 * 1024 * 1024 // 10M 为单位

  componentDidMount() {
    event.addListener('addTask', this.addTasks)
    event.addListener('showUploadPop', this.showPop)
  }

  componentWillUnmount() {
    // console.log("卸载组件 FileUploadPop");
    event.removeListener('addTask', this.addTasks)
    event.removeListener('showUploadPop', this.showPop)
  }

  showPop = e => {
    this.updateState('show', e.show)
  }

  updateState = (key: string, value, id?) => {
    if (id) {
      let tasks = this.state.tasks
      let task: TaskItemParams = tasks[id]
      task[key] = value
      this.setState({ tasks: tasks })
    } else {
      let state = this.state
      state[key] = value
      this.setState({ ...state })
    }
  }

  getMaxTask = () =>
    this.props && this.props.maxTask ? Math.min(this.props.maxTask, 5) : 5

  getMaxActive = () =>
    this.props && this.props.maxActive ? Math.min(this.props.maxActive, 2) : 2

  addTasks = (e: TaskParams) => {
    let data: any = { ...e }
    if (this.state.active.length < this.getMaxTask()) {
      data.id = `${new Date().getTime()}`
      data.state = { code: TaskState.Idle, msg: '等待上传' }
      data.progress = {
        total: data.file.size,
        loaded: 0,
        percent: 0,
        speed: 0,
        startTime: 0
      }
      let tasks = this.state.tasks
      tasks[data.id] = data
      // console.log('addTasks', data);
      this.updateState('tasks', tasks)
      this.checkNextTask(e.getProgress)
      e.addFun && e.addFun('success')
    } else {
      e.addFun && e.addFun('fail', `允许最大上传任务数${this.getMaxTask()}`)
    }
  }

  checkNextTask = (getProgress: any) => {
    // console.log('checkNextTask', this.state, this.getMaxActive());
    if (this.state.active.length < this.getMaxActive()) {
      const tasks = this.state.tasks
      const id = Object.keys(tasks).find(
        key => tasks[key].state.code == TaskState.Idle
      )
      // console.log('checkNextTask', id);
      id && this.startTasks(id, getProgress)
    } else {
      //
    }
  }

  checkUploading = () => {
    const tasks = this.state.tasks
    const arr = Object.keys(tasks).filter(
      key =>
        tasks[key].state.code == TaskState.Upload ||
        tasks[key].state.code == TaskState.Read
    )
    // console.log('checkUploading', arr);
    event.emit('refreshUpIcon', !!(arr && arr.length))
  }

  delActive = taskId => {
    let active = this.state.active
    let index = active.indexOf(taskId)
    if (index > -1) {
      active.splice(index, 1)
      this.updateState('active', active)
    }
    this.checkUploading()
    this.checkNextTask(null)
  }

  startTasks = (taskId, getProgress) => {
    const state = this.state
    const task: TaskItemParams = state.tasks[taskId]
    const file = task.file
    console.log('文件信息', task.file)
    let active = state.active
    active.push(taskId)
    this.updateState('active', active)
    this.updateState(
      'state',
      { code: TaskState.Read, msg: '文件读取中' },
      taskId
    )
    this.checkUploading()
    this.readFile(file, taskId)
      .then(fileDataArr => {
        this.updateState('state', { code: TaskState.Upload, msg: '' }, taskId)
        const md5FileHash = SparkMD5.hash(
          `${file.lastModified}_${file.size}_${file.type}`
        ) // 文件的唯一标识
        // console.log('md5Hash', md5FileHash);
        let chunks = Math.ceil(file.size / this.chunkSize)
        let successFlag = 0
        let isFail = false
        let index = 0
        // console.log('chunks', chunks);

        let maxUploadNum = 3 // 最大尝试上传失败分片文件次数;
        let offset = 0
        let xhr = new XMLHttpRequest()
        this.updateState('xhr', xhr, taskId)
        xhr.onabort = e => {
          console.log('onabort', e)
        }
        xhr.onerror = e => {
          console.log('onerror', e)
          retry('上传失败')
        }
        xhr.ontimeout = e => {
          console.log('ontimeout', e)
          retry('请求超时')
        }
        xhr.onload = async e => {
          console.log('startTasks_onload', e)
          // @ts-ignore
          if (e.target.status == 200 && e.target.responseText) {
            console.log('startTasks_onload', 200)
            // @ts-ignore
            const response = JSON.parse(e.target.responseText)
            console.log('startTasks_onload response', response)
            if (Number(response.code) == 200) {
              successFlag += 1
              if (successFlag >= chunks) {
                if (response.data && response.data.video_upload) {
                  const t = await this.getMediainfo({
                    size: file.size,
                    chunkSize: this.readSize,
                    fileDataArr: fileDataArr
                  })
                  const task: TaskItemParams = this.state.tasks[taskId]
                  task.uploadFun &&
                    task.uploadFun({
                      url: `${processEnv.VITE_APP_UPLOAD_URL}/${response.data.video_upload}`,
                      mediaInfo: t,
                      params: task.params
                    })
                  this.updateState(
                    'state',
                    { code: TaskState.Success, msg: '上传完成' },
                    taskId
                  )
                  this.delActive(taskId)
                  console.log('startTasks_onload 上传完成 >>> ', response)
                } else {
                  fail(response.message ? response.message : '上传失败')
                  console.log('startTasks_onload', '上传失败1')
                }
              } else {
                index += 1
                sendData = getSendData(index)
                uploadChunkFunc()
              }
            } else {
              retry('上传失败')
              console.log('startTasks_onload', '上传失败2')
            }
          } else {
            console.log('startTasks_onload', '!200')
            retry('上传失败')
          }
        }
        if (xhr.upload) {
          xhr.upload.onprogress = e => {
            // console.log('onprogress', file.loaded, e);
            let progress = this.state.tasks[taskId].progress
            const lastTime = progress.startTime
            const lastSize = progress.loaded
            const nowTime = new Date().getTime()
            progress.loaded = Math.min(file.size, offset + e.loaded)
            progress.percent =
              file.size > 0
                ? Math.ceil((progress.loaded / file.size) * 100)
                : 100
            const speed = Math.ceil(
              (progress.loaded - lastSize) / ((nowTime - lastTime) / 1000)
            )
            progress.speed = speed
            progress.startTime = nowTime
            getProgress(progress)
            this.updateState('progress', progress, taskId)
          }
        }

        const fail = msg => {
          if (isFail) return
          isFail = true
          this.updateState('state', { code: TaskState.Fail, msg: msg }, taskId)
          this.delActive(taskId)
        }
        const getSendData = (i: number) => {
          offset = i * this.chunkSize
          const end =
            (i + 1) * this.chunkSize >= file.size
              ? file.size
              : (i + 1) * this.chunkSize
          let sectionData = new window.File(
            [file.slice(i * this.chunkSize, end)],
            file.name,
            { type: file.type }
          ) // 文件切片
          const formData = new FormData()
          formData.set('chunk', String(i))
          formData.set('chunks', String(chunks))
          formData.set('size', String(sectionData.size))
          formData.set('from', task.sendParams.category)
          formData.set('id', '1')
          formData.set('md5', md5FileHash)
          formData.set('lastModifiedDate', String(new Date().getTime()))
          formData.set('name', String(file.name))
          formData.set('type', String(file.type))
          formData.set('file', sectionData)
          return formData
        }
        const uploadChunkFunc = () => {
          // console.log('uploadChunkFunc', index);
          // for (var [a, b] of sendData.entries()) {
          //     console.log("sendData >>> ", a, b);
          // }
          xhr.open('post', task.url)
          const token = localStorage.getItem('token')
          if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`)
          }
          xhr.send(sendData)
        }
        const retry = msg => {
          // 上传失败，继续进行请求
          maxUploadNum -= 1
          if (maxUploadNum > 0) {
            uploadChunkFunc()
          } else {
            fail(msg)
          }
        }
        let sendData = getSendData(index)
        uploadChunkFunc()
      })
      .catch(e => {
        this.updateState(
          'state',
          { code: TaskState.Fail, msg: '文件读取失败' },
          taskId
        )
        this.delActive(taskId)
      })
  }

  sliceRead = (file, id, start: number, end: number) =>
    new Promise(res => {
      const fileReader = new FileReader()
      fileReader.onabort = e => {
        // console.log('onabort ', e);
        res(null)
      }
      fileReader.onerror = e => {
        console.log('onerror ', fileReader.error, e)
        res(null)
      }
      fileReader.onload = e => {
        // console.log('onload ', e);
        res(e.target.result)
      }
      // console.log('开始读取文件 ', start, end);
      fileReader.readAsArrayBuffer(file.slice(start, end))
      this.updateState('fileReader', fileReader, id)
    })

  readFile = (file, id) =>
    new Promise<ArrayBuffer[]>(async (resolve, reject) => {
      const size = file.size
      const reads = Math.ceil(size / this.readSize)
      // console.log('分段读取文件 ', reads, this.readSize);
      const arrays = []
      let b = false
      for (let index = 0; index < reads; index++) {
        const start = index * this.readSize
        const end = start + this.readSize
        let a = await this.sliceRead(file, id, start, end)
        if (!a) {
          b = true
          break
        }
        arrays.push(a)
      }
      b ? reject() : resolve(arrays)
    })

  getMediainfo = (data: {
    size: number
    chunkSize: number
    fileDataArr: ArrayBuffer[]
  }) =>
    new Promise((resolve, reject) => {
      // @ts-ignore
      MediaInfo({ format: 'object' }, mediainfo => {
        const getSize = () => data.size
        const readChunk = (chunkSize, offset) =>
          new Promise<any>((res, rej) => {
            let end = offset + chunkSize
            let startIndex = Math.floor(offset / data.chunkSize)
            let endIndex = Math.floor(end / data.chunkSize)
            if (startIndex == endIndex) {
              res(
                new Uint8Array(
                  data.fileDataArr[endIndex].slice(
                    offset - startIndex * data.chunkSize,
                    end - startIndex * data.chunkSize
                  )
                )
              )
            } else {
              let a = data.fileDataArr[startIndex]
              let b = data.fileDataArr[endIndex]
              let aArr = a.slice(offset - startIndex * data.chunkSize)
              let bArr = b.slice(0, end - endIndex * data.chunkSize)
              let dif = endIndex - startIndex
              if (dif == 1) {
                res(new Uint8Array(concatArrayBuffer([aArr, bArr])))
              } else {
                let arr = [aArr]
                for (let index = startIndex + 1; index < endIndex; index++) {
                  let element = data.fileDataArr[index]
                  arr.push(element)
                }
                arr.push(bArr)
                res(new Uint8Array(concatArrayBuffer(arr)))
              }
            }
          })
        mediainfo
          .analyzeData(getSize, readChunk)
          .then((result, err) => {
            console.log('track >>> ', result, err)
            resolve(result)
          })
          .catch(error => {
            console.log('track error >> ', error)
            resolve(null)
          })
      })
    })

  calSpeed = speed => {
    if (!speed) return '0B/s'
    if (speed < 1024) return `${speed}B/s`
    if (speed < 1024 * 1024 && speed >= 1024)
      return `${(speed / 1024).toFixed(2)}KB/s`
    return `${(speed / (1024 * 1024)).toFixed(2)}MB/s`
  }

  removeFile = id => {
    // console.log("removeFile ", id);
    let tasks = this.state.tasks
    let task: TaskItemParams = tasks[id]
    task.fileReader && task.fileReader.abort()
    task.xhr && task.xhr.abort()
    delete tasks[id]
    this.updateState('tasks', tasks)
    this.delActive(id)
  }

  renderList = () => {
    // console.log(11, this.state)
    return Object.keys(this.state.tasks).map(key => {
      const val: TaskItemParams = this.state.tasks[key]
      const removeFile = e => {
        e.preventDefault()
        this.removeFile(key)
      }
      return (
        <React.Fragment key={val.id}>
          <Row gutter={0} wrap={false} style={{ color: '#8c8c8c' }}>
            <Col flex="15px">
              {val.state.code == TaskState.Upload ? (
                <LoadingOutlined />
              ) : (
                <PaperClipOutlined />
              )}
            </Col>
            <Col flex="auto">
              <span style={{ color: '#1890ff', paddingLeft: '5px' }}>
                {val.file.name}
              </span>
            </Col>
            <Col flex="15px" onClick={removeFile}>
              <DeleteOutlined style={{ cursor: 'pointer' }} />
            </Col>
          </Row>
          {(() => {
            const percent = val.progress.percent || 0
            return (
              <Row style={{ width: '100%' }}>
                <Progress size="small" percent={percent} showInfo={false} />
              </Row>
            )
          })()}
          {(() => {
            if (val.state.code == TaskState.Upload) {
              const speed = val.progress.speed || 0
              return <div>{this.calSpeed(speed)}</div>
            }
            return <div>{val.state.msg}</div>
          })()}
        </React.Fragment>
      )
    })
  }

  onCancel = () => {
    this.updateState('show', false)
  }

  render() {
    const list = this.renderList()
    return (
      <Modal
        centered
        closable
        title="上传列表"
        visible={this.state.show}
        width={600}
        // destroyOnClose
        footer={null}
        onCancel={this.onCancel}
      >
        {list.length > 0 ? (
          <List
            size="small"
            dataSource={list}
            renderItem={item => item}
            style={{ maxHeight: 300, overflowY: 'auto' }}
          />
        ) : (
          <Empty />
        )}
      </Modal>
    )
  }
}
