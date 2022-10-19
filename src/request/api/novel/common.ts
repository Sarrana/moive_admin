import axios from '../../axios'

// 小说-小说分类-列表
export const getNovelAllCategoryApi = (id) => new Promise((resolve, reject) => {
    axios.get(`/api/admin/novel/novelClass/${id}`).then((r) => { resolve(r) }).catch((e) => { reject(e) });
})
// 小说-小说网站-列表
export const getNovelAllSiteApi = () => new Promise((resolve, reject) => {
    axios.get('/api/admin/novel_search/web_list').then((r) => { resolve(r) }).catch((e) => { reject(e) });
})
