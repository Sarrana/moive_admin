import React, { memo, useState } from 'react';
import { Button, Input, Form, Select, DatePicker, Radio, Card, Checkbox, CheckboxOptionType } from 'antd';

export type SelectOpType = {
    id?: number,
    name?: string,
    label?: string,
    value: number | string
}
type RadioOpType = {
    text: string
    value: number | string | undefined
}
type CheckboxOpType = {
    text: string
    value: number | string | undefined
}
export interface SearchFormItem {
    name: string;
    label?: string;
    placeholder?: string;
    rules?: object[];
    type?: 'input' | 'select' | 'radio' | 'radioBtn' | 'rangePicker' | 'datePicker' | 'checkbox';
    width?: number;
    picker?: 'date' | 'week' | 'month' | 'quarter' | 'year';
    selectOp?: SelectOpType[];
    radioOp?: RadioOpType[];
    checkbox?: CheckboxOpType;
    valuePropName?: string;
    render?: (item: SearchFormItem) => React.ReactElement;
    selectOpRender?: (item: SelectOpType) => React.ReactElement;
}
interface FormItemProps {
    children: any;
    name: string;
    label?: string;
    rules?: object[];
    valuePropName?: string;
}
interface SearchFormProps {
    params?: {};
    formList: SearchFormItem[];
    onSearch: (values: any) => void;
}

const CFormItem = (item: FormItemProps) => (
    <Form.Item
        label={item.label ? item.label : ''}
        key={item.name}
        rules={item.rules}
        name={item.name}
        valuePropName={item.valuePropName}>
        {item.children}
    </Form.Item>
)

function SearchForm(props: SearchFormProps) {
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker
    const [initData, setInitData] = useState(props.params);

    const reset = () => {
        setInitData({});
        form.resetFields();
        props.onSearch({});
    };

    const onSearch = () => {
        form.validateFields().then((res) => {
            // console.log('onSearch ', res);
            props.onSearch(res);
        });
    };

    const renderItem = (item: SearchFormItem) => {
        switch (item.type) {
            case 'select':
                return (
                    <Select style={{ width: item.width || 160 }} placeholder={item.placeholder} allowClear>
                        {
                            item.selectOp && item.selectOp.map((i) => (
                                item.selectOpRender ? item.selectOpRender(i) : <Select.Option value={i.value} key={String(i.value)}>{i.name}</Select.Option>
                            ))
                        }
                    </Select>
                )
            case 'datePicker':
                return (
                    <DatePicker placeholder={item.placeholder} picker={item.picker} allowClear />
                )
            case 'rangePicker':
                return (
                    <RangePicker placeholder={['起始时间', '结束时间']} allowClear />
                )
            case 'radio':
                return (
                    <Radio.Group onChange={(e) => {
                        form.setFieldsValue({ [item.name]: e.target.value })
                        onSearch()
                    }}>
                        {
                            item.radioOp && item.radioOp.map((i) => (
                                <Radio key={String(i.value)} value={i.value}>{i.text}</Radio>
                            ))
                        }
                    </Radio.Group>
                )
            case 'radioBtn':
                return (
                    <Radio.Group onChange={(e) => {
                        form.setFieldsValue({ [item.name]: e.target.value })
                        onSearch()
                    }}>
                        {
                            item.radioOp && item.radioOp.map((i) => (
                                <Radio.Button key={String(i.value)} value={i.value}>{i.text}</Radio.Button>
                            ))
                        }
                    </Radio.Group>
                )
            case 'checkbox':
                return (
                    <Checkbox value={item.checkbox.value}>{item.checkbox.text}</Checkbox>
                )
            default:
                return (
                    <Input placeholder={item.placeholder} style={{ width: item.width }} allowClear />
                )
        }
    }

    return (
        <Card>
            <Form className="layout__search" form={form} layout="inline" onFinish={onSearch} initialValues={initData || {}}>
                {/* {props.formList.map((item: SearchFormItem) => (item.render ? item.render(item) : renderItem(item)))} */}
                {props.formList.map((item: SearchFormItem) => (
                    item.render ? item.render(item)
                        : (
                            <Form.Item
                                label={item.label ? item.label : ''}
                                key={item.name}
                                rules={item.rules}
                                name={item.name}
                                valuePropName={item.valuePropName}>
                                {renderItem(item)}

                            </Form.Item>
                        )
                ))}
                <Form.Item>
                    <Button htmlType="submit" type="primary">查询</Button>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="reset" onClick={reset}>重置</Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default memo(SearchForm);
