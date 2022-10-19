import axios from '../../axios'

// 小说-内容管理-列表
export const getNovelListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/novel/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-内容管理-状态
export const getNovelStateApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel/status/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-内容管理-删除
export const delNovelApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-内容管理-添加
export const postNovelAddApi = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/novel/add', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-内容管理-编辑
export const postNovelEditApi = (id, params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/novel/edit/${id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-章节管理-列表
export const getChapterListApi = (id, params) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel_chapter/list/${id}`, { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// // 小说-章节管理-状态
// export const getChapterStateApi = (params) => new Promise((resolve, reject) => {
//     axios.get('/api/admin/video_episodes_status', { params })
//         .then((r) => {
//             resolve(r)
//         })
//         .catch((e) => { reject(e) })
// })

// 小说-章节管理-删除
export const delChapterApi = (id, params) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel_chapter/delete/${id}`, { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-章节管理-添加
export const postChapterAddApi = (id, params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/novel_chapter/add/${id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-章节管理-编辑
export const postChapterEditApi = (id, params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/novel_chapter/edit/${id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-章节管理-批量发布
export const postChapterBatchApi = (id, params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/novel_chapter/batch_release/${id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-章节管理-章节内容
export const getChapterContentApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/novel_chapter/detail', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
