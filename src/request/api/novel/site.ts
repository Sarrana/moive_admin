import axios from '../../axios'

// 小说-网站管理-列表
export const getNovelSiteListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/novel_website/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-网站管理-状态
export const getNovelSiteStateApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/novel_website/status', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-网站管理-删除
export const delNovelSiteApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel_website/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-网站管理-编辑
export const postNovelSiteEditApi = (id, params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/novel_website/edit/${id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-网站管理-添加
export const postNovelSiteAddApi = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/novel_website/add', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
