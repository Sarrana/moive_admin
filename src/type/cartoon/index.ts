export type CartoonUserInfo = {
    id: number,
    account: string,
    web_id: number,
    web_name: string,
    guard_name: string,
    created_at: string,
    /** 状态：1-开启，2-关闭 */
    status: string,
    /** 1-是，2-不是 */
    vip: number,
    avatar_url?: string,
}

export type CartoonUserIp = {
    id: number,
    user_id: number,
    web_id: number,
    ip: number,
    created_at: string,
    account: string,
    nick_name: string,
    guard_name: string,
    web_name: string,
    /** 状态：1-开启，2-关闭 */
    status?: string,
}

export type CartoonSiteInfo = {
    id: number,
    web_name: string,
    subtitle: string,
    logo_url: string,
    domain_name: string,
    illustrate: string,
    key_words: string,
    /** 状态：1-开启，2-关闭 */
    status: string,
    created_at: string,
    admin_name: string,
}

export type CartoonInfo = {
    id: number,
    name: string,
    pic: string,
    /** 作者 */
    author: string,
    /** 连载 */
    serialize: string,
    /** 状态：1-开启，2-关闭 */
    status: number,
    /** 介绍 */
    content: string,
    type: { id: number, name: string }[],
    /** 更新章节数 */
    update_to: number,
    score: string,
    /** 点击数 */
    hits: number,
    /** 更新时间 */
    updated_at: string,
    keywords: string,
}

export type CartoonChapterInfo = {
    id: number,
    xid: number,
    name: string,
    vip: number,
    vip_text: string,
    chapter_image_count: number,
    release_status: number,
    release_text: string,
    /** 定时发布时间 */
    timingtime: string,
    /** 创建时间 */
    created_at: string,
    /** 状态：1-开启，2-关闭 */
    status: number,
    uid: number,
    release_at: string,
    is_end: number,
    content?: { xid: number, url: string }[],
}

export type CartoonSearchInfo = {
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

export const cartoonCostTypeOp = [
    { id: 0, label: '免费', value: '免费' },
    { id: 1, label: 'VIP', value: 'VIP' }
]

export const cartoonPublishOp = [
    { id: 1, label: '已发布', value: '已发布' },
    { id: 2, label: '待发布', value: '待发布' }
]

export const cartoonSerialOp = [
    { id: 1, label: '连载', value: '连载' },
    { id: 2, label: '完结', value: '完结' }
]
