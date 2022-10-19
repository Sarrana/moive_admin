import axios from '../../axios'

// 小说-用户管理-列表
export const getNovelUserListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/novel_user/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-用户管理-状态
export const getNovelUserStateApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel_user/status/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-用户管理-详情
export const getNovelUserDetailApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel_user/detail/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-用户管理-书架
export const getNovelUserBookshelfApi = (id, params) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel_user/book_fav/${id}`, { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-用户管理-IP
export const getNovelUserIpListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/novel_user/user_ip_list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// // 小说-用户管理-IP禁用
// export const getNovelUserIpStateApi = (params) => new Promise((resolve, reject) => {
//     axios.get('/api/admin/video_categories', { params })
//         .then((r) => {
//             resolve(r)
//         })
//         .catch((e) => { reject(e) })
// })
