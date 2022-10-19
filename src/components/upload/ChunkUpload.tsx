import _ from 'lodash';
import { Button, Col, message, Progress, Row, Space, List } from "antd"
import React from "react"
import pluploadJs from 'plupload-es6'
import style from '../../assets/style/chunkUpload.less'
import { DeleteOutlined, LoadingOutlined, PaperClipOutlined, UploadOutlined } from '@ant-design/icons';

type uploaderOp = {
    id?: any,
    uploadText?: string,
    /** 上传文件的接口地址 */
    url: string,
    /** 回显的文件列表 */
    defaultFileList?: any[],
    /** 上传文件的个数限制 */
    maxLength?: number,
    /** 单个文件size的最大限制，传带单位的字符串 */
    maxSize?: string,
    /** 上传组件返回的最终的文件列表 */
    getFileList: Function,
    /** 上传文件的类型限制 */
    accept: string,
    multipart?: boolean,
    /** 上传接口额外的传参 */
    multipart_params?: any,
    /** 当发生plupload.HTTP_ERROR错误时的重试次数，为0时表示不重试 */
    max_retries?: number,
    /** 分片的大小。传数字时 单位默认为字节，建议传带单位的字符串 */
    chunk_size?: string | number
}

const EVENTS = [
    'Init', 'PostInit', 'OptionChanged', 'Refresh', 'StateChanged', 'Browse', 'FileFiltered', 'QueueChanged', 'OptionChanged',
    'BeforeUpload', 'UploadProgress', 'FilesAdded', 'FilesRemoved', 'FileUploaded', 'ChunkUploaded',
    'UploadComplete', 'Destroy', 'Error', 'BeforeChunkUpload'
];

export class ChunkUpload extends React.Component {
    static checkUploader() {
        return pluploadJs && pluploadJs.plupload;
    }

    id = new Date().valueOf();

    container = null

    state = {
        files: [], uploadState: false, progress: {}, speed: {}
    }

    uploader;

    declare props: uploaderOp;

    componentDidMount() {
        if (ChunkUpload.checkUploader()) {
            this.runUploader();
        } else {
            setTimeout(() => {
                if (ChunkUpload.checkUploader()) {
                    this.runUploader();
                } else {
                    console.warn('Plupload has not initialized');
                }
            }, 500);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props != nextProps) {
            return false
        }
        return true
    }

    componentDidUpdate(prevProps, prevState) {
        if (ChunkUpload.checkUploader()) {
            this.uploader.refresh();
        }
        if (this.state.files != prevState.files) {
            if ((this.state?.files?.length && this.state.files.every((item) => item.uploaded))
                || this.state?.files?.length == 0
            ) {
                this.props.getFileList(this.state.files);
            }
        }
    }

    runUploader = () => {
        this.initUploader();
        this.uploader.init();

        EVENTS.forEach((event) => {
            const handler = this.props[`on${event}`];
            if (typeof handler === 'function') {
                this.uploader.bind(event, handler);
            }
        });
        // 当文件添加到上传队列后触发监听函数
        this.uploader.bind('FilesAdded', (up, files) => {
            if (_.get(this.props, 'multi_selection') === false) {
                this.clearAllFiles();
            } else {
                this.clearFailedFiles();
            }
            // const f = this.state.files;
            // _.map(files, (file) => {
            //     if (up.files.length > this.props.maxLength || f.length == this.props.maxLength) {
            //         message.error(`最多上传${this.props.maxLength}个文件`);
            //         this.uploader.stop()
            //         this.removeFile(file.id)
            //     } else {
            //         f.push(file);
            //     }
            // });
            // this.setState({ files: f }, () => {
            //     // if (this.props.autoUpload === true) {
            //     this.uploader.start();
            //     // }
            // });
            this.setState((prevState: any) => {
                const f = prevState.files;
                _.map(files, (file) => {
                    if (up.files.length > this.props.maxLength || f.length == this.props.maxLength) {
                        message.error(`最多上传${this.props.maxLength}个文件`);
                        this.uploader.stop()
                        this.removeFile(file.id)
                    } else {
                        f.push(file);
                    }
                });
                return { files: f }
            }, () => {
                // if (this.props.autoUpload === true) {
                this.uploader.start();
                // }
            });
        });
        // 当文件从上传队列移除后
        this.uploader.bind('FilesRemoved', (up, rmFiles) => {
            const stateFiles = this.state.files;
            const files = _.filter(stateFiles, (file) => _.find(rmFiles, { id: file.id }) !== -1);
            this.setState({ files: files });
        });
        // 当上传队列的状态发生改变时
        this.uploader.bind('StateChanged', (up) => {
            if (up.state === pluploadJs.plupload.STARTED && this.state.uploadState === false) {
                this.setState({ uploadState: true });
            }
            if (up.state !== pluploadJs.plupload.STARTED && this.state.uploadState === true) {
                this.setState({ uploadState: false });
            }
        });
        // 队列中的某一个文件上传完成后
        this.uploader.bind('FileUploaded', (up, file, responseObject) => {
            const stateFiles = JSON.parse(JSON.stringify(this.state.files));
            const response = JSON.parse(responseObject.response)
            _.map(stateFiles, (val, key) => {
                if (val.id === file.id) {
                    val.uploaded = true;
                    val.response = response
                    val.url = response.realUrl
                    stateFiles[key] = val;
                }
            });
            this.setState({ files: stateFiles });
        });
        // 当发生错误时触发监听函数
        this.uploader.bind('Error', (up, err) => {
            switch (err.code) {
                case -600:
                    return message.error(`上传文件最大为${this.props.maxSize}`)
                case -601:
                    return message.error(`上传文件类型为${this.props.accept}`);
                default:
                    break
            }
            if (_.isUndefined(err.file) !== true) {
                const stateFiles = this.state.files;
                _.map(stateFiles, (val, key) => {
                    if (val.id === err.file.id) {
                        val.error = err;
                        stateFiles[key] = val;
                    }
                });
                this.setState({ files: stateFiles });
            }
        });
        // 会在文件上传过程中不断触发，可以用此事件来显示上传进度监听函数
        this.uploader.bind('UploadProgress', (up, file) => {
            const stateProgress = this.state.progress;
            const stateSpeed = this.state.speed;
            stateProgress[file.id] = file.percent;
            stateSpeed[file.id] = up.total.bytesPerSec;
            this.setState({ progress: stateProgress, speed: stateSpeed });
        });
    }

