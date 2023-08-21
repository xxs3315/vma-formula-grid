import {VmaFormulaGridPropTypes} from "../types/grid";

export function isNumeric(val: string | number): val is string {
    return typeof val === 'number' || /^\d+(\.\d+)?$/.test(val)
}

export function isNaN(val: number): val is typeof NaN {
    if (Number.isNaN) {
        return Number.isNaN(val)
    }

    // eslint-disable-next-line no-self-compare
    return val !== val
}

export function isObject(obj: any) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

export function getRenderDefaultColWidth(defaultColumnWidth: number | undefined, gridSize: VmaFormulaGridPropTypes.Size): number {
    if (defaultColumnWidth) {
        // if (gridSize === 'xxx-large') {
        //     return Math.max(180, defaultColumnWidth)
        // }
        // if (gridSize === 'xx-large') {
        //     return Math.max(168, defaultColumnWidth)
        // }
        // if (gridSize === 'x-large') {
        //     return Math.max(156, defaultColumnWidth)
        // }
        if (gridSize === 'large') {
            return Math.max(144, defaultColumnWidth)
        }
        if (gridSize === 'normal') {
            return Math.max(132, defaultColumnWidth)
        }
        if (gridSize === 'small') {
            return Math.max(120, defaultColumnWidth)
        }
        if (gridSize === 'mini') {
            return Math.max(108, defaultColumnWidth)
        }
    } else {
        // if (gridSize === 'xxx-large') {
        //     return 180
        // }
        // if (gridSize === 'xx-large') {
        //     return 168
        // }
        // if (gridSize === 'x-large') {
        //     return 156
        // }
        if (gridSize === 'large') {
            return 144
        }
        if (gridSize === 'normal') {
            return 132
        }
        if (gridSize === 'small') {
            return 120
        }
        if (gridSize === 'mini') {
            return 108
        }
    }
    return 132
}

export function getRenderDefaultRowHeight(defaultRowHeight: number | undefined, gridSize: VmaFormulaGridPropTypes.Size): number {
    if (defaultRowHeight) {
        // if (gridSize === 'xxx-large') {
        //     return Math.max(44, defaultRowHeight)
        // }
        // if (gridSize === 'xx-large') {
        //     return Math.max(40, defaultRowHeight)
        // }
        // if (gridSize === 'x-large') {
        //     return Math.max(36, defaultRowHeight)
        // }
        if (gridSize === 'large') {
            return Math.max(32, defaultRowHeight)
        }
        if (gridSize === 'normal') {
            return Math.max(28, defaultRowHeight)
        }
        if (gridSize === 'small') {
            return Math.max(24, defaultRowHeight)
        }
        if (gridSize === 'mini') {
            return Math.max(20, defaultRowHeight)
        }
    } else {
        // if (gridSize === 'xxx-large') {
        //     return 44
        // }
        // if (gridSize === 'xx-large') {
        //     return 40
        // }
        // if (gridSize === 'x-large') {
        //     return 36
        // }
        if (gridSize === 'large') {
            return 32
        }
        if (gridSize === 'normal') {
            return 28
        }
        if (gridSize === 'small') {
            return 24
        }
        if (gridSize === 'mini') {
            return 20
        }
    }
    return 28
}

export function getRenderRowIndicatorWidth(gridSize: VmaFormulaGridPropTypes.Size): number {
    // if (gridSize === 'xxx-large') {
    //     return 20
    // }
    // if (gridSize === 'xx-large') {
    //     return 18
    // }
    // if (gridSize === 'x-large') {
    //     return 16
    // }
    if (gridSize === 'large') {
        return 14
    }
    if (gridSize === 'normal') {
        return 12
    }
    if (gridSize === 'small') {
        return 10
    }
    if (gridSize === 'mini') {
        return 8
    }
    return 12
}

/**
 *
 * @param count number from 1
 */
