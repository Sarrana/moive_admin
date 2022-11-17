import './index.scss'
import { Button, Row, Col, Space, Card, message, Modal, Form, Radio, DatePicker } from 'antd';
import { memo, useEffect, useRef, useState } from 'react';
import { getVideoExamine_2, delVideoExamineApi_2, getVideoExamineEpListApi_2 } from '@/request';
import DPlayer, { DPlayerEvents } from 'dplayer'
import VideoPlayer from '@/components/videoPlayer'
import loading from '@/components/loading/Loading';
import { momentToTime, timeToMoment } from '@/utils';
import { ExclamationCircleOutlined } from '@ant-design/icons';

type NewUploadModalPropType = {
    params: any
    onHide: (v) => void
}
type VideoItem = {
    episodeSelected: any
}
const VidePlayItem = memo((P: VideoItem) => {
    const playerRef = useRef<DPlayer>()
    const { episodeSelected } = P
    console.log('VidePlayItem render...');
    const handlePlayerReady = (player: DPlayer) => {
        playerRef.current = player
        player.on('canplay' as DPlayerEvents, () => {
            const volume = player.video.volume
            console.log('canplay  ', volume, player.video.paused)
            if (player.video.paused) return
            const promise = player.video.play()
            if (promise !== undefined) {
                promise.catch(() => {
                    player.volume(0, true, false)
                    console.log('canplay  播放失败', player.video.volume)
                }).finally(() => {
                    player.video.play().then(() => {
                        player.volume(volume, true, false)
                        console.log('canplay  播放成功', player.video.volume)
                    })
                })
            }
        })

        player.on('play' as DPlayerEvents, () => {
        })

        player.on('stalled' as DPlayerEvents, () => {
            message.error('当前网速较慢')
        })
    }
    return (
        <div className="media-player" key={episodeSelected.id}>
            <VideoPlayer options={{ poster: '', url: episodeSelected.slice_url }} onReady={handlePlayerReady} />
        </div>
    )
})

