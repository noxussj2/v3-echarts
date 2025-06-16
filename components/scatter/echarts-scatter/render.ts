import _echarts from '../../../utils/echarts-register'
import { extens } from '../../../core/echarts-extens'
import { useStyle } from '../../../styles'
import { colorToRgba } from '../../../utils/color'

export default async ({ $dom, $opt, $data, $seriesColor, $symbolSize, $symbol, $instanceId }: any) => {
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
        series.push({
            type: 'scatter',
            name: item.name,
            data: item.data,
            symbolSize: $symbolSize,
            symbol: $symbol
        })
    })

    /**
     * 导出配置项
     */
    const options = {
        color,
        grid: {
            ...grid,
            right: 5
        },
        tooltip: Object.assign(
            {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            $tooltip
        ),
        legend: Object.assign({}, $legend),
        xAxis: { ...$vertical.xAxis, type: 'value' },
        yAxis: [
            {
                ...$vertical.yAxis,
                name: yAxisNames[0] || ''
            }
        ],
        series
    }

    return _echarts.render($dom, extens($opt, options), $instanceId)
}