export const getColumnSymbol = (count: number): string => {
    let nLength: number = count
    let p = ''
    do {
        nLength--
        const n = nLength % 26
        p += String.fromCharCode(n + 65)
        nLength = Math.trunc((nLength - n) / 26)
    } while (nLength > 0)
    return p.split('').reverse().join('')
}

/**
 *
 * @param symbol string
 */
export const getColumnCount = (symbol: string): number => {
    let col26 = ''
    let codeA = 'A'.charCodeAt(0)
    symbol.toUpperCase().split('').forEach(char => {
        const code = char.charCodeAt(0)
        const minus = code - codeA + 1
        if (minus > 9) {
            col26 += String.fromCharCode(code - 9)
        } else {
            col26 += minus.toString()
        }
    })
    return parseInt(col26, 26)
}

export const getIndexFromColumnWidths = (scrollLeft: number, columnWidth: number, changedColumnWidths: Record<string, number>, changedColumnHides: Record<string, number>): number => {
    if (Object.keys(changedColumnWidths).length && Object.keys(changedColumnHides).length) {
        // 配置中既有列宽定义，又有列隐藏定义
        let sidx = 0
        let x = 0
        do {
            if (changedColumnHides[`${sidx}`] === 0) {
                // 该列隐藏
                x += 0
            } else {
                // 该列显示
                if (changedColumnWidths[`${sidx}`]) {
                    // 该列宽度有自定义
                    x += changedColumnWidths[`${sidx}`]
                } else {
                    x += columnWidth
                }
            }
            sidx++
        } while (scrollLeft >= x)
        return sidx - 1
    }
    if (Object.keys(changedColumnWidths).length) {
        // 配置中只有列宽定义
        let sidx = 0
        let x = 0
        do {
            x += changedColumnWidths[`${sidx}`] ? changedColumnWidths[`${sidx}`] : columnWidth
            sidx++
        } while (scrollLeft >= x)
        return sidx - 1
    }
    if (Object.keys(changedColumnHides).length) {
        // 配置中只有列隐藏定义
        let sidx = 0
        let x = 0
        do {
            x += changedColumnHides[`${sidx}`] === 0 ? 0 : columnWidth
            sidx++
        } while (scrollLeft >= x)
        return sidx - 1
    }

    return Math.floor(scrollLeft / columnWidth)
}

export const getRealVisibleWidthSize = (
    viewportWidth: number,
    visibleIndex: number,
    colWidth: number,
    changedColumnWidths: Record<string, number>,
    changedColumnHides: Record<string, number>
): number => {
    let x = 0
    let xSize = 0
    while (xSize < viewportWidth) {
        xSize += changedColumnHides[`${visibleIndex + x}`] === 0 ? 0 : changedColumnWidths[`${visibleIndex + x}`] ? changedColumnWidths[`${visibleIndex + x}`] : colWidth
        x++
    }
    return x
}

export const getIndexFromRowHeights = (scrollTop: number, rowHeight: number, changedRowHeights: Record<string, number>, changedRowHides: Record<string, number>): number => {
    if (Object.keys(changedRowHeights).length && Object.keys(changedRowHides).length) {
        // 配置中既有行高定义，又有行隐藏定义
        let sidy = 0
        let y = 0
        do {
            // y += changedRowHeights[`${sidy}`] && changedRowHides[`${sidy}`]
            //   ? changedRowHeights[`${sidy}`]
            //   : changedRowHides[`${sidy}`] ? rowHeight : 0
            if (changedRowHides[`${sidy}`] === 0) {
                // 该行隐藏
                y += 0
            } else {
                // 该行显示
                if (changedRowHeights[`${sidy}`]) {
                    // 该行高度有自定义
                    y += changedRowHeights[`${sidy}`]
                } else {
                    y += rowHeight
                }
            }
            sidy++
        } while (scrollTop >= y)
        return sidy - 1
    }
    if (Object.keys(changedRowHeights).length) {
        // 配置中只有行高定义
        let sidy = 0
        let y = 0
        do {
            y += changedRowHeights[`${sidy}`] ? changedRowHeights[`${sidy}`] : rowHeight
            sidy++
        } while (scrollTop >= y)
        return sidy - 1
    }
    if (Object.keys(changedRowHides).length) {
        // 配置中只有行隐藏定义
        let sidy = 0
        let y = 0
        do {
            y += changedRowHides[`${sidy}`] === 0 ? 0 : rowHeight
            sidy++
        } while (scrollTop >= y)
        return sidy - 1
    }

    return Math.floor(scrollTop / rowHeight)
}

