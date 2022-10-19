import axios from './axios'

export * from './api/login'
export * from './api/video/common'
export * from './api/video/config'
export * from './api/video/content'
export * from './api/video/user'
export * from './api/video/site'
export * from './api/video/search'
export * from './api/novel/common'
export * from './api/novel/config'
export * from './api/novel/content'
export * from './api/novel/user'
export * from './api/novel/site'
export * from './api/novel/search'
export * from './api/cartoon/common'
export * from './api/cartoon/config'
export * from './api/cartoon/content'
export * from './api/cartoon/user'
export * from './api/cartoon/site'
export * from './api/cartoon/search'
export * from './api/video_2/common'
export * from './api/video_2/config'
export * from './api/video_2/content'
export * from './api/video_2/user'
export * from './api/video_2/site'
export * from './api/video_2/search'
export * from './api/video_2/operation'
export * from './api/video_2/dashboard'
export * from './api/dbo/videoDb'
export * from './api/sys/user'

// 上传图片
export const uploadImageApi = (data: { file, file_type: string, category: string | number }) => new Promise((resolve, reject) => {
    axios.post(`/api/uploads/common_upload/${data.file_type}/${data.category}`, data.file).then((r) => { resolve(r) }).catch((e) => { reject(e) });
})
// 上传视频
export const uploadVideoApi = (data, config) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/upload_test`, data, config).then((r) => { resolve(r) }).catch((e) => { reject(e) });
})
