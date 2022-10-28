import axios from "axios"

// 视频-工单管理-获取工单列表
export const getFeedbackListApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('api/admin/user_feed/list', params)
        .then(r => resolve(r))
        .catch(e => reject(e))
})

// 视频-工单管理-获取工单详情
export const getFeedbackDetailApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('api/admin/user_feed/detail', params)
        .then(r => resolve(r))
        .catch(e => reject(e))
})

// 视频-工单管理-回复工单
export const setFeedbackReplyApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('api/admin/user_feed/reply', params)
        .then(r => resolve(r))
        .catch(e => reject(e))
})