export const getRealVisibleHeightSize = (
    viewportHeight: number,
    visibleIndex: number,
    rowHeight: number,
    changedRowWidths: Record<string, number>,
    changedRowHides: Record<string, number>
): number => {
    let y = 0
    let ySize = 0
    while (ySize < viewportHeight) {
        ySize += changedRowHides[`${visibleIndex + y}`] === 0 ? 0 : changedRowWidths[`${visibleIndex + y}`] ? changedRowWidths[`${visibleIndex + y}`] : rowHeight
        y++
    }
    return y
}


export const getXSpaceFromColumnWidths = (startColIndex: number, colWidth: number, changedColumnWidths: Record<string, number>, changedColumnHides: Record<string, number>): number => {
    if (Object.keys(changedColumnWidths).length && Object.keys(changedColumnHides).length) {
        // 配置中既有列宽定义，又有列隐藏定义
        let sidx = 1
        let xSpace = 0
        while (startColIndex > sidx) {
            if (changedColumnHides[`${sidx}`] === 0) {
                // 该列隐藏
                xSpace += 0
            } else {
                // 该列显示
                if (changedColumnWidths[`${sidx}`]) {
                    // 该列宽度有自定义
                    xSpace += changedColumnWidths[`${sidx}`]
                } else {
                    xSpace += colWidth
                }
            }
            sidx++
        }
        return xSpace
    }
    if (Object.keys(changedColumnWidths).length) {
        // 配置中只有列宽定义
        let sidx = 1
        let xSpace = 0
        while (startColIndex > sidx) {
            xSpace += changedColumnWidths[`${sidx}`] ? changedColumnWidths[`${sidx}`] : colWidth
            sidx++
        }
        return xSpace
    }
    if (Object.keys(changedColumnHides).length) {
        // 配置中只有列隐藏定义
        let sidx = 1
        let xSpace = 0
        while (startColIndex > sidx) {
            xSpace += changedColumnHides[`${sidx}`] === 0 ? 0 : colWidth
            sidx++
        }
        return xSpace
    }
    return Math.max(0, (startColIndex - 1) * colWidth)
}

export const getYSpaceFromRowHeights = (startIndex: number, rowHeight: number, changedRowHeights: Record<string, number>, changedRowHides: Record<string, number>): number => {
    if (Object.keys(changedRowHeights).length && Object.keys(changedRowHides).length) {
        // 配置中既有行高定义，又有行隐藏定义
        let sidy = 0
        let ySpace = 0
        while (startIndex > sidy) {
            if (changedRowHides[`${sidy}`] === 0) {
                // 该行隐藏
                ySpace += 0
            } else {
                // 该行显示
                if (changedRowHeights[`${sidy}`]) {
                    // 该行高度有自定义
                    ySpace += changedRowHeights[`${sidy}`]
                } else {
                    ySpace += rowHeight
                }
            }
            sidy++
        }
        return ySpace
    }
    if (Object.keys(changedRowHeights).length) {
        // 配置中只有行高定义
        let sidx = 0
        let ySpace = 0
        while (startIndex > sidx) {
            ySpace += changedRowHeights[`${sidx}`] ? changedRowHeights[`${sidx}`] : rowHeight
            sidx++
        }
        return ySpace
    }
    if (Object.keys(changedRowHides).length) {
        // 配置中只有行隐藏定义
        let sidx = 0
        let ySpace = 0
        while (startIndex > sidx) {
            ySpace += changedRowHides[`${sidx}`] === 0 ? 0 : rowHeight
            sidx++
        }
        return ySpace
    }
    return Math.max(0, startIndex * rowHeight)
}