export const NewUploadModal = (props: NewUploadModalPropType) => {
    const { params, onHide } = props
    const [form] = Form.useForm();
    const { confirm } = Modal;

    // const playerRef = useRef<DPlayer>()
    const [videoEpisodes, setVideoEpisodes] = useState<any[]>([])
    const [episodeSelected, setEpisodeSelected] = useState<any>(null)
    const [showBtn, setShowBtn] = useState<boolean>(false)
    const [isFormData, setFormData] = useState<{ timingtime: string, type: string }>({ timingtime: '', type: '1' })

    const isRefreshList = useRef(false)

    const changeEpisode = (value: any) => {
        if (value.id == episodeSelected.id) return
        setShowBtn(true)
        setEpisodeSelected(value)
    }

    const onCancel = () => {
        onHide(isRefreshList.current);
    }

    const confirmRefreshEp = () => {
        isRefreshList.current = true
        const a = videoEpisodes
        const new_a: any[] = []
        a.forEach((v) => {
            if (v.id === episodeSelected.id) { v.audit_wait = false }
            new_a.push(v)
        })
        // for (let index = 0; index < new_a.length; index++) {
        //     const element = new_a[index];
        //     if (element.audit_wait) {
        //         setEpisodeSelected(element)
        //         setShowBtn(true)
        //         break
        //     }
        // }
        setVideoEpisodes(new_a)
    }

    const refuseRefreshEp = () => {
        isRefreshList.current = true
        const a = videoEpisodes
        const new_a: any[] = []
        a.forEach((v) => {
            if (v.id !== episodeSelected.id) { new_a.push(v) }
        })
        // for (let index = 0; index < new_a.length; index++) {
        //     const element = new_a[index];
        //     if (element.audit_wait) {
        //         setShowBtn(true)
        //         setEpisodeSelected(element)
        //         break
        //     }
        // }
        setVideoEpisodes(new_a)
    }

    const onConfirm = () => {
        let params: any = {
            id: episodeSelected.id
        }
        form.validateFields().then((v: any) => {
            setShowBtn(false)
            if (v.timingtime) {
                params = {
                    id: episodeSelected.id,
                    timingtime: momentToTime(v.timingtime, 'YYYY-MM-DD HH:mm')
                }
            }
            getVideoExamine_2(params).then((res: any) => {
                message.success('审核成功');
                setShowBtn(false)
                confirmRefreshEp();
            });
        })
    }

    const onRefuse = () => {
        confirm({
            title: '是否确认删除这集视频',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                delVideoExamineApi_2(episodeSelected.id).then((res: any) => {
                    message.success('删除成功');
                    setShowBtn(false)
                    refuseRefreshEp();
                });
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    }

    const onRadioChange = (v) => {
        form.setFieldsValue({ publish: v.target.value });
        setFormData({ type: v.target.value, timingtime: '' })
    }

    const getDataList = () => {
        loading.show()
        getVideoExamineEpListApi_2(params.id).then((res: any) => {
            console.log(res, '21321')
            if (res.data.length > 0) {
                for (let index = 0; index < res.data.length; index++) {
                    const element = res.data[index];
                    // if (element.audit_wait) {
                    //     setEpisodeSelected(element)
                    //     setShowBtn(true)
                    //     break
                    // }
                    setEpisodeSelected(element)
                    setShowBtn(true)
                    break
                }
                setVideoEpisodes([...res.data])
            }
            loading.hide()
        }).catch(() => {
            loading.hide()
        });
    }

    const footerNode = (
        <Space size={[20, 10]}>
            <Button onClick={onCancel}>关闭</Button>
        </Space>
    )
    useEffect(() => {
        getDataList();
    }, [])

    return (
        <Modal
            className="examine-modal"
            centered
            closable={false}
            title={<div style={{ textAlign: 'center' }}>审核内容</div>}
            visible
            width={1200}
            destroyOnClose
            footer={footerNode}>
            <Space style={{ width: '100%' }} direction="vertical" size={[10, 20]}>
                <Row>
                    <Col span={24}>
                        <div className="title">{`${params.name}  ${episodeSelected ? `第${episodeSelected.episode}集` : ''}`}</div>
                    </Col>
                </Row>
                <Row gutter={[10, 20]}>
                    <Col span={24}>
                        <Space direction="horizontal" style={{ width: '100%' }}>
                            <div className="media-player-box">
                                {/* {episodeSelected
                                    && (
                                        <div className="media-player" key={episodeSelected.id}>
                                            <VideoPlayer options={{ poster: '', url: episodeSelected.slice_url }} onReady={handlePlayerReady} />
                                        </div>
                                    )} */}
                                {
                                    episodeSelected && <VidePlayItem episodeSelected={episodeSelected} />
                                }
                            </div>
                            <div style={{ width: '100%', flexShrink: 0 }}>
                                <Card className="ep-card" bodyStyle={{ padding: 0 }}>
                                    <Row gutter={[10, 10]}>
                                        {
                                            videoEpisodes.map((item, index) => (
                                                <Col span={4} key={item.id}>
                                                    <Button
                                                        style={{ width: 45 }}
                                                        // disabled={!item.audit_wait}
                                                        type={episodeSelected ? item.episode == episodeSelected.episode ? 'primary' : 'default' : 'default'}
                                                        onClick={() => { changeEpisode(item) }}>
                                                        {item.episode}
                                                    </Button>
                                                </Col>
                                            ))
                                        }
                                    </Row>
                                </Card>
                                {/* <Form labelCol={{ span: 4 }} form={form} preserve={false} style={{ opacity: showBtn ? 1 : 0, visibility: showBtn ? 'visible' : 'hidden' }}>
                                    <Form.Item label="发布状态">
                                        <Form.Item
                                            name="type"
                                            initialValue={isFormData.type}
                                            style={{ display: 'inline-block', margin: 0 }}>
                                            <Radio.Group onChange={onRadioChange}>
                                                <Radio value="1">立即发布</Radio>
                                                <Radio value="2">定时发布</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        {
                                            isFormData.type == '2'
                                                ? (
                                                    <Form.Item
                                                        name="timingtime"
                                                        initialValue={timeToMoment(isFormData.timingtime || '')}
                                                        style={{ display: 'inline-block', width: 150, margin: 0 }}
                                                        rules={[{ required: true, message: '请选择发布时间' }]}>
                                                        <DatePicker
                                                            showTime={{ format: 'HH:mm' }}
                                                            onOk={() => { }}
                                                            format="YYYY-MM-DD HH:mm" />
                                                    </Form.Item>
                                                ) : null
                                        }
                                    </Form.Item>

                                    <Space>
                                        <Form.Item style={{ margin: 0, opacity: showBtn ? 1 : 0, visibility: showBtn ? 'visible' : 'hidden' }}>
                                            <Button type="primary" onClick={onConfirm}>通过</Button>
                                        </Form.Item>
                                        <Form.Item style={{ margin: 0, opacity: showBtn ? 1 : 0, visibility: showBtn ? 'visible' : 'hidden' }}>
                                            <Button type="primary" onClick={onRefuse}>删除</Button>
                                        </Form.Item>
                                    </Space>
                                </Form> */}
                            </div>
                        </Space>
                    </Col>
                </Row>
                {/* <Row justify="center">
                    <Col>
                        {showBtn && (
                            <Space size={[20, 10]}>
                                <Button type="primary" onClick={onConfirm}>通过</Button>
                                <Button type="primary" onClick={onRefuse}>删除</Button>
                            </Space>
                        )}
                    </Col>
                </Row> */}
            </Space>
        </Modal>
    )
}
