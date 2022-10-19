import React from 'react'
import ReactECharts from 'echarts-for-react'
// import type { DataType } from '@/view/echarts/types'

type PropType = {
    unit: string
    showLoading: boolean
    // data: DataType[]
    data: []
}
const loadingOption = {
    text: '加载中...',
    color: '#4413c2',
    textColor: '#270240',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0
};
export const VBar: React.FC<PropType> = (P) => {
    const { unit, data, showLoading } = P

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: `{b} : {c}${unit}`
        },
        xAxis: {
            axisTick: {
                show: false
            }
            // data: data.map((i) => i.name),
        },
        yAxis: {
            name: `单位（${unit}）`,
            axisLine: {
                show: true
            }
        },
        series: [{
            name: '数量',
            type: 'bar',
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        position: 'top'
                    }
                }
            },
            data
        }]
    }

    return (
        <ReactECharts
            option={option}
            showLoading={showLoading}
            loadingOption={loadingOption}
            style={{ height: 400 }}
        />
    )
}

export const HBar: React.FC<PropType> = (P) => {
    const { unit, data, showLoading } = P

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: `{b} : {c}${unit}`
        },
        xAxis: {
            type: 'value',
            name: `单位（${unit}）`,
            axisLine: {
                show: true
            },
            splitLine: {
                show: true
            }
        },
        yAxis: {
            axisTick: {
                show: false
            },
            splitLine: {
                show: true
            }
            // data: data.map((i) => i.name),
        },
        series: [{
            name: '数量',
            type: 'bar',
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        position: 'right'
                    }
                }
            },
            data
        }]
    }
    return (
        <ReactECharts
            option={option}
            showLoading={showLoading}
            loadingOption={loadingOption}
            style={{ height: 400 }}
        />
    )
}