export const getWidth = (rowIndicatorElemWidth: number, total: number, colWidth: number, changedColumnWidths: Record<string, number>, changedColumnHides: Record<string, number>): number => {
    let changeSum = 0
    if (Object.keys(changedColumnWidths).length && Object.keys(changedColumnHides).length) {
        // 配置中既有列宽定义，又有列隐藏定义
        for (const k in Object.keys(changedColumnWidths)) {
            if (changedColumnWidths.hasOwnProperty(Object.keys(changedColumnWidths)[k])) {
                changeSum += changedColumnWidths[Object.keys(changedColumnWidths)[k]] - colWidth
            }
        }
        for (const k in Object.keys(changedColumnHides)) {
            if (changedColumnHides.hasOwnProperty(Object.keys(changedColumnHides)[k])) {
                if (changedColumnWidths[Object.keys(changedColumnHides)[k]]) {
                    changeSum -= changedColumnWidths[Object.keys(changedColumnHides)[k]]
                } else {
                    changeSum -= colWidth
                }
            }
        }
    } else if (Object.keys(changedColumnWidths).length) {
        // 配置中只有列宽定义
        for (const k in Object.keys(changedColumnWidths)) {
            if (changedColumnWidths.hasOwnProperty(Object.keys(changedColumnWidths)[k])) {
                changeSum += changedColumnWidths[Object.keys(changedColumnWidths)[k]] - colWidth
            }
        }
    } else if (Object.keys(changedColumnHides).length) {
        // 配置中只有列隐藏定义
        for (const k in Object.keys(changedColumnHides)) {
            if (changedColumnHides.hasOwnProperty(Object.keys(changedColumnHides)[k])) {
                changeSum -= colWidth
            }
        }
    }
    return rowIndicatorElemWidth + (total - 1) * colWidth + changeSum
}

export const getHeight = (total: number, rowHeight: number, changedRowHeights: Record<string, number>, changedRowHides: Record<string, number>): number => {
    let changeSum = 0
    if (Object.keys(changedRowHeights).length && Object.keys(changedRowHides).length) {
        // 配置中既有行高定义，又有行隐藏定义
        for (const k in Object.keys(changedRowHeights)) {
            if (changedRowHeights.hasOwnProperty(Object.keys(changedRowHeights)[k])) {
                changeSum += changedRowHeights[Object.keys(changedRowHeights)[k]] - rowHeight
            }
        }
        for (const k in Object.keys(changedRowHides)) {
            if (changedRowHides.hasOwnProperty(Object.keys(changedRowHides)[k])) {
                if (changedRowHeights[Object.keys(changedRowHides)[k]]) {
                    changeSum -= changedRowHeights[Object.keys(changedRowHides)[k]]
                } else {
                    changeSum -= rowHeight
                }
            }
        }
    }
    if (Object.keys(changedRowHeights).length) {
        // 配置中只有行高定义
        for (const k in Object.keys(changedRowHeights)) {
            if (changedRowHeights.hasOwnProperty(Object.keys(changedRowHeights)[k])) {
                changeSum += changedRowHeights[Object.keys(changedRowHeights)[k]] - rowHeight
            }
        }
    }
    if (Object.keys(changedRowHides).length) {
        // 配置中只有行隐藏定义
        for (const k in Object.keys(changedRowHides)) {
            if (changedRowHides.hasOwnProperty(Object.keys(changedRowHides)[k])) {
                changeSum -= rowHeight
            }
        }
    }

    return total * rowHeight + changeSum
}