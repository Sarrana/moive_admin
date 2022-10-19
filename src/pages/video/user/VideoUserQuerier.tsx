import { defaultOp, _OptionType } from "@/type";
import { timeToMoment } from "@/utils";
import { Space, Form, Input, DatePicker, Select, Checkbox, Button } from "antd"

type querierPropType = {
    params: any
    siteArr: _OptionType[]
    terminalArr: _OptionType[]
    onValueChange: (type: string, key: string, value: any, o?: any) => void
    onQuery: () => void
    onReset: () => void
}

export const VideoUserQuerier = (props: querierPropType) => {
    // console.log('VideoUserQuerier  ', props.params);

    const { RangePicker } = DatePicker;
    const siteOptionList = props.siteArr;
    const terminalOptionList = props.terminalArr;

    return (
        <Space>
            <Form layout="inline">
                <Form.Item>
                    <Input
                        placeholder="按用户账号/用户名搜索"
                        style={{ width: 200 }}
                        value={props.params.account}
                        onChange={(v) => props.onValueChange('input', 'account', v)}
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
                        style={{ width: 120 }}
                        value={props.params.website}
                        onChange={(v, o) => props.onValueChange('select', 'website', v, o)}
                        placeholder="注册网站"
                        allowClear>
                        {
                            siteOptionList.map((status) => (
                                <Select.Option value={status.id} key={status.value}>
                                    {status.value}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Select
                        style={{ width: 120 }}
                        value={props.params.terminal}
                        onChange={(v, o) => props.onValueChange('select', 'terminal', v, o)}
                        placeholder="注册终端"
                        allowClear>
                        {
                            terminalOptionList.map((status) => (
                                <Select.Option value={status.value} key={status.value}>
                                    {status.value}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                {/* <Form.Item>
                    <Checkbox checked={props.params.isMember} onChange={(v) => props.onValueChange('checkbox', 'isMember', v)} >{"会员"}</Checkbox>
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
