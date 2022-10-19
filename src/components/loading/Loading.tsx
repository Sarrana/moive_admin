import { Spin } from "antd"
import React, { useEffect, useState } from "react"
import ReactDOM from 'react-dom'

const Loading = (props) => {
    let timer: any = null
    const { content, duration } = props
    const [msgs, setMsgs] = useState(null)

    useEffect(() => {
        setMsgs(props)
        clearTimeout(timer)
        if (duration) {
            timer = setTimeout(
                () => {
                    loading.hide()
                },
                duration
            )
        }
    }, [props])

    return (
        msgs && (
            <div className="ant-modal-root">
                <div className="ant-modal-mask" />
                <div tabIndex={-1} className="ant-modal-wrap ant-modal-centered" role="dialog">
                    <div role="document" className="ant-modal">
                        <div tabIndex={0} aria-hidden="true" style={{ width: '0px', height: '0px', overflow: 'hidden', outline: 'none' }} />
                        <div>
                            <Spin size="large" tip={content} />
                        </div>
                        <div tabIndex={0} aria-hidden="true" style={{ width: '0px', height: '0px', overflow: 'hidden', outline: 'none' }} />
                    </div>
                </div>
            </div>
        )
    )
}

const loading: { dom: { [key: string]: React.Key }, show: (content?: string, duration?: number) => void, hide: () => void } = {
    dom: null,
    show(content = '请求中...', duration?: number) {
        let dom = document.querySelector('.zdy-loading-box')
        if (!dom) {
            dom = document.createElement('div')
            dom.setAttribute('class', 'zdy-loading-box')
            document.body.append(dom)
        }
        const JSXdom = (<Loading content={content} duration={duration} key={new Date().getTime()} />)
        ReactDOM.render(JSXdom, dom)
        const s = document.body.getAttribute('style')
        const c = document.body.getAttribute('class')
        if (!s && !c) {
            document.body.setAttribute('style', 'width: calc(100% - 17px);overflow: hidden;');
            document.body.setAttribute('class', 'ant-scrolling-effect');
            document.body.setAttribute('zdy-mark', '1');
        }
    },
    hide() {
        let dom = document.querySelector('.zdy-loading-box')
        if (dom) {
            dom.remove()
        }
        const mark = document.body.getAttribute('zdy-mark')
        if (mark) {
            document.body.removeAttribute('style');
            document.body.removeAttribute('class');
            document.body.removeAttribute('zdy-mark');
        }
    }
}

export default loading
