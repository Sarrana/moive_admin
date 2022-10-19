/* global JSX */
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { message, Upload, Modal, Input, Form } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { isEqual, uploadUrlFormatter } from '@/utils'
import { UploadFile } from 'antd/lib/upload/interface'

type imgUploaderProps = {
    accept?: string
    label?: string
    className?: string
    // style?: React.CSSProperties
    // picWidth?: string
    // picHeight?: string
    file_type: string
    category: string
    multiple?: boolean
    maxCount?: number
    value?: { url: string, uid?: string, name?: string }[] | string
    onUpChange?: (value: any) => void;
    onChange?: (value: any) => void;
    /** 点击移除文件时的回调，返回值为 false 时不移除。支持返回一个 Promise 对象，Promise 对象 resolve(false) 或 reject 时不移除 */
    onRemove?: (file: any) => void | boolean | Promise<void | boolean>;
    customItem?: () => JSX.Element;
    itemRender?: (originNode: ReactElement, file: UploadFile, fileList: object[], actions: { download: Function, preview: Function, remove: Function }) => React.ReactNode
}

const getBase64 = (file) => {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
        message.error('只能上传jpeg/png')
    }
    return isJpgOrPng
}

export const ImgUploader: React.FC<imgUploaderProps> = (P) => {
    const {
        accept,
        label,
        className,
        file_type,
        category,
        value,
        maxCount,
        multiple,
        onUpChange,
        onChange,
        onRemove,
        customItem,
        itemRender
    } = P
    // console.log('ImgUploader  ', value)
    const [isLoading, setLoading] = useState<boolean>(false);
    const [imageList, setImageList] = useState<{ url: string, uid?: string, name?: string, status?: string }[]>([]);
    const [previewInfo, setPreviewInfo] = useState({ previewImage: '', previewVisible: false, previewTitle: '' });
    const [fileList, setFileList] = useState([]);
    const [maxImgCount, setMaxImgCount] = useState(maxCount && maxCount > 0 ? maxCount : 0);
    // const [count, setCount] = useState(0);
    const oldValue = useRef(null)

    const initOrImageList = () => {
        // console.log(11111111111, value, oldValue.current)
        // console.log(222, count, value, oldValue.current == value, isEqual(value, oldValue.current))
        if (isEqual(value, oldValue.current)) return
        oldValue.current = value
        // setCount(count + 1)
        if (typeof value == 'string') {
            if (value) {
                // setImageList([{ url: value, uid: 'uid_1', name: value.substring(value.lastIndexOf('/') + 1) }]);
                // setFileList([{ status: 'done', url: value, uid: 'uid_1', name: value.substring(value.lastIndexOf('/') + 1) }]);
                setImageList([{ status: 'done', url: value, uid: 'uid_1', name: '' }]);
                setFileList([{ status: 'done', url: value, uid: 'uid_1', name: '' }]);
                triggerChange([{ status: 'done', url: value, uid: 'uid_1', name: '' }], [{ status: 'done', url: value, uid: 'uid_1', name: '' }])
            }
        } else {
            if (value && value.length) {
                let imgArr = [];
                let fileArr = [];
                value.forEach((v, i) => {
                    // imgArr.push({ url: v.url, uid: v.uid ? v.uid : 'uid_' + (i + 1), name: v.name ? v.name : v.url.substring(v.url.lastIndexOf('/') + 1) });
                    // fileArr.push({ status: 'done', url: v.url, uid: v.uid ? v.uid : 'uid_' + (i + 1), name: v.name ? v.name : v.url.substring(v.url.lastIndexOf('/') + 1) });
                    imgArr.push({ status: 'done', url: v.url, uid: v.uid ? v.uid : `uid_${i + 1}`, name: v.name ? v.name : '' });
                    fileArr.push({ status: 'done', url: v.url, uid: v.uid ? v.uid : `uid_${i + 1}`, name: v.name ? v.name : '' });
                });
                setImageList(imgArr);
                setFileList(fileArr);
                triggerChange(fileArr, imgArr)
            }
        }
    }

    const triggerChange = (info, images: any[]) => {
        onUpChange?.(info);
        if (maxImgCount) {
            onChange?.(images.slice(0, maxImgCount));
        } else {
            onChange?.(images);
        }
    }

    const handleChange = (info: any) => {
        let files = fileList;
        let imgs = imageList;
        console.log('handleChange', info, files);
        setFileList(info.fileList);
        if (info.file.status === 'removed') {
            setLoading(false);
            for (let index = 0; index < imgs.length; index++) {
                const element = imgs[index];
                if (element.uid == info.file.uid) {
                    // files.splice(index, 1);
                    imgs.splice(index, 1);
                    setImageList(imgs);
                    triggerChange(info, imgs);
                    break;
                }
            }
            return
        }
        if (info.file.status === 'uploading') {
            setLoading(true);
            // if (!imgs.some(v => v.uid == info.file.uid) && imgs.length < maxImgCount) {
            if (!imgs.some((v) => v.uid == info.file.uid)) {
                if (maxImgCount) {
                    if (imgs.length < maxImgCount) {
                        imgs.push({ status: 'uploading', url: '', uid: info.file.uid, name: info.file.name });
                        setImageList(imgs);
                    }
                } else {
                    imgs.push({ status: 'uploading', url: '', uid: info.file.uid, name: info.file.name });
                    setImageList(imgs);
                }
            }
            triggerChange(info, imgs);
            return;
        }
        if (info.file.status === 'done') {
            const { response } = info.file
            setLoading(false);
            for (let index = 0; index < imgs.length; index++) {
                let element = imgs[index];
                if (element.uid == info.file.uid) {
                    if (response.code == 200) {
                        element.url = response.data.url;
                        element.name = response.data.original_name;
                    } else {
                        message.error(response.message);
                    }
                    element.status = 'done';
                    imgs[index] = element;
                    break;
                }
            }
            setImageList(imgs);
            triggerChange(info, imgs)
        }
    }

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewInfo({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
        });
    };

    const handleClosePreview = () => setPreviewInfo({ ...previewInfo, previewVisible: false });

    const uploadButton = (
        <div>
            {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
            {label && <div style={{ marginTop: 8 }}>{label}</div>}
        </div>
    )

    useEffect(() => {
        initOrImageList()
    }, [value])

    return (
        <div className="img_uploader_container">
            <Upload
                accept={accept || 'image/jpeg,image/png'}
                // @ts-ignore
                multiple={multiple}
                fileList={fileList}
                name="file"
                listType="picture-card"
                className={className}
                data={{}}
                action={uploadUrlFormatter(`/api/uploads/common_upload/${file_type}/${category}`)}
                // beforeUpload={beforeUpload}
                onChange={handleChange}
                onPreview={handlePreview}
                maxCount={maxImgCount}
                onRemove={onRemove}
                itemRender={itemRender}>
                {maxImgCount ? fileList.length >= maxImgCount ? null : uploadButton : uploadButton}
            </Upload>
            {customItem && customItem()}
            <Modal
                visible={previewInfo.previewVisible}
                title={previewInfo.previewTitle}
                footer={null}
                onCancel={handleClosePreview}>
                <img alt="example" style={{ width: '100%' }} src={previewInfo.previewImage} />
            </Modal>
        </div>
    )
}
