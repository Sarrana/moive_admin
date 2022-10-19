import { _OptionType } from "@/type";
import { timeToMoment } from "@/utils";
import { Space, Form, Input, DatePicker, Select, Checkbox, Button } from "antd"

type querierPropType = {
    params: any
    classifyArr: _OptionType[]
    typeArr: _OptionType[]
    serialArr: _OptionType[]
    // publishArr: _OptionType[]
    onValueChange: (type: string, key: string, value: any, o?: any) => void
    onQuery: () => void
    onReset: () => void
}

export const VideoContentListQuerier = (props: querierPropType) => {
    // console.log('VideoContentListQuerier  ', props.params);

    const { RangePicker } = DatePicker;
    const classifyArr = props.classifyArr;
    const typeArr = props.typeArr;
    const serialArr = props.serialArr;
    // const publishArr = videoDefaultOp.concat(props.publishArr);

    return (
        <Space>
            <Form layout="inline">
                <Form.Item>
                    <Input
                        placeholder="按视频名称搜索"
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
                        value={props.params.classify}
                        onChange={(v, o) => props.onValueChange('select', 'classify', v, o)}
                        placeholder="视频分类"
                        allowClear>
                        {
                            classifyArr.map((status) => (
                                <Select.Option value={status.id} key={status.value}>
                                    {status.value}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Select
                        style={{ width: 100 }}
                        value={props.params.type}
                        onChange={(v, o) => props.onValueChange('select', 'type', v, o)}
                        placeholder="视频类型"
                        allowClear>
                        {
                            typeArr.map((status) => (
                                <Select.Option value={status.value} key={status.value}>
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
                        placeholder="视频模式"
                        allowClear>
                        {
                            serialArr.map((status) => (
                                <Select.Option value={status.id} key={status.value}>
                                    {status.value}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                {/* <Form.Item>
                    <Select
                        style={{ width: 90 }}
                        value={props.params.publish}
                        onChange={(v, o) => props.onValueChange('select', 'publish', v, o)}
                        placeholder={"发布状态"}
                    >
                        {
                            publishArr.map((status) => (
                                <Select.Option value={status.value} key={status.value}>
                                    {status.value}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item> */}
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
