import axios from '../../axios'

// 漫画-搜索记录-列表
export const getCartoonSearchListApi = (params) => new Promise((resolve, reject) => {
    axios.get('/api/admin/comic_search/list', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 漫画-搜索记录-删除
export const delCartoonSearchApi = (id: number) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/comic_search/delete/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
