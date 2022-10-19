import { novelChannelOp, novelSerialOp, stateOp, _OptionType } from "@/type";
import { timeToMoment } from "@/utils";
import { Space, Form, Input, DatePicker, Select, Button } from "antd"

type querierPropType = {
    params: any
    classifyArr: _OptionType[]
    onValueChange: (type: string, key: string, value: any, o?: any) => void
    onQuery: () => void
    onReset: () => void
}

export const NovelContentListQuerier = (props: querierPropType) => {
    // console.log('VideoContentListQuerier  ', props.params);

    const { RangePicker } = DatePicker;
    const classifyArr = props.classifyArr;

    return (
        <Space>
            <Form layout="inline">
                <Form.Item>
                    <Input
                        placeholder="按小说名称搜索"
                        style={{ width: 200 }}
                        value={props.params.name}
                        onChange={(v) => props.onValueChange('input', 'name', v)}
                        allowClear />
                </Form.Item>
                <Form.Item>
                    <RangePicker
                        placeholder={['起始时间', '结束时间']}
                        value={[timeToMoment(props.params.date[0]), timeToMoment(props.params.date[1])]}
                        onChange={(v) => props.onValueChange('dateRange', 'date', v)}
                        allowClear />
                </Form.Item>
                <Form.Item>
                    <Select
                        style={{ width: 100 }}
                        value={props.params.channel}
                        onChange={(v, o) => props.onValueChange('select', 'channel', v, o)}
                        placeholder="频道"
                        allowClear>
                        {
                            novelChannelOp.map((status) => (
                                <Select.Option value={status.id} key={status.value}>
                                    {' '}
                                    {status.value}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Select
                        style={{ width: 100 }}
                        value={props.params.classify}
                        onChange={(v, o) => props.onValueChange('select', 'classify', v, o)}
                        placeholder="分类"
                        allowClear>
                        {
                            classifyArr.map((status) => (
                                <Select.Option value={status.id} key={status.value}>
                                    {' '}
                                    {status.value}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Select
                        style={{ width: 100 }}
                        value={props.params.serial}
                        onChange={(v, o) => props.onValueChange('select', 'serial', v, o)}
                        placeholder="连载"
                        allowClear>
                        {
                            novelSerialOp.map((status) => (
                                <Select.Option value={status.value} key={String(status.value)}>{status.label}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Select
                        style={{ width: 100 }}
                        value={props.params.status}
                        onChange={(v, o) => props.onValueChange('select', 'status', v, o)}
                        placeholder="状态"
                        allowClear>
                        {
                            stateOp.map((status) => (
                                <Select.Option value={status.id} key={String(status.value)}>{status.label}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
            </Form>
            <Button onClick={props.onQuery} type="primary">查询</Button>
            <Button onClick={props.onReset}>重置</Button>
        </Space>
    )
}
