import { Input, Form } from "antd";
import React, { useState } from "react";
import { ImgUploader } from ".";
import './PicturesWall.scss'

type ImgProps = {
    url: string
    status?: 'error' | 'success' | 'done' | 'uploading' | 'removed' | 'idle'
    index: string,
    oid?: string
    data?: any
}

type PicturesWallProps = {
    category: string
    maxCount?: number
    showIndexInput?: boolean
    value?: ImgProps[]
    onChange?: (value: { url: string, index: string, status: string, data: any }[]) => void;
    /** 点击移除文件时的回调，返回值为 false 时不移除。支持返回一个 Promise 对象，Promise 对象 resolve(false) 或 reject 时不移除 */
    onRemove?: (file: any, data) => void | boolean | Promise<void | boolean>;
}

const IndexInput = (P) => {
    const {
        style,
        value,
        onChange
    } = P
    const [vindex, setVIndex] = useState(value);
    const onValuesChange = (e) => {
        const val = e.target.value;
        if (val) {
            setVIndex(e.target.value);
            triggerChange(e.target.value);
        } else {
            setVIndex('');
            triggerChange('');
        }
    }
    const triggerChange = (v) => {
        onChange?.(v);
    }

    return (
        <Input
            style={style}
            onChange={onValuesChange}
            value={vindex} />
    )
}
export class PicturesWall extends React.Component {
    maxImgCount: number;

    declare readonly props: PicturesWallProps;

    declare readonly state: { list: ImgProps[] };

    constructor(props: PicturesWallProps) {
        super(props);
        this.maxImgCount = this.props.maxCount && this.props.maxCount > 0 ? this.props.maxCount : 1;
        if (this.props.value && this.props.value.length) {
            let list = []
            for (let i = 0; i < this.props.value.length; i++) {
                const element = this.props.value[i];
                list.push({ oid: `oid_${i + 1}`, url: element.url, index: element.index != null && element.index != undefined ? `${element.index}` : `${i + 1}`, status: 'success', data: element.data });
            }
            if (list.length < this.maxImgCount) {
                list.push({ oid: `oid_${list.length + 1}`, url: '', index: `${list.length + 1}`, status: 'idle' });
            }
            this.state = { list: list }
        } else {
            this.state = { list: [{ oid: 'oid_1', url: '', index: '1', status: 'idle' }] }
        }
        // console.log('constructor', this.maxImgCount, props);
    }

    triggerChange = (curList?) => {
        let list = [];
        this.state.list.forEach((v) => {
            v.status != 'idle' && list.push({ url: v.url, index: v.index, status: v.status, data: v.data });
        });
        this.props.onChange?.(list);
    }

    changeUp = (oid: string, info: any) => {
        let list = this.state.list;
        // console.log('changeUp', oid, list, info);
        for (let index = 0; index < list.length; index++) {
            let element = list[index];
            if (oid == element.oid) {
                if (info.file.status == 'removed') {
                    list.splice(index, 1);
                    if (list.length <= 0) list = [{ oid: `${Date.now()}`, url: '', index: '1', status: 'idle' }];
                    if (!list[0].status && !list[0].url) list = [{ oid: `${Date.now()}`, url: '', index: '1', status: 'idle' }];
                    this.setState({ list: list });
                    this.triggerChange();
                } else if (info.file.status == 'uploading') {
                    let next = list[index + 1];
                    if (list.length < this.maxImgCount && !next) {
                        element.status = 'uploading';
                        list[index] = element;
                        list.push({ oid: `${Date.now()}`, url: '', index: `${list.length + 1}`, status: 'idle' });
                        this.setState({ list: list });
                        this.triggerChange();
                    }
                } else if (info.file.status == 'done') {
                    const { response } = info.file
                    if (response.code == 200) {
                        element.url = response.data.url;
                        element.status = 'success';
                        list[index] = element;
                        this.setState({ list: list });
                        this.triggerChange();
                    } else {
                        element.status = 'error';
                        list[index] = element;
                        this.setState({ list: list });
                        this.triggerChange();
                    }
                }
                break;
            }
        }
    }

    removeImg = (oid: string, file) => {
        return new Promise<any>((resolve, reject) => {
            // console.log('removeImg', oid, file)
            let list = this.state.list;
            for (let index = 0; index < list.length; index++) {
                let element = list[index];
                if (oid == element.oid) {
                    if (this.props.onRemove) {
                        const flag = this.props.onRemove(file, element.data);
                        // @ts-ignore
                        if (flag && flag.then) {
                            // @ts-ignore
                            flag.then((e) => {
                                resolve(e);
                            }).catch((err) => {
                                reject();
                            });
                        } else {
                            resolve(flag);
                        }
                    } else {
                        resolve(true);
                    }
                    break;
                }
            }
        });
    }

    renderItem = () => {
        let imgList = this.state.list
        // console.log('renderItem', imgList);
        return imgList.map((v, i) => {
            const validator = (rule, value) => {
                return new Promise((resolve, reject) => {
                    if (!value) {
                        reject();
                    } else {
                        const arr = (`${value}`).split('.');
                        const v = Number(value);
                        if (arr.length > 1) {
                            reject();
                        } else {
                            (!v || Number.isNaN(v) || v < 1) ? reject() : resolve(null);
                        }
                    }
                });
            }
            const onValuesChange = (e) => {
                // console.log('onValuesChange', e)
                validator('', e.target.value).then(() => {
                    let list = imgList;
                    for (let i = 0; i < list.length; i++) {
                        let element = list[i];
                        if (v.oid == element.oid) {
                            element.index = e.target.value;
                            list[i] = element;
                            this.setState({ list: list });
                            this.triggerChange();
                            break;
                        }
                    }
                }).catch(() => { });
            }
            const customItem = (v, i) => (this.props.showIndexInput ? (
                <Form.Item name={(i + 1)} rules={[{ required: true, message: '请输入序号', validator: validator }]} initialValue={v.index ? v.index : (i + 1)}>
                    {/* <IndexInput onChange={onValuesChange} style={{ width: 104, height: 25 }}></IndexInput> */}
                    <Input style={{ width: 104, height: 25 }} onChange={onValuesChange} />
                </Form.Item>
            ) : null)

            return (
                <ImgUploader
                    key={v.oid}
                    label="上传"
                    file_type="pic"
                    category={this.props.category}
                    maxCount={1}
                    value={v.url}
                    onUpChange={(info) => this.changeUp(v.oid, info)}
                    customItem={() => customItem(v, i)}
                    onRemove={(file) => this.removeImg(v.oid, file)} />
            )
        })
    }

    render() {
        const list = this.renderItem();
        return (
            <div className="picturesWall">
                {list}
            </div>
        )
    }
}
