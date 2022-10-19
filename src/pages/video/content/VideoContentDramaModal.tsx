import { Modal, Space, Form, Input, DatePicker, Button, Radio, message, Select, Upload } from "antd"
import { concatArrayBuffer, event, formatDuration, formatResolution, momentToTime, timeToMoment, uploadUrlFormatter } from "@/utils";
import { DramaInfo, _OptionType } from "@/type";
import { postDramaAddApi, postDramaEditApi } from "@/request";
import { useState } from "react";

type modalPropType = {
    show: boolean
    params: any,
    id: any,
    category: any,
    definitionArr: _OptionType[],
    onOk: () => void
    onCancel: () => void
}

export const VideoContentDramaModal = (props: modalPropType) => {
    let params: DramaInfo = props.params;
    let isEdit = Object.keys(params).length > 0;
    const title = isEdit ? "编辑内容" : "新增内容";
    let definitionOptionList = props.definitionArr;
    const [publish, setPublish] = useState(!params.release_status ? 1 : Number(params.release_status));
    const [videoUrl, setVideoUrl] = useState(params.url || '');
    const [duration, setDuration] = useState(params.duration || '');
    const [resolution, setResolution] = useState(params.resolution || '');
    const [tempVideoUrl, setTempVideoUrl] = useState('');
    const [tempDuration, setTempDuration] = useState('0');
    const [tempResolution, setTempResolution] = useState('');
    const [fileList, setFileList] = useState([]);
    console.log("VideoContentDramaModal ", publish, props);

    const [form] = Form.useForm();
    const onConfirm = () => {
        form.validateFields().then((v) => {
            console.log('values ...', videoUrl, v);
            // let data: any = {
            //     vid: props.id,
            //     episode: v.ep,
            //     url: videoUrl,
            //     duration: duration,
            //     resolution: resolution,
            // }
            // if (v.publish == 2) data.timingtime = momentToTime(v.timingtime, 'YYYY-MM-DD HH:mm');
            // if (isEdit) {
            //     if (params.release_status == 2) data.release = v.publish;
            //     postDramaEditApi(params.id, data).then((res: any) => {
            //         message.success('修改成功');
            //         props.onOk();
            //     });
            // } else {
            //     data.release = v.publish;
            //     postDramaAddApi(data).then((res: any) => {
            //         message.success('添加成功');
            //         props.onOk();
            //     });
            // }

            const file = v.video?.fileList[0];
            if (v.video && file) {
                let data: any = { isEdit: isEdit, did: params.id, vid: props.id, episode: v.ep }
                if (v.publish == 2) data.timingtime = momentToTime(v.timingtime, 'YYYY-MM-DD HH:mm');
                if (isEdit) {
                    if (params.release_status == 2) data.release = v.publish;
                } else {
                    data.release = v.publish;
                }
                event.emit("addTask", {
                    url: uploadUrlFormatter(`/api/admin/upload_test`),
                    file: file.originFileObj,
                    sendParams: { category: props.category },
                    params: data,
                    addFun: (status, msg?) => {
                        if (status == 'success') {
                            props.onCancel();
                        } else {
                            msg && message.warn(msg);
                        }
                    },
                    uploadFun: (res: { url: string, mediaInfo: any, params: any }) => {
                        const track = res.mediaInfo.media.track;
                        let fileDuration = '0';
                        let resolution = '';
                        if (track) {
                            const fileWidth = Number(track[1].Width);
                            const fileHeight = Number(track[1].Height);
                            fileDuration = track[0].Duration
                            resolution = formatResolution(fileWidth, fileHeight);
                            console.log("track >>> ", fileDuration, fileWidth, fileHeight, resolution);
                        }

                        if (res.params.isEdit) {
                            postDramaEditApi(res.params.did, { ...res.params, url: res.url, duration: fileDuration, resolution: resolution }).then((res: any) => {
                                message.success('修改成功');
                                event.emit("refreshDramaList");
                            });
                        } else {
                            postDramaAddApi({ ...res.params, url: res.url, duration: fileDuration, resolution: resolution }).then((res: any) => {
                                message.success('添加成功');
                                event.emit("refreshDramaList");
                            });
                        }
                    }
                });
            } else {
                let data: any = {
                    vid: props.id,
                    episode: v.ep,
                    url: videoUrl,
                    duration: duration,
                    resolution: resolution
                }
                if (v.publish == 2) data.timingtime = momentToTime(v.timingtime, 'YYYY-MM-DD HH:mm');
                if (params.release_status == 2) data.release = v.publish;
                postDramaEditApi(params.id, data).then((res: any) => {
                    message.success('修改成功');
                    props.onOk();
                });
            }
        }).catch((errorInfo) => {
            console.log('errorInfo ...', errorInfo);
        });
    }
    const onCancel = () => {
        props.onCancel();
    }
    const footerNode = (
        <Space size={[20, 10]}>
            <Button type="primary" onClick={onConfirm}>保存</Button>
            <Button onClick={onCancel}>取消</Button>
        </Space>
    )
    const onRadioChange = (v) => {
        // console.log('onRadioChange', v);
        form.setFieldsValue({ publish: v.target.value });
        setPublish(v.target.value);
    }

    const videoRule = {
        required: true,
        message: '请上传视频文件',
        // validateTrigger: ['onChange', 'onRemove'],
        validator: (rule, value) => {
            return new Promise((resolve, reject) => {
                // console.log('validator', videoUrl, value);
                if (isEdit) {
                    if (value && value.fileList.length) {
                        resolve(null);
                    } else {
                        videoUrl && videoUrl.length ? resolve(null) : reject();
                    }
                } else {
                    value && value.fileList.length ? resolve(null) : reject();
                }
                // videoUrl && videoUrl.length ? resolve(null) : reject();
            });
        }
    }
    const getMediainfo = (mediainfo, res) => {
        const getSize = () => res.size;
        const readChunk = (chunkSize, offset) => new Promise<any>((resolve, reject) => {
            let end = offset + chunkSize;
            let startIndex = Math.floor(offset / res.chunkSize);
            let endIndex = Math.floor(end / res.chunkSize);
            if (startIndex == endIndex) {
                resolve(new Uint8Array(res.fileDataArr[endIndex].slice(offset - startIndex * res.chunkSize, end - startIndex * res.chunkSize)));
            } else {
                let a = res.fileDataArr[startIndex];
                let b = res.fileDataArr[endIndex];
                let aArr = a.slice(offset - a * res.chunkSize);
                let bArr = a.slice(0, end - b * res.chunkSize);
                let dif = endIndex - startIndex;
                if (dif == 1) {
                    resolve(new Uint8Array(concatArrayBuffer([aArr, bArr])));
                } else {
                    let arr = [aArr];
                    for (let index = startIndex + 1; index < endIndex; index++) {
                        let element = res.fileDataArr[index];
                        arr.push(element);
                    }
                    arr.push(bArr);
                    resolve(new Uint8Array(concatArrayBuffer(arr)));
                }
            }
        });
        mediainfo.analyzeData(getSize, readChunk).then((result) => {
            console.log("track >>> ", result);
            const track = result.media.track;
            const fileWidth = track[1].Width;
            const fileHeight = track[1].Height;
            const fileDuration = track[0].Duration

            // setTempDuration(track[0].Duration);
            // setTempResolution(formatResolution(fileWidth, fileHeight));
            console.log("track >>> ", fileDuration, fileWidth, fileHeight);
            const d = formatResolution(fileWidth, fileHeight);
            setDuration(fileDuration);
            setResolution(d);
            setVideoUrl(res.url);
            form.validateFields(['video']);
            form.setFieldsValue({ duration: formatDuration(Number(fileDuration)) });
            form.setFieldsValue({ resolution: d });
        }).catch((error) => {
            console.log('error >> ', error);
        });
    }
    const option = {
        // url: uploadUrlFormatter(`/api/uploads/common_upload/video/temp`),
        url: 'http://192.168.0.30:8188/api/admin/upload_test',
        chunk_size: "50mb",
        maxLength: 1,
        getFileList: (fileList) => {
            console.log("FileList", fileList);
            if (fileList && fileList.length) {
                const res = fileList[0].response;
                if (res.status == 'success') {
                    // setVideoUrl(res.data.url);
                    // setDuration(tempDuration);
                    // setResolution(tempResolution);
                    // form.validateFields(['video']);
                    // form.setFieldsValue({ duration: formatDuration(Number(tempDuration)) });
                    // form.setFieldsValue({ resolution: tempResolution });
                } else {
                    res.message && message.error(res.message);
                }
            }
        },
        multipart_params: {
            context: 0,
            from: 'web',
            id: 'WU_FILE_0',
            name: 'test2.mp4',
            type: 'video/mp4',
            lastModifiedDate: 'Mon Dec 20 2021 19: 44: 06 GMT + 0800(中国标准时间)',
            size: 1161247,
            md5: 'e0722b30c09e41d1d1a94df14751b80d',
            chunks: 1,
            chunk: 0
        },
        accept: 'mp4,mkv,avi,ts,rmvb,m2ts',
        max_retries: 1,
        onChunkUploaded: (uploader, file, response) => {
            // console.log('onChunkUploaded ', uploader, file, response)
        },
        onFilesAdded: (uploader, file) => {
            console.log('onFilesAdded ', uploader, file);
            const reader = new FileReader();
            const f = file[0].getNative();
            reader.readAsArrayBuffer(f);
            reader.addEventListener('load', (e) => {
                // console.log('addUpTask1 result ', e.target.result);
                // @ts-ignore
                // MediaInfo({ format: 'object' }, (mediainfo) => {
                //     getMediainfo(mediainfo, e.target.result);
                // });
            })
        },
        onBeforeChunkUpload: (uploader, file) => {
            console.log('onBeforeChunkUpload ', uploader, file);
        },
        // onUploadProgress: (uploader, file) => {
        //     console.log('onUploadProgress ', uploader, file);
        // },
        onFilesRemoved: (uploader, file) => {
            console.log('onFilesRemoved ', uploader, file)
        },
        onFileFiltered: (uploader, file) => {
            console.log('onFileFiltered ', uploader, file)
        }
    }

    const option1 = {
        action: '',
        accept: 'video/mp4',
        // 上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
        listType: 'text',
        maxCount: 1,
        fileList: fileList,
        showUploadList: true,
        beforeUpload: (file) => {
            const canUp = file.type == 'video/mp4';
            if (!canUp) {
                message.error('只能上传 mp4 文件!');
            }
            return canUp;
        },
        customRequest: () => { },
        iconRender: () => { },
        onChange: (e) => {
            console.log('onChange', e);
            setFileList(e.fileList);
            if (e.file.status == 'uploading') {
                setVideoUrl('');
            } else if (e.file.status == "removed") {
                setVideoUrl(params.url || '');
            }
        }
    }

    const fileType = ['video/mp4', 'video/x-matroska', 'video/quicktime', 'video/mpeg', 'video/avi'];
    const option2 = {
        category: props.category,
        fileCheck: (file) => {
            const canUp = fileType.some((v) => file.type == v);
            if (!canUp) {
                message.error('只能上传 mp4/mkv/mov/mpg/avi 文件!');
            }
            return canUp;
        },
        startUpload: (file) => {
            setVideoUrl('');
        },
        handleOk: (res) => {
            console.log("uploadSuc", res);
            const track = res.mediaInfo.media.track;
            let fileDuration = '0';
            let resolution = '';
            if (track) {
                const fileWidth = track[1].Width;
                const fileHeight = track[1].Height;
                fileDuration = track[0].Duration
                resolution = formatResolution(fileWidth, fileHeight);
                console.log("track >>> ", fileDuration, fileWidth, fileHeight, resolution);
            }
            setDuration(fileDuration);
            setResolution(resolution);
            setVideoUrl(res.url);
            form.setFieldsValue({ duration: formatDuration(Number(fileDuration)) });
            form.setFieldsValue({ resolution: resolution });
            form.validateFields(['video']);
        },
        onRemove: () => {
            setVideoUrl(params.url || '');
            setDuration(params.duration || '');
            setResolution(params.resolution || '');
            form.setFieldsValue({ duration: formatDuration(Number(params.duration)) });
            form.setFieldsValue({ resolution: params.resolution || '' });
        }
    }

    return (
        <Modal
            centered
            closable={false}
            title={<div style={{ textAlign: 'center' }}>{title}</div>}
            visible={props.show}
            width={600}
            destroyOnClose
            footer={footerNode}>
            <Form labelCol={{ span: 4 }} form={form} preserve={false}>
                <Form.Item label="剧集编号" name="ep" rules={[{ required: true, message: '请输入剧集编号' }]} initialValue={params.episode}>
                    <Input type="number" style={{ width: 150 }} />
                </Form.Item>
                <Form.Item label="上传剧集" name="video" rules={[videoRule]}>
                    {/* <ChunkUpload {...option}></ChunkUpload> */}
                    {/* @ts-ignore */}
                    <Upload {...option1}>
                        <Button type="primary">上传</Button>
                    </Upload>
                    {/* <FileUploader {...option2}></FileUploader> */}
                </Form.Item>
                {/* <Form.Item label="剧集时长" name="duration" rules={[{ required: true, message: '请输入剧集时长' }]} initialValue={params.duration}> */}
                <Form.Item label="剧集时长" name="duration" initialValue={formatDuration(Number(params.duration))}>
                    <Input style={{ width: 150 }} disabled />
                </Form.Item>
                {/* <Form.Item label="剧集时长" name="duration" initialValue={Number(params.duration)}>
                    <Input type="number" style={{ width: 150 }} placeholder="单位分钟" />
                </Form.Item> */}
                {/* <Form.Item label="分辨率" name="resolution" rules={[{ required: true, message: '请选择分辨率' }]} initialValue={params.resolution}>
                    <Select style={{ width: 100 }}>
                        {
                            definitionOptionList.map((status) => (
                                <Select.Option value={status.label} key={status.label}>
                                    {status.label}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item> */}
                <Form.Item label="分辨率" name="resolution" initialValue={params.resolution}>
                    <Input style={{ width: 150 }} disabled />
                </Form.Item>
                {/* <Form.Item label="已完结" name="end" valuePropName="checked" initialValue={!!params.end}>
                    <Checkbox>{"已完结"}</Checkbox>
                </Form.Item> */}
                {
                    params.release_status != 1 && (
                        <Form.Item label="发布状态">
                            <Form.Item
                                name="publish"
                                initialValue={publish}
                                style={{ display: 'inline-block', margin: 0 }}>
                                <Radio.Group onChange={onRadioChange}>
                                    <Radio value={1}>立即发布</Radio>
                                    <Radio value={2}>定时发布</Radio>
                                </Radio.Group>
                            </Form.Item>
                            {
                                publish == 2
                                    ? (
                                        <Form.Item
                                            name="timingtime"
                                            initialValue={timeToMoment(params?.timingtime || '')}
                                            style={{ display: 'inline-block', width: 150, margin: 0 }}
                                            rules={[{ required: true, message: '请选择发布时间' }]}>
                                            <DatePicker
                                                // value={timeToMoment(params?.timingtime || '')}
                                                showTime={{ format: 'HH:mm' }}
                                                onOk={() => { }}
                                                format="YYYY-MM-DD HH:mm" />
                                        </Form.Item>
                                    ) : null
                            }
                        </Form.Item>
                    )
                }
            </Form>
        </Modal>
    )
}
