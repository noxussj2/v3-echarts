import { ref } from 'vue'

const $color = {

    /**
     * 主题色-深色模式
     */
    theme: ['#B392F0', '#85E89D', '#9ECBFF', '#F97583', '#E1E4E8'],

    /**
     * 标题/副标题颜色
     */
    title: 'rgba(12, 139, 255, 1)',

    /**
     * 图例标签颜色
     */
    legendLabel: 'rgba(255, 255, 255, 1)',

    /**
     * X轴标签颜色
     */
    xAxisLabel: 'rgba(255, 255, 255, 1)',

    /**
     * Y轴标签颜色
     */
    yAxisLabel: 'rgba(255, 255, 255, 1)',

    /**
     * X轴分割线颜色
     */
    xSplitLine: 'rgba(255, 255, 255, 0.05)',

    /**
     * X轴轴线颜色
     */
    xAxisLine: 'rgba(142, 245, 254, 0.15)',

    /**
     * Y轴分割线颜色
     */
    ySplitLine: 'rgba(255, 255, 255, 0.05)',

    /**
     * Y轴轴线颜色
     */
    yAxisLine: 'rgba(142, 245, 254, 0.1)',

    /**
     * 数据文字颜色
     */
    seriesLabel: 'rgba(255, 255, 255, 1)'
}

const $fontSize = {

    /**
     * 标题/副标题
     */
    title: 12,

    /**
     * x轴刻度标签
     */
    xAxisLabel: 12,

    /**
     * x轴名称
     */
    xAxisName: 12,

    /**
     * y轴刻度标签
     */
    yAxisLabel: 12,

    /**
     * y轴名称
     */
    yAxisName: 12,

    /**
     * 图例标签
     */
    legendLabel: 12
}

/**
 * 容器内边距
 */
const $grid = {

    /**
     * 上
     */
    top: 50,

    /**
     * 右
     */
    right: 0,

    /**
     * 下
     */
    bottom: 15,

    /**
     * 左
     */
    left: 0,

    /**
     * grid 区域是否包含坐标轴的刻度标签
     */
    containLabel: true
}

/**
 * 提示框风格
 */
const $tooltip = {

    /**
     * 背景色
     */
    backgroundColor: 'rgba(255, 255, 255, 1)',

    /**
     * 边框颜色
     */
    borderColor: 'rgba(255, 255, 255, 1)',

    /**
     * 边框宽度
     */
    borderWidth: 1,

    /**
     * 文字样式
     */
    textStyle: {
        color: 'rgba(48, 49, 51, 1)'
    }
}

/**
 * 图例风格
 */
const $legend = {

    /**
     * 控制图例默认是否显示
     */
    show: true,

    /**
     * 图例形状
     */
    icon: 'rect',

    /**
     * 距离容器上边界的距离
     */
    top: 10,

    /**
     * 距离容器右边界的距离
     */
    right: 10,

    /**
     * 图形宽度
     */
    itemWidth: 10,

    /**
     * 图形高度
     */
    itemHeight: 3,

    /**
     * 图例之间的间距
     */
    itemGap: 15,

    /**
     * 文字样式
     */
    textStyle: {
        color: '#fff',
        fontSize: $fontSize.legendLabel
    }
}

/**
 * 纵向坐标轴风格
 */
const $vertical = {
    xAxis: {
        type: 'category',
        axisTick: {
            show: false
        },
        nameTextStyle: {
            color: $color.xAxisLabel,
            fontSize: $fontSize.xAxisName
        },
        axisLabel: {
            color: $color.xAxisLabel,
            fontSize: $fontSize.xAxisLabel
        },
        axisLine: {
            lineStyle: {
                color: $color.xAxisLine
            }
        },
        splitLine: {
            lineStyle: {
                color: $color.xSplitLine
            }
        },
        boundaryGap: true
    },
    yAxis: {
        type: 'value',
        nameTextStyle: {
            color: $color.yAxisLabel,
            fontSize: $fontSize.yAxisName
        },
        axisLabel: {
            color: $color.yAxisLabel,
            fontSize: $fontSize.yAxisLabel
        },
        axisLine: {
            show: false,
            lineStyle: {
                color: $color.yAxisLine
            }
        },
        splitLine: {
            lineStyle: {
                color: $color.ySplitLine
            }
        }
    }
}

/**
 * 横向坐标轴风格
 */
const $horizontal = {
    xAxis: {
        type: 'value',
        axisLabel: {
            show: false,
            color: $color.xAxisLabel,
            fontSize: $fontSize.xAxisLabel
        },
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'category',
        axisTick: {
            show: false
        },
        axisLabel: {
            color: $color.yAxisLabel,
            fontSize: $fontSize.yAxisLabel
        },
        axisLine: {
            show: false
        }
    }
}

if (typeof window !== 'undefined') {
    window.$v3echarts = {
        $color,
        $grid,
        $tooltip,
        $legend,
        $vertical,
        $horizontal
    }
}

export const useStyle: any = () => {
    if (typeof window !== 'undefined') {
        return window.$v3echarts
    }
}

export const echartsFlush = ref(0)
export const loadStyle = (style: any, render = false) => {
    if (typeof window !== 'undefined') {
        window.$v3echarts = style

        if (render) {
            echartsFlush.value++
            console.log('echartsFlush.value', echartsFlush.value)
        }
    }
}

declare global {
    interface Window {
        $v3echarts: {
            $color: any;
            $grid: any;
            $tooltip: any;
            $legend: any;
            $vertical: any;
            $horizontal: any;
        };
    }
}
