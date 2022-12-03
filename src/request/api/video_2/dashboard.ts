import axios from '@/request/axios'
import { Moment } from 'moment/moment'

export const postMediaStatisticsFilterApi = () => new Promise((resolve, reject) => {
    axios.post('/api/admin/selectinit')
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

export const postMediaStatisticsAuditApi = (data: {
    start_date: Moment | string;
    end_date: Moment | string;
    select_type: string;
    categories: number
}) => new Promise((resolve, reject) => {
    axios.post('/api/admin/videoaudit', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

export const postMediaStatisticsStatusApi = (data: {
    start_date: Moment | string;
    end_date: Moment | string;
    select_type: string;
    categories: number
    video_status: number
}) => new Promise((resolve, reject) => {
    axios.post('/api/admin/videostatus', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

export const postMediaStatisticsDetailApi = (data: {
    start_date: Moment | string;
    end_date: Moment | string;
    select_type: string;
    categories: number
    video_status: number
    name: string
    per_page: number
    page: number
}) => new Promise((resolve, reject) => {
    axios.post('/api/admin/videodetails', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

export const postContentVideoStatisticslApi = () => new Promise((resolve, reject) => {
    axios.post('/api/admin/video_statistics/count')
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

export const postContentPieStatisticslApi = () => new Promise((resolve, reject) => {
    axios.post('/api/admin/video_statistics/count_proportion')
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

export const postContentYearStatisticslApi = (type: number) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/video_statistics/year_proportion/${type}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

export const postContentAreaStatisticslApi = (type: number) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/video_statistics/area_proportion/${type}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

export const postContentTypeStatisticslApi = (type: number) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/video_statistics/type_proportion/${type}`)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

export const postVideoPalyStatisticslApi = (data: FormData) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video/play_proportion', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

export const postVideoPalyChartsStatisticslApi = (data: FormData, type: number) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/video/play_chart/${type}`, data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

export const postVideoTypeChartsStatisticslApi = (data: FormData, type: number) => new Promise((resolve, reject) => {
    axios.post(`/api/admin/video/play_type/${type}`, data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

export const postVideoCountChartsStatisticslApi = (data: FormData) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video/play_count', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

export const postContentIncreaseStatisticslApi = (data: FormData) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video_statistics/increase', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

export const postUserCountStatisticslApi = () => new Promise((resolve, reject) => {
    axios.post('/api/admin/video/user_count')
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

export const postUserCreateStatisticslApi = (data: FormData) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video/user_create', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

export const postUserVisitStatisticslApi = (data: FormData) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video/user_visit', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})

export const postUserRegStatisticslApi = (data: FormData) => new Promise((resolve, reject) => {
    axios.post('/api/admin/video/user_register', data)
        .then((r) => {
            resolve(r)
        })
        .catch((e) => { reject(e) })
})


export const getAppLogTodayApi = () => new Promise((resolve, reject) => {
    axios.post('/api/admin/app_logs/now')
    .then(r => resolve(r))
    .catch(e => reject(e))
})

export const getAppLogUserDailyApi = (params) => new Promise((resolve, reject) => {
    axios.post('/api/admin/app_logs/list', params)
    .then(r => resolve(r))
    .catch(e => reject(e))
})

