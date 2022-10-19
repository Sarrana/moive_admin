import axios from '../../axios'

// 漫画-用户管理-列表
export const getCartoonUserListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/comic_user/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-用户管理-状态
export const getCartoonUserStateApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/comic_user/status/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-用户管理-详情
export const getCartoonUserDetailApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/comic_user/detail/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-用户管理-书架
export const getCartoonUserBookshelfApi = (id, params) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/comic_user/comic_fav/${id}`, { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-用户管理-IP
export const getCartoonUserIpListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/comic_user/user_ip_list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
