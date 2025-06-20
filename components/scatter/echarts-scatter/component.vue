<template>
    <div ref="echarts" class="echarts" :style="{ width: props.width, height: props.height }" />
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, onUnmounted } from 'vue'
import render from './render'
import { echartsFlush } from '../../../styles'
import echartsInstance from '../../../utils/echarts-register'

interface EmitsType {
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
     * 数据项
     */
    data: {
        type: Object,
        default: () => ({
            series: [
                {
                    name: 'Male',
                    data: [
                        [10.0, 8.04],
                        [8.07, 6.95],
                        [13.0, 7.58],
                        [9.05, 8.81],
                        [11.0, 8.33],
                        [14.0, 7.66],
                        [13.4, 6.81]
                    ]
                },
                {
                    name: 'Female',
                    data: [
                        [4.05, 4.96],
                        [6.03, 7.24],
                        [12.0, 6.26],
                        [12.0, 8.84],
                        [7.08, 5.82],
                        [5.02, 5.68]
                    ]
                }
            ]
        })
    },

    /**
     * 散点图颜色
     */
    color: {
        type: Array || null,
        default: null
    },

    /**
     * 散点尺寸
     */
    symbolSize: {
        type: Number,
        default: 15
    },

    /**
     * 散点尺寸
     */
    symbol: {
        type: String,
        default: 'circle' // 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
    }
})

const echarts = ref<null>(null)
let instance: any = null
let instanceId = ''

onMounted(() => {
    watch(
        () => ({ ...props, echartsFlush: echartsFlush.value }),
        async () => {
            if (!props.data) return

            const res: any = await render({
                $dom: echarts,
                $opt: props.opt,
                $data: props.data,
                $seriesColor: props.color,
                $symbolSize: props.symbolSize,
                $symbol: props.symbol,
                $instanceId: instanceId
            })

            instance = res.instance
            instanceId = res.instanceId

            /**
             * 点击事件
             */
            instance.off('click')
            instance.on('click', (e: any) => {
                emit('click', e)
            })
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
