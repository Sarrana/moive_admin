export type NovelUserInfo = {
    id: number,
    account: string,
    web_id: number,
    web_name: string,
    guard_name: string,
    created_at: string,
    nickname: string,
    /** 状态：1-开启，2-关闭 */
    status: string,
    /** vip：1-是，2-不是 */
    vip: string,
    avatar_url?: string,
}

export type NovelUserIp = {
    id: number,
    user_id: number,
    web_id: number,
    web_name: string,
    ip: number,
    created_at: string,
    account: string,
    guard_name: string
}

export type NovelSiteInfo = {
    id: number,
    web_name: string,
    subtitle: string,
    logo_url: string,
    domain_name: string,
    illustrate: string,
    key_words: string,
    /** 状态：1-开启，2-关闭 */
    state: string,
    created_at: string,
    admin_name: string,
}

export type NovelInfo = {
    id: number,
    pic: string,
    name: string,
    channel: string,
    channel_text: string,
    /** 更新章节数 */
    chapter_count: number,
    /** 总字数 */
    text_num: number,
    /** 作者 */
    author: string,
    /** 连载 */
    serialize: string,
    score: string,
    /** 状态：1-开启，2-关闭 */
    status: number,
    /** 点击数 */
    hits: number,
    /** 创建时间 */
    created_at: string,
    /** 分类 */
    class_name: string
    /** 分类Id */
    cid: number,
    keywords: string,
    /** 简介 */
    text: string,
    /** 介绍 */
    content: string,
    /** 细分标签 */
    tags: string
}

export type NovelChapterInfo = {
    id: number,
    name: string,
    vip: number,
    release_at: string,
    /** 定时发布时间 */
    timingtime: string,
    reading: number,
    user_id: number,
    /** 创建时间 */
    created_at: string,
    yid: number,
    xid: number,
    release_text: string,
    vip_text: string,
    content?: string,
}

export type NovelSearchInfo = {
    id: number
    keyword: string
    frequency: number
    result: string
    result_text: string
    web_id: number
    web_name: string
    guard_name: string
    user_id: number
    user_name: string
    created_at: string
}

export const novelChannelOp = [
    { id: 1, label: '男频', value: '男频' },
    { id: 2, label: '女频', value: '女频' }
]

export const novelCostTypeOp = [
    { id: 0, label: '免费', value: '免费' },
    { id: 1, label: 'VIP', value: 'VIP' }
]

export const novelPublishOp = [
    { id: 1, label: '已发布', value: '已发布' },
    { id: 2, label: '待发布', value: '待发布' }
]

export const novelSerialOp = [
    { id: 1, label: '连载', value: '连载' },
    { id: 2, label: '完结', value: '完结' }
]
