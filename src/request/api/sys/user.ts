import axios from '../../axios'

// 系统-用户管理-列表
export const getAdminUserListApi = (params: { keywords: string, enables: string[] | string }) => new Promise((resolve, reject) => {
    axios.get('/api/admin/admin_users', { params })
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 系统-用户管理-添加
export const addAdminUserApi = (data: FormData) => new Promise((resolve, reject) => {
    axios.post('/api/admin/admin_users', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 系统-用户管理-编辑
export const editAdminUserApi = (params) => new Promise((resolve, reject) => {
    axios.put(`/api/admin/admin_users/${params.id}`, params)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

// 系统-用户管理-删除
export const delAdminUserApi = (id: number) => new Promise((resolve, reject) => {
    axios.delete(`/api/admin/admin_users/${id}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})
