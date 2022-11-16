export * from './video'
export * from './novel'
export * from './cartoon'

export type _OptionType = {
    id: number
    label: string,
    value: string,
    video_type?: _OptionType[]
}

export const opValToId = (op: _OptionType[], val) => {
    // console.log('opValToId ', op, val, op.find(v => v.value == val)?.id || null);
    return op.find((v) => v.value == val)?.id || null;
}
export const opIdToVal = (op: _OptionType[], id) => {
    // console.log('opIdToVal ', op, id, op.find(v => v.id == id)?.value || '');
    return op.find((v) => v.id == id)?.value || '';
}

export const defaultOp = [
    { id: 0, label: '全部', value: '全部' }
]

export const stateOp = [
    { id: 1, label: '开', value: '开' },
    { id: 2, label: '关', value: '关' }
]


export const terminalOp = [
    { id: 1, label: 'web', value: 'web' },
    { id: 2, label: 'h5', value: 'h5' }
]


export const resultOp = [
    { id: 1, label: '有', value: '有' },
    { id: 2, label: '无', value: '无' }
]



export const userTypeOp = [
    { id: 1, label: '邮箱注册', value: '邮箱注册' },
    { id: 2, label: '手机注册', value: '手机注册' },
    { id: 3, label: '未注册用户', value: '未注册用户' }
]

export const ipOp = [
    { id: 1, label: 'IP禁用', value: 'IP禁用' },
    { id: 2, label: 'IP未禁用', value: 'IP未禁用' }
]

export const genderOp = [
    { id: 1, label: '男', value: '男' },
    { id: 2, label: '女', value: '女' }
]

export const costOp = [
    { id: 1, label: '免费', value: '免费' },
    { id: 2, label: '积分', value: '积分' }
]

export const constellationOp = [
    { id: 1, label: '白羊座', value: '白羊座' },
    { id: 2, label: '金牛座', value: '金牛座' },
    { id: 3, label: '双子座', value: '双子座' },
    { id: 4, label: '巨蟹座', value: '巨蟹座' },
    { id: 5, label: '狮子座', value: '狮子座' },
    { id: 6, label: '处女座', value: '处女座' },
    { id: 7, label: '天秤座', value: '天秤座' },
    { id: 8, label: '天蝎座', value: '天蝎座' },
    { id: 9, label: '射手座', value: '射手座' },
    { id: 10, label: '摩羯座', value: '摩羯座' },
    { id: 11, label: '水瓶座', value: '水瓶座' },
    { id: 12, label: '双鱼座', value: '双鱼座' }
]

export const encryptionOp = [
    { id: 1, label: '未加密', value: '未加密' },
    { id: 2, label: '已加密', value: '已加密' },
    { id: 3, label: '加密中', value: '加密中' }
]

 

