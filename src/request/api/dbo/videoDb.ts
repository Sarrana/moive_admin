import axios from '../../axios'

/** 视频-广告位-列表 */
export const getVideoAdPosListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/advertisements', { params }).then((r) => { resolve(r) }).catch((e) => { reject(e) });
})

/** 视频-广告位-删除 */
export const delVideoAdPosApi = (id) => new Promise((resolve, reject) => {
    axios.delete(`/api/admin/advertisements/${id}`).then((r) => { resolve(r) }).catch((e) => { reject(e) });
})

/** 视频-广告位-创建 */
export const addVideoAdPosApi = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/advertisements', params).then((r) => { resolve(r) }).catch((e) => { reject(e) });
})

/** 视频-广告位-修改 */
export const editVideoAdPosApi = (params) => new Promise((resolve, reject) => {
    axios.put(`/api/admin/advertisements/${params.id}`, params).then((r) => { resolve(r) }).catch((e) => { reject(e) });
})

/** 视频-广告-列表 */
export const getVideoAdListApi = (posid, params) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/advertisements/${posid}/advertisement_infos`, { params }).then((r) => { resolve(r) }).catch((e) => { reject(e) });
})

/** 视频-广告-删除 */
export const delVideoAdApi = (posid, id) => new Promise((resolve, reject) => {
    axios.delete(`/api/admin/advertisements/${posid}/advertisement_infos/${id}`).then((r) => { resolve(r) }).catch((e) => { reject(e) });
})

/** 视频-广告-创建 */
export const addVideoAdApi = (posid, params) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/advertisements/${posid}/advertisement_infos`, params).then((r) => { resolve(r) }).catch((e) => { reject(e) });
})

/** 视频-广告-修改 */
export const editVideoAdApi = (posid, params) => new Promise((resolve, reject) => {
    axios.put(`/api/admin/advertisements/${posid}/advertisement_infos/${params.id}`, params).then((r) => { resolve(r) }).catch((e) => { reject(e) });
})

/** 视频-广告-选项 */
export const getVideoAdOpApi = () => new Promise((resolve, reject) => {
    axios.get('/api/admin/advertisements/init_data').then((r) => { resolve(r) }).catch((e) => { reject(e) });
})

/** 视频-广告-搜索视频 */
export const getVideoOpApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_search', { params }).then((r) => { resolve(r) }).catch((e) => { reject(e) });
})
