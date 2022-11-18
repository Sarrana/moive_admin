import { BANNERTYPE, ORDERSTATUS, STATUS, VIPLEVLE, VIPTYPE } from "@/constants/video2"

export type VideoUserInfo = {
    id?: number,
    nickname: string,
    account: string,
    web_name: string,
    guard_name: string,
    created_at: string,
    /** 状态：1-开启，2-关闭 */
    status: string,
    avatar_url?: string,
    point: number,
    invites_count: number,
}

export type VideoUserIp = {
    id: number,
    ip: number,
    created_at: string,
    nick_name: string,
    account: string,
    guard_name: string,
    web_name: string,
    area: string,
    /** 状态：1-开启，2-关闭 */
    status?: string,
}

export type VideoSiteInfo = {
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

export type VideoInfo = {
    id: number,
    pic: string,
    level_pic: string,
    name: string,
    cid: number,
    /** 分类 */
    cid_text: string,
    /** 类型 */
    type: string,
    /** 简介 */
    introduction: string,
    /** 已上传集数 */
    video_episodes_count: number,
    total: number,
    area_id: number,
    area: string,
    year: string,
    year_id: number,
    score: number,
    playamount: number,
    /** 状态：1-开启，2-关闭 */
    state: string,
    /** 发布状态 */
    release: string,
    /** 连载状态 */
    videomode: number,
    video_mode_text: string,
    /** 视频存放文件夹 */
    folder: string,
    series_id: number,
    series_name: string,
}

export type VideoDetail = VideoInfo & {
    tags: string,
    alias: string[],
    director: {
        id: number
        avatar: string
        name: string
    }[],
    starring: {
        id: number
        avatar: string
        name: string
    }[],
    language: string,
    /** 介绍 */
    present: string,
    section: number,
    /** 创建人 */
    user_name: string,
    created_at: string,
    /** 开播状态 */
    video_mode_text: string,
    /** 基础评分 */
    basic_score: number,

    /** 定时发布 */
    publishTimer?: string,
}

export type DramaInfo = {
    id: number,
    episode: number,
    duration: string,
    /** 分辨率 */
    resolution: string,
    /** 是否免费：1-免费，2-付费 */
    is_free: number,
    s_free_text: string,
    amount: string,
    /** 发布状态 */
    release_status: number,
    release_status_text: string,
    /** 定时发布时间 */
    timingtime: string,
    playamount: number,
    /** 发布时间 */
    release_at: string,
    /** 状态：1-开启，2-关闭 */
    status: string,
    user_id: number,
    user_name: string,
    created_at: string,
    url: string,
    name: string,
}

export const switchVideoInfo = (old) => {
    const arr = old.type.split('/');
    const newInfo = {
        id: old.id,
        pic: old.pic,
        name: old.name,
        classify: arr[0].split('[')[1].split(']')[0],
        type: arr[1],
        profile: old.introduction,
        totalEp: Number(old.total),
        curEp: Number(old.video_episodes_count),
        area: old.area,
        year: old.year,
        score: Number(old.score),
        playamount: Number(old.playamount),
        state: old.state,
        publish: old.release,

        introduction: '未知',
        epType: "未知",
        serial: "未知",
        publishTimer: "未知",
        baseScore: 999,
        // language: old.language,
        // director: old.director.split('/')[1],
        // starring: old.starring.split('/')[1],
        // created_at: old.created_at,
        language: '未知',
        director: '未知',
        starring: '未知',
        created_at: '未知',
        tags: '未知',
        created_er: "未知"
    }
    return newInfo;
}

export const switchVideoInfoArr = (oldArr: any[]) => {
    return oldArr.map((v) => switchVideoInfo(v));
}

export const videoEpOp = [
    { id: 1, label: '集', value: '集' },
    { id: 2, label: '季', value: '季' },
    { id: 3, label: '期', value: '期' }
]

export const videoSerialOp = [
    { id: 1, label: '连载中', value: '连载中' },
    { id: 2, label: '已完结', value: '已完结' },
    { id: 3, label: '未开播', value: '未开播' }
]

export const videoPublishOp = [
    { id: 1, label: '已发布', value: '已发布' },
    { id: 2, label: '待发布', value: '待发布' }
]

export const videoCostTypeOp = [
    { id: 1, label: '免费', value: '免费' },
    { id: 2, label: '付费', value: '付费' }
]

export const videoDefinitionOp = [
    { id: 1, label: '720p', value: '720p' },
    { id: 2, label: '1080p', value: '1080p' },
    { id: 3, label: '2k', value: '2k' },
    { id: 4, label: '4k', value: '4k' }
]


// 视频管理-评论管理- 审核状态
export const cmtStatusOp = [
    { id: 1, label: '审核通过', value: '审核通过' },
    { id: 0, label: '审核未通过', value: '审核未通过' }
]

// 视频管理-工单管理- 回复状态
export const feedbackStatusOp = [
    { id: 1, label: '已回复 ', value: '已回复 ' },
    { id: 0, label: '未回复', value: '未回复' }
]

// 视频管理-版本管理-发布平台
export const versionOSOP = [
    { id: 1, label: '安卓', value: 'android ' },
    { id: 2, label: 'iOS', value: 'ios ' },
    { id: 3, label: '全部', value: 'all ' },
]

// 视频管理-支付管理-支付类型
export type PayTypeBasedata = {
    id: number
    name: string
    status: STATUS
    order: number
    ch_name: string
    created_at: string
    updated_at: string
}

// 视频管理-支付管理-支付网关
export type PayGatewayBasedata = {
    id: number
    channel: string
    img_url: string
    name: string
    order: number
    status: STATUS
    created_at: string
    updated_at: string
}

// 视频管理-产品管理-产品
export type ProductBasedata = {
    id: number
    type: VIPTYPE        //  1 vip. 2 金币 *
    title: string        // * 
    img: string         // 图片*
    price: number       // 原价 *
    buy_price: number   // 购买价格 *
    vip_level: VIPLEVLE   //* vip等级 0普通 1黄金  2钻石  3皇冠
    vip_day: number     //* vip天数
    coins: number       //* 金币
    status: STATUS      //* 0 下架   1上架 *
    sort: number             // 排序
    description: string // 描述*
    updated_at: string
    created_at: string
}
// 产品类型
export const productTypeOP = [
    { id: 1, label: 'vip', value: VIPTYPE.VIP },
    { id: 2, label: '金币', value: VIPTYPE.COIN },
]
// VIP等级
export const productVipLevelOP = [
    { id: 0, label: '普通', value: VIPLEVLE.NORMAL },
    { id: 1, label: '黄金', value: VIPLEVLE.GOLD },
    { id: 2, label: '钻石', value: VIPLEVLE.DIAMOND },
    { id: 3, label: '皇冠', value: VIPLEVLE.CROWN },
]

// // 视频管理-产品管理-产品支付配置
export type ProductPayBasedata = {
    id: number
    product_id: number    // 产品id
    type_id: number         // 支付类型列表id
    way_id: number           // 支付网关列表id
}

export type OrderBaseData = {
    id: number,
    user_id: number,
    product_id: number,
    order_id: string,            // 平台订单号
    app_order: string,         // 第三方订单号
    descp: string,                        // 描述
    order_type: number,
    amount: number,
    pay_amount: number,
    payway: string,
    pay_type_sdk: string,
    pay_url: string,
    status: ORDERSTATUS,                        // 订单状态: 0-未支付，2-支付中，3-支付完成，99-交易失败
    msg: string,
    channel: string,   // 渠道
    updated_at: string,
    created_at: string,
    expired_at: null,
    pay_type: string,
    goods_info: null,
    build_id: string
}
// 订单状态
export const orderStatusOP = [
    { id: 0, label: '未支付', value: ORDERSTATUS.NOTPAY },
    { id: 1, label: '支付中', value: ORDERSTATUS.PAYING },
    { id: 2, label: '已支付', value: ORDERSTATUS.PAID },
    { id: 3, label: '交易失败', value: ORDERSTATUS.FAIL },
]

// AppAnnouncementBaseData
export type AppAnnouncementBaseData = {
    id: number,
    content: string,
    status: STATUS,
    created_at: string,
    updated_at: string,
}

// banner 类型
export const bannerTypeOP = [
    { id: 1, label: '外部广告', value: BANNERTYPE.ADLINK },
    { id: 2, label: '内部视频', value: BANNERTYPE.VIDEO },
]