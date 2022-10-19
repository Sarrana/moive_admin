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
