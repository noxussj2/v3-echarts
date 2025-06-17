import * as echarts from 'echarts'
import { v4 as uuidv4 } from 'uuid'

class Echarts {
    loaded: object
    observers: object

    constructor() {
        this.loaded = {}
        this.observers = {}

        // setInterval(() => {
        //     console.log('this.loaded', this.loaded)
        // }, 1000 * 5)

        // window.onresize = () => {
        //     this.resize()
        //     console.log('resize')
        // }
    }

    /**
     * 渲染图表
     */
    async render(dom: any, opt: any, instanceId: string) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (instanceId) {
                    this.loaded[instanceId].clear()

                    this.loaded[instanceId].setOption(opt)

                    resolve({ instance: this.loaded[instanceId], instanceId })
                }

                if (!instanceId) {
                    const uuid = uuidv4()

                    const instance = echarts.init(dom.value)

                    instance.setOption(opt)

                    this.loaded[uuid] = instance

                    /**
                     * dom 容器监听器
                     */
                    this.observers[uuid] = new ResizeObserver(() => {
                        instance.resize()
                    })

                    this.observers[uuid].observe(dom.value)

                    resolve({ instance, instanceId: uuid })
                }
            }, 0)
        })
    }

    /**
     * 图表重载
     */
    resize(time = 0) {
        if (!time || time === 0) {
            for (const key in this.loaded) {
                this.loaded[key].resize()
            }
        }

        if (time) {
            this.hiden()
            setTimeout(() => {
                this.show()

                for (const key in this.loaded) {
                    this.loaded[key].resize()
                }
            }, time)
        }
    }

    /**
     * 图表隐藏
     */
    hiden() {
        for (const key in this.loaded) {
            this.loaded[key]._dom.style.opacity = '0'
        }
    }

    /**
     * 图表显示
     */
    show() {
        for (const key in this.loaded) {
            this.loaded[key]._dom.style.opacity = '1'
        }
    }

    /**
     * 销毁图表
     */
    destroy(instanceId: string) {
        // 删除实例
        this.loaded[instanceId].dispose()
        delete this.loaded[instanceId]

        // 删除 dom 监听器
        this.observers[instanceId].disconnect()
        delete this.observers[instanceId]
    }
}

const _echarts = new Echarts()

export default _echarts
