import axios from "../../axios"

// 视频-支付管理-支付类型-列表
export const getPayTypeListApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/pay_type/list', params)
        .then(r => resolve(r))
        .catch(e => reject(e))
})


// 视频-支付管理-支付类型-添加/修改
export const updatePayTypeApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/pay_type/save', params)
        .then(r => resolve(r))
        .catch(e => reject(e))
})

// 视频-支付管理-支付类型-删除
export const delPayTypeApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/pay_type/del', params)
        .then(r => resolve(r))
        .catch(e => reject(e))
})


// 视频-支付管理-支付网关-列表
export const getPayGatewayListApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/pay_way/list', params)
        .then(r => resolve(r))
        .catch(e => reject(e))
})


// 视频-支付管理-支付网关-添加/修改
export const updatePayGatewayApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/pay_way/save', params)
        .then(r => resolve(r))
        .catch(e => reject(e))
})

// 视频-支付管理-支付网关-删除
export const delPayGatewayApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/pay_way/del', params)
        .then(r => resolve(r))
        .catch(e => reject(e))
})