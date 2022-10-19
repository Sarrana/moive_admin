import axios from '../../axios'

// 漫画-漫画类型-列表
export const getCartoonAllTypeApi = () => new Promise((resolve, reject) => {
    axios.get('/api/admin/comic/type_list').then((r) => { resolve(r) }).catch((e) => { reject(e) });
})
// 漫画-漫画网站-列表
export const getCartoonAllSiteApi = () => new Promise((resolve, reject) => {
    axios.get('/api/admin/comic_web/web_list').then((r) => { resolve(r) }).catch((e) => { reject(e) });
})
