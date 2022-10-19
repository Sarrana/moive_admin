import axios from '../../axios'

// 视频-用户管理-列表
export const getVideoUserListApi_2 = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_user/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-用户管理-状态
export const getVideoUserStateApi_2 = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_user/status', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-用户管理-详情
export const getVideoUserDetailApi_2 = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_user/show', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-用户管理-IP
export const getVideoUserIpListApi_2 = (params) => new Promise((resolve, reject) => {
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

// 视频-用户管理-详情-积分记录
export const getVideoUserScoreRecordApi_2 = (id, params) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/user_infos/${id}/point_records`, { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-用户管理-详情-邀请记录
export const getVideoUserInviteRecordApi_2 = (id, params) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/user_infos/${id}/invites`, { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
