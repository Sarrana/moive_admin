import axios from "axios";

// 视频-订单管理-列表
export const getOrderListApi_2 = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/order/list', params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => {
            reject(e)
        })
})