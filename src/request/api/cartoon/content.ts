import axios from '../../axios'

// 漫画-内容管理-列表
export const getCartoonListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/comic/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-内容管理-状态
export const getCartoonStateApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/comic/status/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-内容管理-删除
export const delCartoonApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/comic/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-内容管理-添加
export const postCartoonAddApi = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/comic/add', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-内容管理-编辑
export const postCartoonEditApi = (id, params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/comic/edit/${id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-章节管理-列表
export const getCartoonChapterListApi = (id, params) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/comic_chapter/list/${id}`, { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-章节管理-状态
export const getCartoonChapterStateApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/comic_chapter/status/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-章节管理-删除
export const delCartoonChapterApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/comic_chapter/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-章节管理-添加
export const postCartoonChapterAddApi = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/comic_chapter/add', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-章节管理-编辑
export const postCartoonChapterEditApi = (id, params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/comic_chapter/edit/${id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-章节管理-添加章节图片
export const postCartoonChapterAddPicApi = (id, params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/comic_chapter/image_add/${id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-章节管理-批量发布
export const postCartoonChapterBatchApi = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/comic_chapter/batch', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-章节管理-获取章节图片
export const getCartoonChapterContentPicApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/comic_chapter/images/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-章节管理-删除章节图片
export const delCartoonChapterContentPicApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/comic_chapter/image_delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
