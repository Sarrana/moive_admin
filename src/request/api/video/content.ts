import axios from '../../axios'

// 视频-内容管理-列表
export const getVideoListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容管理-状态
export const getVideoStateApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_status', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容管理-详情
export const getVideoDetailApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/video_infos/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容管理-删除
export const delVideoApi = (id) => new Promise((resolve, reject) => {
    axios.delete(`/api/admin/video_infos/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容管理-添加
export const postVideoAddApi = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video_infos', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容管理-编辑
export const postVideoEditApi = (id, params) => new Promise((resolve, reject) => {
    axios.patch(`/api/admin/video_infos/${id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-剧集管理-列表
export const getDramaListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_episodes_list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-剧集管理-状态
export const getDramaStateApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_episodes_status', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-剧集管理-删除
export const delDramaApi = (id) => new Promise((resolve, reject) => {
    axios.delete(`/api/admin/video_episodes/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-剧集管理-添加
export const postDramaAddApi = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video_episodes', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-剧集管理-编辑
export const postDramaEditApi = (id, params) => new Promise((resolve, reject) => {
    axios.patch(`/api/admin/video_episodes/${id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-剧集管理-批量发布
export const postDramaBatchApi = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video_batch_release', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
