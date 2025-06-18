import { loadStyle } from './styles/index'
import "./styles/index.css"

import _echarts from './utils/echarts-register'
import EchartsBase from './components/base/echarts-base/component.vue'
import EchartsBarx from './components/barx/echarts-barx/component.vue'
import EchartsBarxBattery from './components/barx/echarts-barx-battery/component.vue'
import EchartsBary from './components/bary/echarts-bary/component.vue'
import EchartsBaryBattery from './components/bary/echarts-bary-battery/component.vue'
import EchartsBarySpirit from './components/bary/echarts-bary-spirit/component.vue'
import EchartsLine from './components/line/echarts-line/component.vue'
import EchartsPie from './components/pie/echarts-pie/component.vue'
import EchartsMap from './components/map/echarts-map/component.vue'
import EchartsPolar from './components/polar/echarts-polar/component.vue'
import EchartsScatter from './components/scatter/echarts-scatter/component.vue'
import EchartsHeatmap from './components/heatmap/echarts-heatmap/component.vue'

export {
    loadStyle,
    _echarts,
    EchartsBase,
    EchartsBarx,
    EchartsBarxBattery,
    EchartsBary,
    EchartsBaryBattery,
    EchartsBarySpirit,
    EchartsLine,
    EchartsPie,
    EchartsMap,
    EchartsPolar,
    EchartsScatter,
    EchartsHeatmap
}
