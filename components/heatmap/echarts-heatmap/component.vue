<template>
    <div ref="echarts" class="echarts" :style="{ width: props.width, height: props.height }" />
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, onUnmounted } from 'vue'
import render from './render'
import { echartsFlush } from '../../../styles'
import echartsInstance from '../../../utils/echarts-register'
import { getMockData } from './data'

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
        default: () => getMockData()
    },

    /**
     * 热力图颜色
     */
    color: {
        type: Array || null,
        default: null
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
                $seriesColor: props.color
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
