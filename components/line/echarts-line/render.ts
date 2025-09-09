import _echarts from '../../../utils/echarts-register'
import { extens } from '../../../core/echarts-extens'
import { useStyle } from '../../../styles'
import { colorToRgba } from '../../../utils/color'

export default async ({
    $dom,
    $opt,
    $data,
    $seriesColor,
    $singleColor,
    $dataZoom,
    $dataZoomNumber,
    $dataZoomColor,
    $carousel,
    $smooth,
    $areaGradient,
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
             * 常规颜色
             */
            const _color = $singleColor ? color[i] : color[index]

            data.push({
                value: x,
                itemStyle: {
                    color: _color
                }
            })
        })

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
            }
        })

        const unit = item.unit ? `（${item.unit}）` : ''
        yAxisNames.push(unit)
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
                borderColor: colorToRgba(_color, 0.5),
                handleStyle: {
                    color: 'transparent',
                    borderColor: _color
                },
                moveHandleSize: 0,
                fillerColor: colorToRgba(_color, 0.2),
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
                trigger: 'axis'
            },
            $tooltip
        ),
        legend: Object.assign({}, $legend),
        xAxis: Object.assign({ data: $data.axis }, $vertical.xAxis),
        yAxis: [
            {
                ...$vertical.yAxis,
                name: yAxisNames[0]
            },
            {
                ...$vertical.yAxis,
                show: false,
                name: yAxisNames[1],
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
    return _echarts.render($dom, extens($opt, options), $instanceId)
}
