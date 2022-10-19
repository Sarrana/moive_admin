import axios from '../../axios'

// 小说-配置管理-小说分类-列表
export const getNovelClassifyListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/novel_class/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-小说分类-状态
export const getNovelClassifyStateApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel_class/status/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-小说分类-删除
export const delNovelClassifyApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel_class/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-小说分类-添加
export const addNovelClassifyApi = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/novel_class/add', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-小说分类-修改
export const editNovelClassifyApi = (params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/novel_class/edit/${params.id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-小说子分类-列表
export const getNovelSubClassifyListApi = (id, params) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel_class/tag_list/${id}`, { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-小说子分类-状态
export const getNovelSubClassifyStateApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel_class/status/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-小说子分类-删除
export const delNovelSubClassifyApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel_class/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-小说子分类-添加
export const addNovelSubClassifyApi = (id, params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/novel_class/tag_add/${id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-小说子分类-修改
export const editNovelSubClassifyApi = (id, params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/novel_class/tag_edit/${params.id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-VIP-列表
export const getNovelVipListApi = () => new Promise((resolve, reject) => {
    axios.get('/api/admin/novel_vip/list')
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-VIP-状态
export const getNovelVipStateApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel_vip/status/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-VIP-删除
export const delNovelVipApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel_vip/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-VIP-添加
export const addNovelVipApi = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/novel_vip/add', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-VIP-修改
export const editNovelVipApi = (params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/novel_vip/edit/${params.id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-关键字-列表
export const getNovelKeyListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/novel_keywords/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-关键字-状态
export const getNovelKeyStateApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel_keywords/status/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-关键字-删除
export const delNovelKeyApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel_keywords/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-关键字-添加
export const addNovelKeyApi = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/novel_keywords/add', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-关键字-修改
export const editNovelKeyApi = (params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/novel_keywords/edit/${params.id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-协议-列表
export const getNovelAgreementsListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/novel_agreement/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-协议-状态
export const getNovelAgreementsStateApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel_agreement/status/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-协议-删除
export const delNovelAgreementsApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel_agreement/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-协议-添加
export const addNovelAgreementsApi = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/novel_agreement/add', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-协议-修改
export const editNovelAgreementsApi = (params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/novel_agreement/edit/${params.id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-配置管理-协议-详情
export const getNovelAgreementsDetailApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel_agreement/show/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
