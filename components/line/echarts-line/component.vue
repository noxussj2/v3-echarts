<template>
    <div ref="echarts" class="echarts" :style="{ width: props.width, height: props.height }" />
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, onUnmounted } from 'vue'
import render from './render'
import { echartsFlush } from '../../../styles'
import echartsInstance from '../../../utils/echarts-register'

const props = defineProps({
    /**
     * 用户配置项（继承已有配置，非必要时候勿用）
     */
    opt: {
        type: [Object, Function],
        default: () => ({})
    },

    /**
     * 容器宽度
     */
    width: {
        type: String,
        default: '100%'
    },

    /**
     * 容器高度
     */
    height: {
        type: String,
        default: '100%'
    },

    /**
     * 数据项
     */
    data: {
        type: Object,
        default: () => ({
            series: [
                {
                    name: '1月',
                    data: [120, 200, 150, 80, 70, 110, 130]
                }
            ],
            axis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        })
    },

    /**
     * 折线图颜色
     */
    color: {
        type: Array || null,
        default: null
    },

    /**
     * 是否曲线
     */
    smooth: {
        type: Boolean,
        default: false
    },

    /**
     * 是否开启区域渐变
     */
    areaGradient: {
        type: Boolean,
        default: false
    },

    /**
     * 是否显示可视区域
     */
    dataZoom: {
        type: Boolean,
        default: false
    },

    /**
     * 可视区域显示数量
     */
    dataZoomNumber: {
        type: Number,
        default: 4
    },

    /**
     * 可视区域工具颜色
     */
    dataZoomColor: {
        type: Boolean,
        default: null
    },

    /**
     * 是否启用数据轮播
     */
    carousel: {
        type: Boolean,
        default: false
    },

    /**
     * 数据轮播间隔时间
     */
    interval: {
        type: Number,
        default: 5
    }
})

const echarts = ref<null>(null)
let instance: any = null
let instanceId = ''
let timer = 0

onMounted(() => {
    watch(
        () => ({ ...props, echartsFlush: echartsFlush.value }),
        async () => {
            if (props.data) {
                const res: any = await render({
                    $dom: echarts,
                    $opt: typeof props.opt === 'function' ? props.opt() : props.opt,
                    $data: props.data,
                    $seriesColor: props.color,
                    $dataZoom: props.dataZoom,
                    $dataZoomNumber: props.dataZoomNumber,
                    $dataZoomColor: props.dataZoomColor,
                    $carousel: props.carousel,
                    $smooth: props.smooth,
                    $areaGradient: props.areaGradient,
                    $instanceId: instanceId
                })

                instance = res.instance
                instanceId = res.instanceId

                /**
                 * 数据轮播
                 */
                clearTimeout(timer)
                if (props.carousel) {
                    let startValue = 0
                    let endValue = props.dataZoomNumber - 1

                    timer = setInterval(() => {
                        startValue += 1
                        endValue += 1
                        if (endValue > props.data.axis.length - 1) {
                            startValue = 0
                            endValue = props.dataZoomNumber - 1
                        }

                        instance.dispatchAction({
                            type: 'dataZoom',

                            // 开始位置的数值
                            startValue,

                            // 结束位置的数值
                            endValue
                        })
                    }, props.interval * 1000)
                }
            }
        },
        {
            deep: true,
            immediate: true
        }
    )
})

onUnmounted(() => {
    if (instanceId) {
        echartsInstance.destroy(instanceId)
    }
})
</script>
