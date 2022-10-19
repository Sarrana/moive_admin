import axios from '../../axios'

// 视频-内容管理-列表
export const getVideoListApi_2 = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容管理-状态
export const getVideoStateApi_2 = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_status', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容管理-详情
export const getVideoDetailApi_2 = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/video_infos/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容管理-删除
export const delVideoApi_2 = (id) => new Promise((resolve, reject) => {
    axios.delete(`/api/admin/video_infos/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容管理-添加
export const postVideoAddApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video_infos', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容管理-编辑
export const postVideoEditApi_2 = (id, params) => new Promise((resolve, reject) => {
    axios.patch(`/api/admin/video_infos/${id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容管理-网页搜索
export const videoWebSearchApi_2 = (params) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/video_infos/web_search`, { params, timeout: 20000 })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容管理-网页查询
export const videoWebQueryApi_2 = (params) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/video_infos/web_detail`, { params, timeout: 20000 })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容管理-关联系列
export const videoRelationApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/search_series`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-剧集管理-列表
export const getDramaListApi_2 = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_episodes_list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-剧集管理-状态
export const getDramaStateApi_2 = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_episodes_status', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-剧集管理-删除
export const delDramaApi_2 = (id) => new Promise((resolve, reject) => {
    axios.delete(`/api/admin/video_episodes/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-剧集管理-添加
export const postDramaAddApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video_episodes', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-剧集管理-编辑
export const postDramaEditApi_2 = (id, params) => new Promise((resolve, reject) => {
    axios.patch(`/api/admin/video_episodes/${id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-剧集管理-批量发布
export const postDramaBatchApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video_batch_release', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容审核-列表
export const getVideoExamineListApi_2 = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_audit_list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容审核-审核
export const getVideoExamine_2 = (params) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/video_audit/`, { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容审核-批量审核
export const getVideoBatchExamine_2 = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_audit_batch', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容审核-删除
export const delVideoExamineApi_2 = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/video_delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容审核-预览
export const getVideoPreview_2 = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/video_preview/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容审核-视频列表
export const getVideoExamineEpListApi_2 = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/video_episode_list/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容预发-列表
export const getTimingtimeListApi_2 = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/timingtime_list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容预发-编辑-单条
export const editTimingtimeApi_2 = (data) => new Promise((resolve, reject) => {
    axios.post('/api/admin/timingtime_edit', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-内容预发-编辑-多条
export const editTimingtimeBatchApi_2 = (data) => new Promise((resolve, reject) => {
    axios.post('/api/admin/timingtime_edit_batch', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-系列影片-获取筛选条件
export const postMediaSeriesFilterApi = () => new Promise((resolve, reject) => {
    axios.post('/api/admin/seriescategory')
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-系列影片-获取表格
export const postMediaSeriesDataApi = (data) => new Promise((resolve, reject) => {
    axios.post('/api/admin/serieslist', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-系列影片-获取关联影片
export const postMediaRelatedMediaDataApi = (data) => new Promise((resolve, reject) => {
    axios.post('/api/admin/related_videos', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-系列影片-获取关联影片
export const postMediaSeriesReadDataApi = (data) => new Promise((resolve, reject) => {
    axios.post('/api/admin/infoseries', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-系列影片-创建关联影片
export const postMediaSeriesAddApi = (data) => new Promise((resolve, reject) => {
    axios.post('/api/admin/addseries', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 视频-系列影片-修改关联影片
export const postMediaSeriesUpdateApi = (data) => new Promise((resolve, reject) => {
    axios.post('/api/admin/updateseries', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-系列影片-修改关联影片
export const deleteMediaSeriesApi = (data) => new Promise((resolve, reject) => {
    axios.post('/api/admin/delseries', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
