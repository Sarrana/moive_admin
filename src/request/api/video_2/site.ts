import axios from '../../axios'

// 视频-网站管理-列表
export const getVideoSiteListApi_2 = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_web/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-网站管理-状态
export const getVideoSiteStateApi_2 = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_web/status', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-网站管理-删除
export const delVideoSiteApi_2 = (id) => new Promise((resolve, reject) => {
    axios.delete(`/api/admin/video_web/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-网站管理-编辑
export const postVideoSiteEditApi_2 = (id, params) => new Promise((resolve, reject) => {
    axios.patch(`/api/admin/video_web/edit/${id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-网站管理-添加
export const postVideoSiteAddApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video_web/add', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容推荐-列表
export const getVideoRecommendListApi_2 = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/recommend_video/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容推荐-状态
export const getVideoRecommendStateApi_2 = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/recommend_video/status/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容推荐-删除
export const delVideoRecommendApi_2 = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/recommend_video/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容推荐-编辑
export const postVideoRecommendEditApi_2 = (id, params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/recommend_video/edit/${id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容推荐-添加
export const postVideoRecommendAddApi_2 = (id, params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/recommend_video/add', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容排序-列表
export const getVideoSortListApi_2 = (id, params) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/recommend_video_content/list/${id}`, { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容排序-视频列表
export const getVideoSortVideoListApi_2 = (id, params) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/recommend_video_content/video_list/${id}`, { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容排序-添加
export const postVideoSortVideoAddApi_2 = (id, params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/recommend_video_content/video_add/${id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容排序-编辑
export const postVideoSortVideoEditApi_2 = (id, params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/recommend_video_content/video_edit/${id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容排序-删除
export const delVideoSortVideoApi_2 = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/recommend_video_content/video_delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
