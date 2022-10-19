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

export const Pie: React.FC<PropType> = (P) => {
    const { title, data, legendRight, showLoading } = P
    const option = {
        title: {
            text: title,
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            bottom: '0%',
            // right: legendRight ? '0%' : undefined,
            // left:'20%',
            icon: 'circle'
            // show: data.length > 0,
            // formatter: (name: string) => {
            //     if (data.length < 0) return
            //     const total = sumBy(data, 'value')
            //     const val = data.filter((item) => item.name === name)
            //     return `${name}        ${round((val[0].value / (total ? total : 1)) * 100, 2)}%         ${val[0].value}`
            // },
        },
        series: [
            {
                name: title,
                type: 'pie',
                radius: '50%',
                center: ['50%', '40%'],
                // roseType: 'radius',
                label: {
                    normal: {
                        position: 'inner',
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        borderWidth: 2,
                        borderColor: '#fff'
                    },
                    emphasis: {
                        borderWidth: 0,
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                data
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
