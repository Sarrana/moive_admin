import axios from '../../axios'

// 我想看-列表
export const getIWantListApi_2 = (params: { page: number, per_page: number, keywords: string, start_date: string, end_date: string, web_id: string, status: string }) => new Promise((resolve, reject) => {
    axios.get('/api/admin/want_to_sees/my_wants', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 我想看-发送邮件
export const sendEmailWantAPi_2 = (data: FormData, id: number) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/want_to_sees/${id}/send_email`, data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 我想看-删除
export const delIWantListApi_2 = (id: number) => new Promise((resolve, reject) => {
    axios.delete(`/api/admin/want_to_sees/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 大家我想看-列表
export const getAllWantListApi_2 = (params: { page: number, per_page: number, web_id: string, status: string }) => new Promise((resolve, reject) => {
    axios.get('/api/admin/want_to_sees/everyone_wants', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 大家我想看-新增
export const addAllWantListApi_2 = (data: FormData) => new Promise((resolve, reject) => {
    axios.post('/api/admin/want_to_sees', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 大家我想看-修改
export const updateAllWantListApi_2 = (data) => new Promise((resolve, reject) => {
    axios.put(`/api/admin/want_to_sees/${data.id}`, data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 积分-列表
export const getPointLogsListApi_2 = (params: { page: number, per_page: number, web_id: string, start_date: string, end_date: string, }) => new Promise((resolve, reject) => {
    axios.get('/api/admin/user_point_logs', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
// 网站-列表
export const getWebListApi_2 = () => new Promise((resolve, reject) => {
    axios.get('/api/admin/want_to_sees/init_data')
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

/** 视频-运营管理-错误反馈-列表 */
export const getVideoFeedBackListApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/listinfo', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

/** 视频-运营管理-错误反馈-网站列表 */
export const getVideoFeedBackWebListApi_2 = () => new Promise((resolve, reject) => {
    axios.post('/api/admin/webslist')
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

/** 视频-运营管理-错误反馈-终端列表 */
export const getVideoFeedBackTerListApi_2 = () => new Promise((resolve, reject) => {
    axios.post('/api/admin/terminal')
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

/** 视频-运营管理-错误反馈-删除 */
export const getVideoFeedBackDelApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/destroy_feedback', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

/** 视频-运营管理-错误反馈-处理 */
export const getVideoFeedBackHandApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/update_feedback', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
