import _echarts from '../../../utils/echarts-register'
import { extens } from '../../../core/echarts-extens'
import { useStyle } from '../../../styles'

export default async ({ $dom, $opt, $data, $instanceId, $seriesColor }: any) => {
    const { $color, $grid, $tooltip, $vertical } = useStyle()

    const grid = { ...$grid }

    /**
     * 过滤主题色
     */
    const color = $seriesColor || $color.theme

    /**
     * 导出配置项
     */
    const options = {
        color,
        grid: {
            ...grid,
            right: 5
        },
        tooltip: { ...$tooltip },
        xAxis: {
            ...$vertical.xAxis,
            type: 'category',
            data: $data.xAxis,
            splitArea: {
                show: false
            }
        },
        yAxis: {
            ...$vertical.yAxis,
            type: 'category',
            data: $data.yAxis,
            splitArea: {
                show: false
            }
        },
        visualMap: {
            min: 0,
            max: 10,
            calculable: true,
            orient: 'horizontal',
            right: 0,
            top: 0,
            color: [color[1], color[0]],
            itemWidth: 10,
            itemHeight: 140,
            textStyle: {
                color: $color.legendLabel
            }
        },
        series: [
            {
                name: 'Data',
                type: 'heatmap',
                data: $data.series,
                label: {
                    show: true,
                    fontSize: 10
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }

    return _echarts.render($dom, extens($opt, options), $instanceId)
}
