import _echarts from '../../../utils/echarts-register'
import { extens } from '../../../core/echarts-extens'
import { useStyle } from '../../../styles'

export default async ({ $dom, $opt, $data, $instanceId, $seriesColor, $areaGradient }: any) => {
    const { $color, $legend } = useStyle()

    /**
     * 过滤主题色
     */
    const color = $seriesColor || $color.theme

    /**
     * 数据处理
     */
    const series = $data.series.map((x: any, index: number) => {
        return {
            name: x.name,
            value: x.data,
            areaStyle: {
                color: color[index],
                opacity: $areaGradient ? 0.3 : 0
            }
        }
    })

    /**
     * 导出配置项
     */
    const options = {
        color,
        radar: {
            indicator: $data.indicator,
            axisName: {
                color: $color.legendLabel
            },
            axisLine: {
                lineStyle: {
                    color: $color.xAxisLine
                }
            },
            splitLine: {
                lineStyle: {
                    color: $color.xAxisLine
                }
            },
            splitArea: {
                show: false
            }
        },
        series: [
            {
                name: 'Budget vs spending',
                type: 'radar',
                data: series
            }
        ]
    }

    return _echarts.render($dom, extens($opt, options), $instanceId)
}
