import axios from '../../axios'

// 视频-搜索记录-列表
export const getVideoSearchListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/search_records/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 视频-搜索记录-删除
export const delVideoSearchApi = (id:number) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/search_records/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