    parseSizeStr = (size) => {
        if (typeof (size) !== 'string') {
            return size;
        }

        let muls = {
            t: 1099511627776,
            g: 1073741824,
            m: 1048576,
            k: 1024
        };
        let mul;

        size = /^([0-9\.]+)([tmgk]?)$/.exec(size.toLowerCase().replace(/[^0-9\.tmkg]/g, ''));
        mul = size[2];
        size = +size[1];

        if (muls.hasOwnProperty(mul)) {
            size *= muls[mul];
        }
        return Math.floor(size);
    }

    getComponentId = () => this.props.id || `react_plupload_${this.id}`

    initUploader = () => {
        if (this.props.defaultFileList) {
            this.setState({ files: this.props.defaultFileList })
        }
        this.uploader = new pluploadJs.plupload.Uploader(_.extend({
            container: `plupload_${this.props.id}`,
            runtimes: 'html5',
            multi_selection: false,
            multipart: true,
            chunk_size: '1mb',
            browse_button: this.getComponentId(),
            url: '/upload',
            required_features: true,
            filters: {
                mime_types: this.props.accept ? [
                    { title: "files filters", extensions: this.props.accept }
                ] : [],
                max_file_size: this.props.maxSize
            }
        }, this.props));
    }

    calSpeed = (speed) => {
        if (!speed) return 'B/s';
        if (speed < 1024) return `${speed}B/s`;
        if (speed < 1024 * 1024 && speed >= 1024) return `${(speed / 1024).toFixed(2)}KB/s`;
        return `${(speed / (1024 * 1024)).toFixed(2)}MB/s`;
    }

    // 选择文件列-
    list = () => {
        // console.log(11, this.state)
        return _.map(this.state.files, (val) => {
            const removeFile = (e) => {
                e.preventDefault();
                this.removeFile(val.id);
            };
            return (
                <React.Fragment key={val.id}>
                    {/* @ts-ignore */}
                    <Row gutter={10} wrap={false} className={style.listItem} style={{ color: '#8c8c8c' }}>
                        <Col flex="15px">{this.state.uploadState && val.uploaded !== true ? <LoadingOutlined /> : <PaperClipOutlined />}</Col>
                        {/* @ts-ignore */}
                        <Col flex="auto" className={[style.fileLink, !val.uploaded && style.fileAdd]}>
                            <a target="_blank" title={val.url} href={val.url} rel="noreferrer">{val.name}</a>
                        </Col>
                        {/* @ts-ignore */}
                        <Col flex="15px" onClick={removeFile}><DeleteOutlined className={style.deleteBtn} /></Col>
                    </Row>
                    {
                        (() => {
                            if (this.state.uploadState === true && val.uploaded !== true && _.isUndefined(val.error)) {
                                const percent = this.state.progress[val.id] || 0;
                                return (
                                    <Row style={{ width: '100%' }}>
                                        <Progress size="small" percent={percent} showInfo={false} />
                                    </Row>
                                )
                            }
                        })()
                    }
                    {
                        (() => {
                            if (!_.isUndefined(val.error)) {
                                return (
                                    <div className="alert alert-danger">
                                        {`Error: ${val.error.code}, Message: ${val.error.message}`}
                                    </div>
                                )
                            }
                            if (this.state.uploadState) {
                                const speed = this.state.speed[val.id] || 0;
                                return (
                                    <div className="alert">{this.calSpeed(speed)}</div>
                                )
                            }
                        })()
                    }
                </React.Fragment>
            )
        })
    }

    clearAllFiles = () => {
        const state = _.filter(this.state.files, (file) => {
            this.uploader.removeFile(file.id);
        });
        this.setState({ files: state });
    }

    clearFailedFiles = () => {
        const state = _.filter(this.state.files, (file) => {
            if (file.error) {
                this.uploader.removeFile(file.id);
            }
            return !file.error;
        });
        this.setState({ files: state });
    }

    removeFile = (id) => {
        this.uploader.removeFile(id);
        const state = _.filter(this.state.files, (file) => file.id !== id);
        this.setState({ files: state });
    }

    doUpload = (e) => {
        e.preventDefault();
        this.uploader.start();
    }

    render() {
        const list = this.list();
        const { files } = this.state
        return (
            <div id={`plupload_${this.props.id}`} className="my-list" ref={(ref) => { this.container = ref }}>
                <Space>
                    {/* 选择文件 */}
                    <Button
                        id={this.getComponentId()}
                        icon={<UploadOutlined />}>
                        {this.props.uploadText || '上传'}
                    </Button>
                </Space>
                {list.length > 0
                    && (
                        <List
                            size="small"
                            dataSource={list}
                            renderItem={(item) => item} />
                    )}
            </div>
        );
    }
}
