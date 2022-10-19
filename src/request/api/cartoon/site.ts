import axios from '../../axios'

// 漫画-网站管理-列表
export const getCartoonSiteListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/comic_web/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-网站管理-状态
export const getCartoonSiteStateApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/comic_web/status/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-网站管理-删除
export const delCartoonSiteApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/comic_web/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-网站管理-编辑
export const postCartoonSiteEditApi = (id, params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/comic_web/edit/${id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-网站管理-添加
export const postCartoonSiteAddApi = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/comic_web/add', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
