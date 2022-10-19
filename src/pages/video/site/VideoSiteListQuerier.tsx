import { Space, Form, Input, Checkbox, Button } from "antd"

type querierPropType = {
    params: any
    onValueChange: (type: string, key: string, value: any, o?: any) => void
    onQuery: () => void
    onReset: () => void
}

export const VideoSiteListQuerier = (props: querierPropType) => {
    return (
        <Space>
            <Form layout="inline">
                <Form.Item>
                    <Input
                        placeholder="按网站名称搜索"
                        style={{ width: 200 }}
                        value={props.params.name}
                        onChange={(v) => props.onValueChange('input', 'name', v)}
                        allowClear />
                </Form.Item>
                <Form.Item>
                    <Checkbox checked={props.params.open} onChange={(v) => props.onValueChange('checkbox', 'open', v)}>状态开</Checkbox>
                </Form.Item>
                <Form.Item>
                    <Checkbox checked={props.params.close} onChange={(v) => props.onValueChange('checkbox', 'close', v)}>状态关</Checkbox>
                </Form.Item>
            </Form>
            <Button onClick={props.onQuery} type="primary">查询</Button>
            <Button onClick={props.onReset}>重置</Button>
        </Space>
    )
}
