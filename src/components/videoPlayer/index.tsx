import React, { useRef, useEffect } from 'react'
import DPlayer from 'dplayer'
import Hls from 'hls.js'
import { useLocation } from 'react-router-dom'

import './index.scss'

type VideoPlayerPropType = {
    options: {
        poster: string
        url: string
    }
    onReady: (player: DPlayer) => void
}
const VideoPlayer: React.FC<VideoPlayerPropType> = (P) => {
    const {
        options,
        onReady
    } = P
    // console.log('VideoPlayer ', P)
    const location = useLocation();

    const playerElRef = useRef<HTMLDivElement>(null)
    const playerRef = useRef<DPlayer>()
    const hlsRef = useRef<Hls>()

    const destroyPlayer = () => {
        if (playerRef.current) {
            playerRef.current.destroy()
            playerRef.current = undefined
            if (hlsRef.current) hlsRef.current.destroy()
            hlsRef.current = undefined
        }
    }

    useEffect(() => {
        const playerEl = playerElRef.current
        destroyPlayer()

        playerRef.current = new DPlayer(
            {
                container: playerEl,
                autoplay: true,
                volume: 1,
                screenshot: true,
                loop: false,
                video: {
                    url: options.url,
                    pic: options.poster,
                    type: 'customHls',
                    customType: {
                        customHls: (video: HTMLMediaElement) => {
                            hlsRef.current = new Hls()
                            hlsRef.current.loadSource(video.src)
                            hlsRef.current.attachMedia(video)
                        }
                    }
                }
            }
        )

        const videoEl = document.getElementsByClassName('dplayer-video')[0]
        videoEl.setAttribute('playsinline', 'true')
        videoEl.setAttribute('webkit-playsinline', 'true')
        // videoEl.setAttribute('x5-playsinline', 'true')
        videoEl.setAttribute('x-webkit-airplay', 'allow')
        videoEl.setAttribute('x5-video-player-type', 'h5-page')
        videoEl.setAttribute('x5-video-player-fullscreen', 'true')
        videoEl.setAttribute('x5-video-orientation', 'landscape|portrait')

        onReady(playerRef.current)

        const divPlayer = document.getElementById('dPlayer')
        const loopItem = divPlayer.getElementsByClassName('dplayer-setting-loop')[0]
        loopItem.setAttribute('style', 'display:none')
    }, [options, playerElRef])

    useEffect(() => {
        return () => {
            destroyPlayer()
        }
    }, [location])

    return (
        <div
            id="dPlayer"
            ref={playerElRef} />
    )
}

export default VideoPlayer
