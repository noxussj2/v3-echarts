export const generateWindBarbSVG = (dirDeg, speed, options = {}) => {

    // 1. 🌬️ 配置项
    const defaultConfig = {

        // 风矢符号所代表的风速值 (knots)
        value: {
            triangle: 25,
            longBarb: 5,
            shortBarb: 2.5
        },
        geometry: {
            color: '#fff',
            strokeWidth: 2,
            barbPadding: 4, // 两个风矢标记之间的垂直间距
            minMainHeight: 30, // 主线的最小高度
            margin: 16, // SVG 最小边距
            barbLongWidth: 16, // 长风矢线的水平投影长度
            barbShortWidth: 8, // 短风矢线的水平投影长度
            barbAngleDeg: 15, // 风矢线与主线的夹角 (度)
            triangleSideLength: 16 // 三角形的边长 (用于计算 dx)
        }
    }

    const config = {
        value: {
            ...defaultConfig.value,
            ...(options.value || {})
        },
        geometry: {
            ...defaultConfig.geometry,
            ...(options.geometry || {})
        }
    }

    const { value } = config
    const { color, strokeWidth, barbPadding, minMainHeight, margin, barbLongWidth, barbShortWidth } = config.geometry

    const theta = (15 * Math.PI) / 180 // 15度转弧度
    const calcDy = (dx) => Math.tan(theta) * dx

    // Helper functions
    const createLine = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${strokeWidth}"/>`

    const createPolygon = (points) => `<polygon points="${points.map((p) => p.join(',')).join(' ')}" fill="${color}"/>`

    const calcHeight = (_speed) => {
        let triangleCount = 0
        let longBarbCount = 0
        let shortBarbCount = 0

        while (_speed >= value.shortBarb) {
            if (_speed >= value.triangle) {
                triangleCount++
                _speed -= value.triangle
                continue
            }
            if (_speed >= value.longBarb) {
                longBarbCount++
                _speed -= value.longBarb
                continue
            }
            if (_speed >= value.shortBarb) {
                shortBarbCount++
                _speed -= value.shortBarb
                continue
            }
        }

        let mainHeight = (triangleCount + longBarbCount + shortBarbCount) * calcDy(25)
        mainHeight = Math.max(mainHeight, minMainHeight)

        return { mainHeight, triangleCount, longBarbCount, shortBarbCount, totalHeight: mainHeight }
    }

    const { mainHeight, triangleCount, longBarbCount, shortBarbCount, totalHeight } = calcHeight(speed)
    const size = totalHeight + margin * 2
    const cx = size / 2
    const cy = size / 2

    // Main line
    const mainLine = { p1: [cx, margin], p2: [cx, mainHeight + margin] }
    let svgContent = createLine(...mainLine.p1, ...mainLine.p2)

    // Arrows (triangles)
    let currentHeight = mainLine.p1[1]

    currentHeight = currentHeight + calcDy(25)

    const createTriangle = (width) => {
        const dx = width // 水平距离
        const dy = calcDy(width) // 计算垂直偏移

        const p1 = [cx - strokeWidth / 2, currentHeight]
        const p2 = [p1[0] + dx, p1[1] - dy]
        const p3 = [p1[0], p2[1]]

        // 更新 currentHeight
        currentHeight += p1[1] - p2[1]

        return createPolygon([p1, p2, p3])
    }

    for (let i = 0; i < triangleCount; i++) svgContent += createTriangle(25)

    // Barbs
    if (triangleCount > 0) {
        currentHeight = currentHeight - calcDy(25) + barbPadding
    }
    else {
        currentHeight = currentHeight - calcDy(25)
    }

    const createBarb = (width) => {
        const dx = width // 水平距离
        const dy = calcDy(width) // 计算垂直偏移

        const p1 = [cx - strokeWidth / 2, currentHeight]
        const p2 = [p1[0] + dx, p1[1] - dy]
        currentHeight += barbPadding
        return createLine(...p1, ...p2)
    }
    for (let i = 0; i < longBarbCount; i++) svgContent += createBarb(barbLongWidth)
    for (let i = 0; i < shortBarbCount; i++) svgContent += createBarb(barbShortWidth)

    // Return final SVG
    const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <g transform="rotate(${dirDeg}, ${cx}, ${cy})">${svgContent}</g>
        </svg>`

    return {
        svg,
        size,
        original: {
            size,
            dirDeg,
            cx,
            cy,
            mainLine,
            svgContent
        }
    }
}
