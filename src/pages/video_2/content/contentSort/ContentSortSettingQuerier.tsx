import { stateOp, _OptionType } from "@/type";
import { Space, Form, Input, DatePicker, Select, Button } from "antd"

type querierPropType = {
    params: any
    classifyArr: _OptionType[]
    typeArr: _OptionType[]
    serialArr: _OptionType[]
    onValueChange: (type: string, key: string, value: any, o?: any) => void
    onQuery: () => void
    onReset: () => void
}

export const ContentSortSettingQuerier = (props: querierPropType) => {
    const { RangePicker } = DatePicker;
    const classifyArr = props.classifyArr;
    const typeArr = props.typeArr;
    const serialArr = props.serialArr;

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
                        value={props.params.date}
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
                <Form.Item>
                    <Select
                        style={{ width: 100 }}
                        value={props.params.serial}
                        onChange={(v, o) => props.onValueChange('select', 'state', v, o)}
                        placeholder="视频状态"
                        allowClear>
                        {
                            stateOp.map((status) => (
                                <Select.Option value={status.id} key={status.value}>
                                    {status.value}
                                </Select.Option>
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
