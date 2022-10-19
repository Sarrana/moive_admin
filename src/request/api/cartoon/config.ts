import axios from '../../axios'

// 漫画-配置管理-漫画类型-列表
export const getCartoonTypeListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/comic_type/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-配置管理-漫画类型-状态
export const getCartoonTypeStateApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/comic_type/status/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-配置管理-漫画分类-删除
export const delCartoonTypeApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/comic_type/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-配置管理-漫画分类-添加
export const addCartoonTypeApi = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/comic_type/add', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-配置管理-漫画分类-修改
export const editCartoonTypeApi = (params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/comic_type/edit/${params.id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-配置管理-关键字-列表
export const getCartoonKeyListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/comic_keywords/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-配置管理-关键字-状态
export const getCartoonKeyStateApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/comic_keywords/status/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-配置管理-关键字-删除
export const delCartoonKeyApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/comic_keywords/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-配置管理-关键字-添加
export const addCartoonKeyApi = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/comic_keywords/add', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-配置管理-关键字-修改
export const editCartoonKeyApi = (params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/comic_keywords/edit/${params.id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-配置管理-协议-列表
export const getCartoonAgreementsListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/comic_agreement/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-配置管理-协议-状态
export const getCartoonAgreementsStateApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/comic_agreement/status/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-配置管理-协议-删除
export const delCartoonAgreementsApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/comic_agreement/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-配置管理-协议-添加
export const addCartoonAgreementsApi = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/comic_agreement/add', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-配置管理-协议-修改
export const editCartoonAgreementsApi = (params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/comic_agreement/edit/${params.id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-配置管理-协议-详情
export const getCartoonAgreementsDetailApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/comic_agreement/show/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
