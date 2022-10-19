import VideoPlayer from "@/components/videoPlayer";
import { Button, Col, Row } from "antd";
import { memo } from "react";

export const VideoPlayerBox = memo((props) => {
    // @ts-ignore
    const { dataSource, onReady } = props
    return (
        <div className="media-player" key={dataSource.id}>
            <VideoPlayer options={{ poster: '', url: dataSource.slice_url }} onReady={onReady} />
        </div>
    )
})

export const EpisodeBox = memo((props) => {
    // @ts-ignore
    const { dataSource, select, onChange } = props
    return (
        <Row gutter={[10, 10]}>
            {
                dataSource.map((item, index) => (
                    <Col span={6} key={item.episode}>
                        <Button
                            style={{ width: 45 }}
                            disabled={!item.audit_wait}
                            type={select ? item.episode == select.episode ? 'primary' : 'default' : 'default'}
                            onClick={() => { onChange(item) }}>
                            {item.episode}
                        </Button>
                    </Col>
                ))
            }
        </Row>
    )
})
