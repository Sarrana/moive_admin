import axios from '../../axios'

// 视频-视频分类-列表
export const getVideoAllCategoryApi_2 = () => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_c').then((r) => { resolve(r) }).catch((e) => { reject(e) });
})
// 视频-视频类型-列表
export const getVideoAllTypeApi_2 = () => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_t').then((r) => { resolve(r) }).catch((e) => { reject(e) });
})
// 视频-视频分类-类型-列表
export const getVideoAllCTypeApi_2 = () => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_class').then((r) => { resolve(r) }).catch((e) => { reject(e) });
})
// 视频-视频地区-列表
export const getVideoAllAreaApi_2 = () => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_a').then((r) => { resolve(r) }).catch((e) => { reject(e) });
})
// 视频-视频年份-列表
export const getVideoAllYearApi_2 = () => new Promise((resolve, reject) => {
    axios.get('/api/admin/video_y').then((r) => { resolve(r) }).catch((e) => { reject(e) });
})
// 视频-视频网站-列表
export const getVideoAllSiteApi_2 = () => new Promise((resolve, reject) => {
    axios.get('/api/admin/user_visit_web').then((r) => { resolve(r) }).catch((e) => { reject(e) });
})
