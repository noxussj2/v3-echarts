import _ from 'lodash-es'
import assign from '../utils/object-assign'

/**
 * 模式检测
 */
function _modeCheck (FirstOBJ: any, SecondOBJ: any) {
    if (FirstOBJ.baseOption && !SecondOBJ.baseOption) {
        console.error('提示', 'option两者格式不符合')
    }

    if (!FirstOBJ.baseOption && SecondOBJ.baseOption) {
        console.error('提示', 'option两者格式不符合')
    }

    if (FirstOBJ.options && !SecondOBJ.options) {
        console.error('提示', 'option两者格式不符合')
    }

    if (!FirstOBJ.options && SecondOBJ.options) {
        console.error('提示', 'option两者格式不符合')
    }
}

/**
 * 继承
 */
function _extens (FirstOBJ: any, SecondOBJ: any) {
    const filterKeys = ['data', 'radius', 'center', 'color'] // 过滤keys

    const newOBJ = _.cloneDeep(SecondOBJ)

    assign(newOBJ, FirstOBJ, filterKeys) // 会直接改变第一项

    return newOBJ
}

/**
 * 继承
 */
const extens = (FirstOBJ: any, SecondOBJ: any) => {
    _modeCheck(FirstOBJ, SecondOBJ)

    const option = _extens(FirstOBJ, SecondOBJ)

    return option
}

export { extens }
