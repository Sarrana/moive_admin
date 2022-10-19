import './index.scss'
import React, { useEffect, useRef, useState } from 'react'
import DPlayer, { DPlayerEvents } from 'dplayer'
import VideoPlayer from '@/components/videoPlayer'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { getVideoPreview_2 } from '@/request'
import { Button, message } from 'antd'
import { getSearchParams } from '@/utils'

const PlayerPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const obj = getSearchParams(searchParams);
    const state = location.state;
    // console.log('PlayerPage ', obj)

    const playerRef = useRef<DPlayer>()
    const [videoSource, setVideoSource] = useState(null)
    const [playerOptions, setPlayerOptions] = useState<{ poster: string, url: string } | null>(null)

    const onBack = () => {
        navigate('/Video2/ContentMgr/ExamineMgr', { state: state, replace: false });
    }

    const getVideoData = () => {
        getVideoPreview_2(obj.id)
            .then((r: any) => {
                setVideoSource(r.data)
                setPlayerOptions({ poster: '', url: r.data.url })
            })
            .catch((e) => {
                // message.error(e.msg)
            })
    }

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

    const initData = () => {
        getVideoData()
    }

    useEffect(() => {
        initData()
    }, [])

    return (
        <div className="media-player-box">
            <Button type="primary" onClick={onBack}>返回</Button>
            <div className="title">{videoSource ? `${videoSource.name} 第${videoSource.episode}集` : ''}</div>
            {playerOptions && (
                <div className="media-player">
                    <VideoPlayer options={playerOptions} onReady={handlePlayerReady} />
                </div>
            )}
        </div>
    )
}

export default PlayerPage
