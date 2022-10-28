import axios from "axios";

// 视频-评论管理-列表
export const getCommentListApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video_comment/list', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => {
            reject(e)
        })
})

// 视频-评论管理-审核
export const setCommentStatusApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('api/admin/video_comment/commentState', params)
        .then((r) => { resolve(r) })
        .catch((e) => { reject(e) })
})

// 视频-评论管理-获取视频详情
export const getVideoDetailApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('api/video/getVideoDetail', params)
        .then(r => resolve(r))
        .catch(e => reject(e))
})

