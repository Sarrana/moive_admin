// 广告类型枚举
export const enum ADTYPE {
    INDEX_BANNER = "", // 首页—顶部
    MOVIE_BANNER = 1, // 电影—顶部
    DRAMA_BANNER = 2, // 电视剧—顶部
    VARIETY_BANNER =3, // 综艺—顶部
    ANIME_BANNER = 4, // 动漫—顶部
    PLAYER_PAUSE = 6, // 播放页-暂停广告
    INDEX_HOW_RECOMMAND = 7, // 首页-热映推荐列表广告 
}

// 状态枚举
export const enum STATUS {
    ON = '1',
    OFF = '0'
}


// VIP 类型
export const enum VIPTYPE {
    VIP = 1,
    COIN = 2
}

// VIP 等级
export const enum VIPLEVLE {
    NORMAL = 0,
    GOLD = 1,
    DIAMOND = 2,
    CROWN = 3
}

// 订单状态
export const enum ORDERSTATUS {
    NOTPAY = 0,
    PAYING = 2,
    PAID = 3,
    FAIL = 99
}

// 广告终端 枚举
export const enum ADTERMINAL {
    WEB = '1',
    APP = '2'
}

// banner 类型
export const enum BANNERTYPE {
    ADLINK = '1',
    VIDEO = '2'
}

// APP看板颜色
export const enum DATACOLOR {
    REGISTER = '#ff9900',
    ADD = '#ee6666',
    ACTIVE = '#73c0de'
}

// APP看板折线图展示最近多少天
export const LASTDAYS = 15

