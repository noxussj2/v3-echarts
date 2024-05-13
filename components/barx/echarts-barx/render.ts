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
    $dataZoomColor
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

        series.push({
            type: 'bar',
            name: item.name,
            data,
            barWidth: $barWidth,
            stack: $stack,
            itemStyle: {
                borderRadius: $radius
            },
            showBackground: $showBackground
        })
    })

    /**
     * 数据缩放
     */
    let dataZoom: any = []

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
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            $tooltip
        ),
        legend: Object.assign({}, $legend),
        xAxis: Object.assign({ data: $data.axis }, $vertical.xAxis),
        yAxis: [Object.assign({}, $vertical.yAxis)],
        series
    }

    /**
     * 继承配置项后渲染图表
     */
    return _echarts.render($dom, extens($opt, options))
}
