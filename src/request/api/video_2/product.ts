import axios from "../../axios"

// 视频-产品管理-产品-列表
export const getProductListApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/product/list', params)
        .then(r => resolve(r))
        .catch(e => reject(e))
})


// 视频-产品管理-产品-添加/修改
export const updateProductApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/product/save', params)
        .then(r => resolve(r))
        .catch(e => reject(e))
})

// 视频-产品管理-产品-删除
export const delProductApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/product/del', params)
        .then(r => resolve(r))
        .catch(e => reject(e))
})


// 视频-产品管理-产品支付配置 - 列表
export const getProductPayListApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/pay_map/list', params)
        .then(r => resolve(r))
        .catch(e => reject(e))
})


// 视频-产品管理-产品支付配置 - 添加/修改
export const updateProductPayApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/pay_map/save', params)
        .then(r => resolve(r))
        .catch(e => reject(e))
})

// 视频-产品管理-产品支付配置 - 删除
export const delProductPayApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/pay_map/del', params)
        .then(r => resolve(r))
        .catch(e => reject(e))
})