import _echarts from '../../../utils/echarts-register'
import { extens } from '../../../core/echarts-extens'
import { useStyle } from '../../../styles'

export default async ({ $dom, $opt, $data, $instanceId, $seriesColor }: any) => {
    const { $vertical, $grid } = useStyle()

    const grid = { ...$grid }

    /**
     * 导出配置项
     */
    const options = {
        grid,
        xAxis: {
            ...$vertical.xAxis,
            data: $data.axis
        },
        yAxis: [
            {
                ...$vertical.yAxis
            }
        ],
        series: [
            {
                type: 'candlestick',
                data: $data.series,
                itemStyle: {
                    color: $seriesColor[0] || '#eb5454',
                    color0: $seriesColor[1] || '#47b262',
                    borderColor: $seriesColor[0] || '#eb5454',
                    borderColor0: $seriesColor[1] || '#47b262'
                }
            }
        ]
    }

    return _echarts.render($dom, extens($opt, options), $instanceId)
}
