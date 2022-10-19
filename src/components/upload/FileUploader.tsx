/* global MediaInfo */
import React, { useEffect, useState } from 'react'
import { message, Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { uploadVideoApi } from '@/request'
import SparkMD5 from 'spark-md5';
import axios from '@/request/axios'
import { CancelTokenSource } from 'axios';
import { concatArrayBuffer } from '@/utils';

const processEnv = import.meta.env
type FileUploaderProps = {
    className?: string
    category: string
    fileCheck?: (file) => boolean
    startUpload?: (file) => void
    onRemove?: (file) => void
    handleOk: (res: { url: string, mediaInfo: any }) => void
}
export const FileUploader: React.FC<FileUploaderProps> = (P) => {
    const {
        className,
        category,
        handleOk,
        fileCheck,
        onRemove,
        startUpload
    } = P

    const readSize = 100 * 1024 * 1024; // 50M 为单位
    const chunkSize = 100 * 1024 * 1024; // 50M 为单位
    const [isLoading, setLoading] = useState<boolean>(false)
    const [disabled, setDisabled] = useState<boolean>(false)
    const [totalChunk, setTotalChunk] = useState<number>(0)
    const [currentChunk, setCurrentChunk] = useState<number>(0);
    const [cancelUpload, setCancelUpload] = useState<CancelTokenSource>(null);
    const [tips, setTips] = useState<string>('上传文件');
    const [fileReaderCache, setFileReaderCache] = useState<FileReader>(null);
    const [timeoutCache, setTimeoutCache] = useState(null);
    const sliceRead = (file, start, end) => new Promise((res) => {
        const fileReader = new FileReader();
        fileReader.onabort = (e) => {
            // console.log('onabort ', e);
            res(null);
        }
        fileReader.onerror = (e) => {
            console.log('onerror ', fileReader.error, e);
            res(null);
        }
        fileReader.onload = (e) => {
            // console.log('onload ', e);
            res(e.target.result);
        }
        console.log('开始读取文件 ', start, end);
        fileReader.readAsArrayBuffer(file.slice(start, end));
        setFileReaderCache(fileReader);
    })
    const readFile = (file) => new Promise<ArrayBuffer[]>(async (resolve, reject) => {
        const size = file.size;
        const reads = Math.ceil(size / readSize);
        console.log('分段读取文件 ', reads, readSize);
        const arrays = [];
        let b = false;
        for (let index = 0; index < reads; index++) {
            const start = index * readSize;
            const end = start + readSize;
            let a = await sliceRead(file, start, end);
            if (!a) {
                b = true;
                break;
            }
            arrays.push(a);
        }
        b ? reject() : resolve(arrays);
    })
    const getMediainfo = (data) => new Promise((resolve, reject) => {
        // @ts-ignore
        MediaInfo({ format: 'object' }, (mediainfo) => {
            const getSize = () => data.size;
            const readChunk = (chunkSize, offset) => new Promise<any>((res, rej) => {
                let end = offset + chunkSize;
                let startIndex = Math.floor(offset / data.chunkSize);
                let endIndex = Math.floor(end / data.chunkSize);
                if (startIndex == endIndex) {
                    res(new Uint8Array(data.fileDataArr[endIndex].slice(offset - startIndex * data.chunkSize, end - startIndex * data.chunkSize)));
                } else {
                    let a = data.fileDataArr[startIndex];
                    let b = data.fileDataArr[endIndex];
                    let aArr = a.slice(offset - a * data.chunkSize);
                    let bArr = a.slice(0, end - b * data.chunkSize);
                    let dif = endIndex - startIndex;
                    if (dif == 1) {
                        res(new Uint8Array(concatArrayBuffer([aArr, bArr])));
                    } else {
                        let arr = [aArr];
                        for (let index = startIndex + 1; index < endIndex; index++) {
                            let element = data.fileDataArr[index];
                            arr.push(element);
                        }
                        arr.push(bArr);
                        res(new Uint8Array(concatArrayBuffer(arr)));
                    }
                }
            });
            mediainfo.analyzeData(getSize, readChunk).then((result) => {
                console.log("track >>> ", result);
                resolve(result);
            }).catch((error) => {
                console.log('track error >> ', error);
                resolve(null);
            });
        });
    })
    const beforeUpload = (file: any) => {
        if (fileCheck) {
            const check = fileCheck(file);
            if (!check) {
                return Upload.LIST_IGNORE;
            }
        }
        return new Promise((resolve, reject) => {
            console.log('文件信息', file);
            startUpload && startUpload(file);
            setTips("读取中");
            setLoading(true);
            setDisabled(true);
            reject();
            readFile(file).then(async (fileDataArr) => {
                // console.log('文件读取完成 ', fileDataArr);
                setTotalChunk(0);
                const { name: filename, size, type } = file;
                const md5FileHash = SparkMD5.hash(`${file.lastModified}_${file.size}_${file.type}`); // 文件的唯一标识
                console.log('md5Hash', md5FileHash);
                // 计算文件分片数量与大小
                let chunks = null;
                let successFlag = 0;
                let isFail = false;
                chunks = Math.ceil(file.size / chunkSize);
                setTotalChunk(chunks);
                setCurrentChunk(successFlag);
                setTips(`（${successFlag}/${chunks}）`);
                const delay = (time) => new Promise((resolve) => {
                    const timeout = setTimeout(resolve, time);
                    setTimeoutCache(timeout);
                }); // sleep函数
                const fail = () => {
                    if (isFail) return;
                    isFail = true;
                    message.error('上传失败');
                    setLoading(false);
                    setTotalChunk(0);
                    setCurrentChunk(0);
                    setTips('上传失败');
                }
                let CancelToken = axios.CancelToken;
                let cToken = CancelToken.source();
                setCancelUpload(cToken);
                // handleOk({ url: processEnv.VITE_APP_UPLOAD_URL + '/', chunkSize: chunkSize, size: size, fileDataArr: fileDataArr });
                for (let index = 0; index < chunks; index += 1) {
                    const end = (index + 1) * chunkSize >= file.size ? file.size : (index + 1) * chunkSize;
                    let sectionData = new window.File([file.slice(index * chunkSize, end)], filename, { type })// 文件切片
                    const formData = new FormData();
                    formData.set('chunk', String(index));
                    formData.set('chunks', String(chunks));
                    formData.set('size', String(sectionData.size));
                    formData.set('from', category);
                    formData.set('id', '1');
                    formData.set('md5', md5FileHash);
                    formData.set('lastModifiedDate', String(new Date().getTime()));
                    formData.set('name', String(filename));
                    formData.set('type', String(type));
                    formData.set('file', sectionData);
                    let maxUploadNum = 3; // 最大尝试上传失败分片文件次数;
                    // 上传文件流
                    const uploadChunkFunc = () => {
                        if (isFail) return;
                        uploadVideoApi(formData, {
                            cancelToken: cToken.token,
                            requestType: 'uploadVideo',
                            timeout: 120000
                        }).then(async (res: any) => {
                            if (res.code == 200) {
                                successFlag += 1;
                                setTotalChunk(chunks)
                                setCurrentChunk(successFlag)
                                setTips(`（${successFlag}/${chunks}）`);
                                if (successFlag >= chunks) {
                                    console.log('上传完成 >>> ', res);
                                    if (res.data && res.data.video_upload) {
                                        const t = await getMediainfo({ size: size, chunkSize: readSize, fileDataArr: fileDataArr });
                                        setLoading(false);
                                        setDisabled(false);
                                        handleOk({ url: `${processEnv.VITE_APP_UPLOAD_URL}/${res.data.video_upload}`, mediaInfo: t });
                                        message.success('上传成功');
                                    } else {
                                        fail();
                                    }
                                }
                            } else {
                                // 上传失败，继续进行请求
                                maxUploadNum -= 1;
                                if (maxUploadNum > 0) {
                                    uploadChunkFunc();
                                } else {
                                    fail();
                                }
                            }
                        }).catch(() => {
                            // 上传失败，继续进行请求
                            maxUploadNum -= 1;
                            if (maxUploadNum > 0) {
                                uploadChunkFunc();
                            } else {
                                fail();
                            }
                        });
                    };
                    uploadChunkFunc();
                    // 分片间隔时间
                    await delay(1000);
                }
            }).catch((e) => {
                console.log('文件读取失败 ', e);
                message.error('文件读取失败');
                setTotalChunk(0);
                setCurrentChunk(0);
                setLoading(false);
                setDisabled(false);
                onRemove && onRemove(file);
                reject(Upload.LIST_IGNORE);
                // return Upload.LIST_IGNORE;
            });
        });
    }
    const removeFile = (file) => {
        console.log("removeFile   ");
        fileReaderCache && fileReaderCache.abort();
        timeoutCache && clearTimeout(timeoutCache);
        cancelUpload && cancelUpload.cancel('cancelUpload');
        setFileReaderCache(null);
        setTotalChunk(0);
        setCurrentChunk(0);
        setTips('上传文件');
        setLoading(false);
        setDisabled(false);
        onRemove && onRemove(file);
        return true;
    }

    useEffect(() => () => {
        console.log("卸载组件 FileUploader   ");
        fileReaderCache && fileReaderCache.abort();
        timeoutCache && clearTimeout(timeoutCache);
        cancelUpload && cancelUpload.cancel('cancelUpload');
        setFileReaderCache(null);
    }, []);

    return (
        <Upload
            name="file"
            className={className}
            maxCount={1}
            /* @ts-ignore */
            beforeUpload={beforeUpload}
            data={{}}
            onRemove={removeFile}>
            <Button type="primary" icon={<UploadOutlined />} loading={isLoading} disabled={disabled}>
                {tips}
            </Button>
        </Upload>
    )
}
