import axios from '../../axios'

// 小说-搜索记录-列表
export const getNovelSearchListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/novel_search/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 小说-搜索记录-删除
export const delNovelSearchApi = (id: number) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel_search/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
