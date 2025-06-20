<template>
    <div ref="echarts" class="echarts" :style="{ width: props.width, height: props.height }" />
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, onUnmounted } from 'vue'
import render from './render'
import { echartsFlush } from '../../../styles'
import echartsInstance from '../../../utils/echarts-register'

interface EmitsType {
    (e: 'carousel', value: Number): void
    (e: 'click', value: any): void
}

const emit = defineEmits<EmitsType>()

const props = defineProps({
    /**
     * 用户配置项（继承已有配置，非必要时候勿用）
     */
    opt: {
        type: Object,
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
     * 数据源
     */
    data: {
        type: Array,
        default: () => [
            { name: '衬衫', value: 5 },
            { name: '羊毛衫', value: 20 },
            { name: '雪纺衫', value: 36 },
            { name: '裤子', value: 10 },
            { name: '高跟鞋', value: 10 },
            { name: '袜子', value: 20 }
        ]
    },

    /**
     * 饼图颜色
     */
    color: {
        type: Array || null,
        default: null
    },

    /**
     * 饼图大小
     */
    radius: {
        type: Array,
        default: () => ['0%', '70%']
    },

    /**
     * 饼图位置
     */
    center: {
        type: Array,
        default: () => ['50%', '50%']
    },

    /**
     * 是否显示标签
     */
    label: {
        type: Boolean,
        default: false
    },

    /**
     * 是否显示图例
     */
    legend: {
        type: Boolean,
        default: false
    },

    /**
     * 是否展示成南丁格尔图
     */
    roseType: {
        type: Boolean,
        default: false
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
const active = ref(0)
let timer: any = 0

onMounted(() => {
    watch(
        () => ({ ...props, echartsFlush: echartsFlush.value }),
        async (data) => {
            const res: any = await render({
                $dom: echarts,
                $opt: props.opt,
                $data: props.data,
                $seriesColor: props.color,
                $radius: props.radius,
                $label: props.label,
                $center: props.center,
                $legend: props.legend,
                $roseType: props.roseType,
                $carousel: props.carousel,
                $instanceId: instanceId
            })

            instance = res.instance
            instanceId = res.instanceId

            /**
             * 数据轮播
             */
            clearTimeout(timer)
            if (props.carousel && data.length) {
                /**
                 * 清空所有高亮
                 */
                const clear = () => {
                    props.data.forEach((item: any, index: number) => {
                        instance.dispatchAction({
                            type: 'downplay',
                            seriesIndex: 1,
                            dataIndex: index
                        })
                    })
                }

                /**
                 * 高亮事件
                 */
                const highlight = () => {
                    clear()

                    instance.dispatchAction({
                        type: 'highlight',
                        seriesIndex: 1,
                        dataIndex: active.value
                    })

                    emit('carousel', active.value)
                }

                /**
                 * 轮播事件
                 */
                const carousel = () => {
                    highlight()

                    active.value += 1

                    if (active.value >= props.data.length) {
                        active.value = 0
                    }
                }

                highlight()

                timer = setInterval(carousel, props.interval * 1000)

                /**
                 * 鼠标移入事件
                 * 停止轮播
                 */
                instance.on('mouseover', (e: any) => {
                    clearInterval(timer)

                    active.value = e.dataIndex

                    highlight()
                })

                /**
                 * 鼠标移除事件
                 * 继续轮播
                 */
                instance.on('mouseout', () => {
                    clearInterval(timer)

                    timer = setInterval(carousel, props.interval * 1000)
                })

                /**
                 * 鼠标移除事件
                 * 继续轮播
                 */
                instance.on('click', (e: any) => {
                    emit('click', e.data)
                })
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
