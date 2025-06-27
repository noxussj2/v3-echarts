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
            indicator: [
                { name: 'Sales', max: 6500 },
                { name: 'Administration', max: 16000 },
                { name: 'Information Technology', max: 30000 },
                { name: 'Customer Support', max: 38000 },
                { name: 'Development', max: 52000 },
                { name: 'Marketing', max: 25000 }
            ],
            series: [
                {
                    name: 'Allocated Budget',
                    data: [4200, 3000, 20000, 35000, 50000, 18000]
                },
                {
                    name: 'Actual Spending',
                    data: [5000, 14000, 28000, 26000, 42000, 21000]
                }
            ]
        })
    },

    /**
     * 雷达图颜色
     */
    color: {
        type: Array || null,
        default: null
    },

    /**
     * 是否开启区域渐变
     */
    areaGradient: {
        type: Boolean,
        default: false
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
                $instanceId: instanceId,
                $seriesColor: props.color,
                $areaGradient: props.areaGradient,
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
