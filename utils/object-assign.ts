import { type } from './dfs-deep-copy'

/**
 * 对象多层合并
 */
const assign = (target: any = {}, sources: any = {}, filterKeys: any = []) => {
    let obj = target

    if (type(target) === 'array' && type(sources) === 'object') {
        obj = obj[0]
    }

    /**
     * 如果其中有一个不是对象、数组，则返回
     */
    if (['object', 'array'].indexOf(type(target)) === -1 || ['object', 'array'].indexOf(type(sources)) === -1) {
        return sources
    }

    for (const key in sources) {

        /**
         * 如果target也存在该key，并且key不在过滤列表中，则继续合并
         */
        if (Object.prototype.hasOwnProperty.call(target, key) && filterKeys.indexOf(key) === -1) {
            obj[key] = assign(target[key], sources[key], filterKeys)
        }

        // 不存在就直接添加
        else {
            obj[key] = sources[key]
        }
    }

    return target
}

export default assign
