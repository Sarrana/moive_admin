import moment from 'moment'
import type { Moment } from 'moment/moment'
import { EventEmitter } from 'eventemitter3'

export const event = new EventEmitter();

// @ts-ignore
export const getSearchParams = (searchParams: URLSearchParams): any => {
    let obj = {}
    searchParams.forEach((v, k) => { obj[k] = v });
    return obj;
}

export const timeToMoment = (time: string | Moment, format = 'YYYY-MM-DD HH:mm') => {
    if (!time) return null
    return moment(time, format);
}

export const momentToTime = (v: Moment, format = 'YYYY-MM-DD HH:mm') => {
    return moment(v).format(format);
}

export const uploadUrlFormatter = (url: string) => {
    const processEnv = import.meta.env;
    const uploadUrl = processEnv.VITE_APP_UPLOAD_URL;
    return uploadUrl + url;
}

export const sourceUrlFormatter = (url: string) => {
    const processEnv = import.meta.env;
    const sourceUrl = processEnv.VITE_APP_SOURCE_URL;
    return sourceUrl + url;
}

export const formatDuration = (time: number) => {
    // console.log('formatDuration', time);
    if (!time || Number.isNaN(time)) return '';
    const h = Math.floor(time / 3600);
    const m = Math.floor((time - h * 3600) / 60);
    const s = Math.floor(time - h * 3600 - m * 60);
    let str = "";
    if (h > 0) {
        str += `${h}时${m}分`;
    } else {
        if (m > 0) {
            str += `${m}分${s}秒`;
        } else {
            str += `${s}秒`;
        }
    }
    return str;
}

export const formatResolution = (w: number, h: number) => {
    // if (w <= 720 && h <= 480) return '480p';
    // if (w <= 1280 && h <= 768) return '720p';
    // if (w <= 1920 && h <= 1080) return '1080p';
    // if (w <= 2560 && h <= 1440) return '2k';
    // if (w <= 4096 && h <= 3112) return '4k';

    if (w <= 720 && h < 720) return '标清';
    if (w <= 1280 && h <= 768) return '高清';
    if (w <= 1920 && h <= 1080) return '超清';
    if (w <= 2560 && h <= 1440) return '2k';
    if (w <= 4096 && h <= 3112) return '4k';
}

export const concatArrayBuffer = (arrays: ArrayBuffer[]) => {
    let totalLen = 0;
    for (let arr of arrays) { totalLen += arr.byteLength; }
    let res = new Uint8Array(totalLen);
    let offset = 0;
    for (let arr of arrays) {
        let uint8Arr = new Uint8Array(arr);
        res.set(uint8Arr, offset);
        offset += arr.byteLength;
    }
    return res.buffer;
}

export const isEqual = (obj1, obj2) => {
    if ((obj1 === null || obj1 === undefined) && (obj2 === null || obj2 === undefined)) {
        return true
    }
    if ((obj1 === null || obj1 === undefined) && (obj2 !== null && obj2 !== undefined)) {
        return false
    }
    if ((obj2 === null || obj2 === undefined) && (obj1 !== null && obj1 !== undefined)) {
        return false
    }
    // 先判断这俩是不是对象或者数组类型的
    if ((typeof (obj1) !== "object" && obj1 !== null) || (typeof (obj2) !== "object" && obj2 !== null)) {
        return obj1 === obj2
    }
    // 如果特意传的就是两个指向同一地址的对象
    if (obj1 === obj2) {
        return true
    }
    // 如果key的个数都不一样那么肯定不能相等 return false
    const obj1key = Object.keys(obj1)
    const obj2key = Object.keys(obj2)
    if (obj1key.length !== obj2key.length) {
        return false
    }
    for (const key in obj1) {
        if (!isEqual(obj1[key], obj2[key])) {
            return false
        }
    }
    return true
}
