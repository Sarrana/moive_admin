import React from 'react'
import ReactECharts from 'echarts-for-react'
// import type { DataType } from '@/view/echarts/types'
// import sumBy from 'lodash-es/sumBy'
// import round from 'lodash-es/round'

type PropType = {
    title?: string
    legendRight?: boolean
    // data: DataType[]
    data: []
    showLoading: boolean
}

export const Line: React.FC<PropType> = (P) => {
    const { title, data, legendRight, showLoading } = P
    const option = {
        legend: {
            x: 'center',
            y: 'top',
            data: ['线上订单', '线下订单', '订单总量']
        },

        grid: {
            top: '16%',
            left: '3%',
            right: '8%',
            bottom: '3%',
            containLabel: true
        },

        tooltip: {
            trigger: 'axis'
        },

        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
        },

        yAxis: {
            type: 'value',
            min: 0,
            max: 0
        },

        series: [
            {
                name: '线上订单',
                data: [],
                type: 'line',
                symbol: 'none',
                smooth: 0.5
            },
            {
                name: '线下订单',
                data: [],
                type: 'line',
                symbol: 'none',
                smooth: 0.5
            },
            {
                name: '订单总量',
                data: [],
                type: 'line',
                symbol: 'none',
                smooth: 0.5
            }
        ]
    }

    const loadingOption = {
        text: '加载中...',
        color: '#4413c2',
        textColor: '#270240',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0
    };

    return (
        <ReactECharts
            option={option}
            showLoading={showLoading}
            loadingOption={loadingOption}
            style={{ height: 400, width: '100%' }}
        />
    )
}
