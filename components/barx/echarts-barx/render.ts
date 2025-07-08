import _echarts from '../../../utils/echarts-register'
import { extens } from '../../../core/echarts-extens'
import { useStyle } from '../../../styles'
import { colorToRgba } from '../../../utils/color'

export default async ({
    $dom,
    $opt,
    $data,
    $seriesColor,
    $barWidth,
    $stack,
    $radius,
    $singleColor,
    $showBackground,
    $dataZoom,
    $dataZoomNumber,
    $dataZoomColor,
    $carousel,
    $smooth,
    $areaGradient,
    $symbol,
    $debugger,
    $instanceId
}: any) => {
    const { $color, $grid, $tooltip, $vertical, $legend } = useStyle()

    const grid = { ...$grid }

    /**
     * 过滤主题色
     */
    const color = $seriesColor || $color.theme

    /**
     * 数据处理
     */
    const yAxisNames: any = []
    const series: any = []
    $data.series.forEach((item: any, index: number) => {
        const data: any = []

        item.data.forEach((x: any, i: number) => {

            /**
             * 设置独立颜色
             */
            if ($singleColor) {
                const _color = $singleColor ? color[i] : color[index]

                data.push({
                    value: x,
                    itemStyle: {
                        color: _color
                    }
                })
            }

            /**
             * 不设置颜色
             */
            if (!$singleColor) {
                data.push(x)
            }

        })

        if (item.unit) {
            yAxisNames.push(`（${item.unit}）`)
        }

        /**
         * 折线图
         */
        if (item.type === 'line') {

            /**
             * 渐变颜色
             */
            let gradientColor: any = 'rgba(0, 0, 0, 0)'
            if ($areaGradient) {
                const color1 = colorToRgba(color[index], 1)
                const color2 = colorToRgba(color[index], 0)

                gradientColor = {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: color1
                        },
                        {
                            offset: 1,
                            color: color2
                        }
                    ]
                }
            }

            series.push({
                type: 'line',
                name: item.name,
                data,
                smooth: $smooth,
                areaStyle: {
                    color: gradientColor
                },
                yAxisIndex: 1
            })
        }

        /**
         * 象形图
         */
        if (item.type === 'pictorialBar') {
            series.push({
                type: 'pictorialBar',
                name: item.name,
                data,
                barWidth: $barWidth,
                symbol: $symbol
            })
        }

        /**
         * 柱状图
         */
        if (!item.type || item.type === 'bar') {
            series.push({
                type: 'bar',
                name: item.name,
                data,
                barWidth: $barWidth,
                stack: $stack,
                itemStyle: {
                    borderRadius: Number($radius)
                },
                showBackground: $showBackground
            })
        }
    })

    /**
     * 数据缩放 & 数据轮播
     */
    let dataZoom: any = []

    if ($carousel) {
        dataZoom = [
            {
                show: false,
                type: 'slider',
                startValue: 0,
                endValue: $dataZoomNumber - 1
            },
            {
                show: false
            }
        ]
    }

    if ($dataZoom) {
        const _color = $dataZoomColor || $color.theme[0]

        dataZoom = [
            {
                show: true,
                type: 'slider',
                startValue: 0,
                endValue: $dataZoomNumber - 1,
                left: 10,
                right: 10,
                backgroundColor: 'transparent',
                dataBackground: {
                    lineStyle: {
                        color: 'transparent'
                    },
                    areaStyle: {
                        color: _color
                    }
                },
                selectedDataBackground: {
                    lineStyle: {
                        color: 'transparent'
                    },
                    areaStyle: {
                        color: _color
                    }
                },
                borderColor: colorToRgba(_color, 0.2),
                handleStyle: {
                    color: 'transparent',
                    borderColor: colorToRgba(_color, 0.5)
                },
                moveHandleSize: 0,
                fillerColor: colorToRgba(_color, 0.1),
                labelFormatter: () => '',
                height: 25,
                bottom: 10
            },
            {
                show: true,
                type: 'inside',
                zoomOnMouseWheel: true,
                moveOnMouseMove: false,
                moveOnMouseWheel: false
            }
        ]

        grid.bottom = 50
    }

    /**
     * 导出配置项
     */
    const options = {
        color,
        grid,
        dataZoom,
        tooltip: Object.assign(
            {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            $tooltip
        ),
        legend: Object.assign({}, $legend),
        xAxis: Object.assign({ data: $data.axis }, $vertical.xAxis),
        yAxis: [
            {
                ...$vertical.yAxis,
                name: yAxisNames[0] || ''
            },
            {
                ...$vertical.yAxis,
                show: false,
                name: yAxisNames[1] || '',
                axisLabel: {
                    show: false,
                    color: $color.yAxisLabel,
                    formatter: '{value} %'
                },
                splitLine: {
                    show: false
                }
            }
        ],
        series
    }

    /**
     * 继承配置项后渲染图表
     */
    if ($debugger) {
        console.log('debugger', extens($opt, options))
    }

    return _echarts.render($dom, extens($opt, options), $instanceId)
}
