import axios from '../../axios'

// 视频-用户管理-列表
export const getVideoUserListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_user/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-用户管理-状态
export const getVideoUserStateApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_user/status', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-用户管理-详情
export const getVideoUserDetailApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_user/show', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-用户管理-IP
export const getVideoUserIpListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_user_visit/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// // 视频-用户管理-IP禁用
// export const getVideoUserIpStateApi = (params) => new Promise((resolve, reject) => {
//     axios.get('/api/admin/video_categories', { params })
//         .then((r) => {
//             resolve(r)
//         })
//         .catch((e) => { reject(e) })
// })
