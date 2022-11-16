import axios from '../../axios'

// 视频-配置管理-视频分类-列表
export const getVideoCategoriesListApi_2 = (params: { page: number, per_page: number }) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_categories', { data: params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-视频分类-添加
export const addVideoCategoriesApi_2 = (data: { categories_name: string, state: number }) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video_categories', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-视频分类-修改
export const updateVideoCategoriesApi_2 = (data: { categories_name: string, state: number, id: number }) => new Promise((resolve, reject) => {
    axios.patch(`/api/admin/video_categories/${data.id}`, data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-视频分类-删除
export const delVideoCategoriesApi_2 = (id: number) => new Promise((resolve, reject) => {
    axios.delete(`/api/admin/video_categories/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-视频类型-列表
export const getVideoTypesListApi_2 = (params: { page: number, per_page: number }) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_types', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-视频类型-添加
export const addVideoTypesApi_2 = (data: { type_name: string, state: number }) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video_types', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-视频类型-修改
export const updateVideoTypesApi_2 = (data: { type_name: string, state: number, id: number }) => new Promise((resolve, reject) => {
    axios.patch(`/api/admin/video_types/${data.id}`, data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-视频类型-删除
export const delVideoTypesApi_2 = (id: number) => new Promise((resolve, reject) => {
    axios.delete(`/api/admin/video_types/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-视频地区-列表
export const getVideoAreasListApi_2 = (params: { page: number, per_page: number }) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_areas', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-视频地区-添加
export const addVideoAreasApi_2 = (data: { area_name: string, state: number }) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video_areas', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-视频地区-修改
export const updateVideoAreasApi_2 = (data: { area_name: string, state: number, id: number }) => new Promise((resolve, reject) => {
    axios.patch(`/api/admin/video_areas/${data.id}`, data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-视频地区-删除
export const delVideoAreasApi_2 = (id: number) => new Promise((resolve, reject) => {
    axios.delete(`/api/admin/video_areas/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-视频时间-列表
export const getVideoYearsListApi_2 = (params: { page: number, per_page: number }) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_years', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-视频时间-添加
export const addVideoYearsApi_2 = (data: { year: string, state: number }) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video_years', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-视频时间-修改
export const updateVideoYearsApi_2 = (data: { year: string, state: number, id: number }) => new Promise((resolve, reject) => {
    axios.patch(`/api/admin/video_years/${data.id}`, data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-视频时间-删除
export const delVideoYearsApi_2 = (id: number) => new Promise((resolve, reject) => {
    axios.delete(`/api/admin/video_years/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-协议管理-列表
export const getUserAgreementsListApi_2 = (params: { page: number, per_page: number }) => new Promise((resolve, reject) => {
    axios.get('/api/admin/user_agreement/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-协议管理-添加
export const addUserAgreementsApi_2 = (data) => new Promise((resolve, reject) => {
    axios.post('/api/admin/user_agreement/add', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-协议管理-修改
export const updateUserAgreementsApi_2 = (data) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/user_agreement/edit/${data.id}`, data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-协议管理-查询
export const getUserAgreementsDetailApi_2 = (id: number) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/user_agreement/show/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-协议管理-修改状态
export const updateUserAgreementsStatuslApi_2 = (id: number) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/user_agreement/status?id=${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-协议管理-删除
export const delUserAgreementslApi_2 = (id: number) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/user_agreement/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-关键字搜索-列表
export const getWebKeywordsListApi_2 = (params: { page: number, per_page: number, web_name: string }) => new Promise((resolve, reject) => {
    axios.get('/api/admin/web_keywords/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-关键字搜索-查询
export const getWebKeywordsDetailApi_2 = (id: number) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/web_keywords/show?id=${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-关键字搜索-删除
export const delWebKeywordsApi_2 = (id: number) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/web_keywords/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-配置管理-关键字搜索-修改状态
export const updateWebKeywordsStatusApi_2 = (id: number) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/web_keywords/status?id=${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-关键字搜索-添加
export const addWebKeywordsApi_2 = (data) => new Promise((resolve, reject) => {
    axios.post('/api/admin/web_keywords/add', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-配置管理-关键字搜索-修改
export const updateWebKeywordsApi_2 = (data) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/web_keywords/edit/${data.id}`, data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

/** 视频-配置管理-明星管理-列表 */
export const getActorListApi_2 = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/star_infos', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

/** 视频-配置管理-明星管理-删除 */
export const delActorApi_2 = (id) => new Promise((resolve, reject) => {
    axios.delete(`/api/admin/star_infos/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

/** 视频-配置管理-明星管理-添加 */
export const postActorAddApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/star_infos', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

/** 视频-配置管理-明星管理-编辑 */
export const postActorEditApi_2 = (id, params) => new Promise((resolve, reject) => {
    axios.put(`/api/admin/star_infos/${id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

/** 视频-配置管理-明星管理-详情 */
export const getActorDetailApi_2 = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/star_infos/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

/** 视频-配置管理-明星管理-选项 */
export const getActorOpApi_2 = () => new Promise((resolve, reject) => {
    axios.get('/api/admin/star_infos/init_data')
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

/** 视频-配置管理-明星管理-搜索 */
export const searchActorApi_2 = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/star_infos/search', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

/** 视频-配置管理-明星管理-搜索信息 */
export const searchActorInfoApi_2 = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/star_infos/web_search', { params, timeout: 20000 })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

/**
 * 系统公告-web
 */
export const fetchAnnouncementApi = () => new Promise((resolve, reject) => {
    axios.get('/api/admin/video/video_notice_show')
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 
export const updateAnnouncementApi = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video/video_notice_add', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 系统公告- APP公告 - app公告列表
export const getAppAnnouncementListApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/app_notice/list', params)
        .then((r) => { resolve(r) })
        .catch((e) => { reject(e) })
})
// 系统公告- APP公告 - app公告新增/修改
export const updateAppAnnouncementApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/app_notice/save', params)
        .then((r) => { resolve(r) })
        .catch((e) => { reject(e) })
})
// 系统公告- APP公告 - app公告删除
export const delAppAnnouncementApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/app_notice/del', params)
        .then((r) => { resolve(r) })
        .catch((e) => { reject(e) })
})

// 视频 - 配置管理 - 版本管理 - 获取版本列表
export const getVersionListApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/versions/list', params)
        .then(r => resolve(r))
        .catch(e => reject(e))
})

// 视频 - 配置管理 - 版本管理 - 新增/修改
export const updateVersionSaveApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/versions/save', params)
        .then(r => resolve(r))
        .catch(e => reject(e))
})

