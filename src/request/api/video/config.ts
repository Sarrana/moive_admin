import axios from '../../axios'

// 视频-配置管理-视频分类-列表
export const getVideoCategoriesListApi = (params: { page: number, per_page: number }) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_categories', { data: params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-视频分类-添加
export const addVideoCategoriesApi = (data: { categories_name: string, state: number }) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video_categories', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-视频分类-修改
export const updateVideoCategoriesApi = (data: { categories_name: string, state: number, id: number }) => new Promise((resolve, reject) => {
    axios.patch(`/api/admin/video_categories/${data.id}`, data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-视频分类-删除
export const delVideoCategoriesApi = (id: number) => new Promise((resolve, reject) => {
    axios.delete(`/api/admin/video_categories/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-视频类型-列表
export const getVideoTypesListApi = (params: { page: number, per_page: number }) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_types', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-视频类型-添加
export const addVideoTypesApi = (data: { type_name: string, state: number }) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video_types', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-视频类型-修改
export const updateVideoTypesApi = (data: { type_name: string, state: number, id: number }) => new Promise((resolve, reject) => {
    axios.patch(`/api/admin/video_types/${data.id}`, data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-视频类型-删除
export const delVideoTypesApi = (id: number) => new Promise((resolve, reject) => {
    axios.delete(`/api/admin/video_types/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-视频地区-列表
export const getVideoAreasListApi = (params: { page: number, per_page: number }) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_areas', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-视频地区-添加
export const addVideoAreasApi = (data: { area_name: string, state: number }) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video_areas', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-视频地区-修改
export const updateVideoAreasApi = (data: { area_name: string, state: number, id: number }) => new Promise((resolve, reject) => {
    axios.patch(`/api/admin/video_areas/${data.id}`, data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-视频地区-删除
export const delVideoAreasApi = (id: number) => new Promise((resolve, reject) => {
    axios.delete(`/api/admin/video_areas/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-视频时间-列表
export const getVideoYearsListApi = (params: { page: number, per_page: number }) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_years', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-视频时间-添加
export const addVideoYearsApi = (data: { year: string, state: number }) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video_years', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-视频时间-修改
export const updateVideoYearsApi = (data: { year: string, state: number, id: number }) => new Promise((resolve, reject) => {
    axios.patch(`/api/admin/video_years/${data.id}`, data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-视频时间-删除
export const delVideoYearsApi = (id: number) => new Promise((resolve, reject) => {
    axios.delete(`/api/admin/video_years/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-协议管理-列表
export const getUserAgreementsListApi = (params: { page: number, per_page: number }) => new Promise((resolve, reject) => {
    axios.get('/api/admin/user_agreement/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

type ParamsDataType = {
    content: string
    id?: number
    name: string
    web_id: number
    status: number
}
// 视频-配置管理-协议管理-添加
export const addUserAgreementsApi = (data) => new Promise((resolve, reject) => {
    axios.post('/api/admin/user_agreement/add', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-协议管理-修改
export const updateUserAgreementsApi = (data) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/user_agreement/edit/${data.id}`, data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-协议管理-查询
export const getUserAgreementsDetailApi = (id: number) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/user_agreement/show/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-协议管理-修改状态
export const updateUserAgreementsStatuslApi = (id: number) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/user_agreement/status?id=${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-协议管理-删除
export const delUserAgreementslApi = (id: number) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/user_agreement/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-关键字搜索-列表
export const getWebKeywordsListApi = (params: { page: number, per_page: number, web_name: string }) => new Promise((resolve, reject) => {
    axios.get('/api/admin/web_keywords/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-关键字搜索-查询
export const getWebKeywordsDetailApi = (id: number) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/web_keywords/show?id=${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-关键字搜索-删除
export const delWebKeywordsApi = (id: number) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/web_keywords/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-关键字搜索-修改状态
export const updateWebKeywordsStatusApi = (id: number) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/web_keywords/status?id=${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-关键字搜索-添加
export const addWebKeywordsApi = (data) => new Promise((resolve, reject) => {
    axios.post('/api/admin/web_keywords/add', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-关键字搜索-修改
export const updateWebKeywordsApi = (data) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/web_keywords/edit/${data.id}`, data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
