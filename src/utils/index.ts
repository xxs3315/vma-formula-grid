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
            if (changedColumnHides[`${sidx + 1}`] === 0) {
                // 该列隐藏
                x += 0
            } else {
                // 该列显示
                if (changedColumnWidths[`${sidx + 1}`]) {
                    // 该列宽度有自定义
                    x += changedColumnWidths[`${sidx + 1}`]
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
            x += changedColumnWidths[`${sidx + 1}`] ? changedColumnWidths[`${sidx + 1}`] : columnWidth
            sidx++
        } while (scrollLeft >= x)
        return sidx - 1
    }
    if (Object.keys(changedColumnHides).length) {
        // 配置中只有列隐藏定义
        let sidx = 0
        let x = 0
        do {
            x += changedColumnHides[`${sidx + 1}`] === 0 ? 0 : columnWidth
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
        xSize += changedColumnHides[`${visibleIndex + x + 1}`] === 0 ? 0 : changedColumnWidths[`${visibleIndex + x + 1}`] ? changedColumnWidths[`${visibleIndex + x + 1}`] : colWidth
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
            if (changedRowHides[`${sidy + 1}`] === 0) {
                // 该行隐藏
                y += 0
            } else {
                // 该行显示
                if (changedRowHeights[`${sidy + 1}`]) {
                    // 该行高度有自定义
                    y += changedRowHeights[`${sidy + 1}`]
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
            y += changedRowHeights[`${sidy + 1}`] ? changedRowHeights[`${sidy + 1}`] : rowHeight
            sidy++
        } while (scrollTop >= y)
        return sidy - 1
    }
    if (Object.keys(changedRowHides).length) {
        // 配置中只有行隐藏定义
        let sidy = 0
        let y = 0
        do {
            y += changedRowHides[`${sidy + 1}`] === 0 ? 0 : rowHeight
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
        ySize += changedRowHides[`${visibleIndex + y + 1}`] === 0 ? 0 : changedRowWidths[`${visibleIndex + y + 1}`] ? changedRowWidths[`${visibleIndex + y + 1}`] : rowHeight
        y++
    }
    return y
}


export const getXSpaceFromColumnWidths = (startColIndex: number, colWidth: number, changedColumnWidths: Record<string, number>, changedColumnHides: Record<string, number>): number => {
    if (Object.keys(changedColumnWidths).length && Object.keys(changedColumnHides).length) {
        // 配置中既有列宽定义，又有列隐藏定义
        let sidx = 0
        let xSpace = 0
        while (startColIndex > sidx) {
            if (changedColumnHides[`${sidx + 1}`] === 0) {
                // 该列隐藏
                xSpace += 0
            } else {
                // 该列显示
                if (changedColumnWidths[`${sidx + 1}`]) {
                    // 该列宽度有自定义
                    xSpace += changedColumnWidths[`${sidx + 1}`]
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
        let sidx = 0
        let xSpace = 0
        while (startColIndex > sidx) {
            xSpace += changedColumnWidths[`${sidx + 1}`] ? changedColumnWidths[`${sidx + 1}`] : colWidth
            sidx++
        }
        return xSpace
    }
    if (Object.keys(changedColumnHides).length) {
        // 配置中只有列隐藏定义
        let sidx = 0
        let xSpace = 0
        while (startColIndex > sidx) {
            xSpace += changedColumnHides[`${sidx + 1}`] === 0 ? 0 : colWidth
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
            if (changedRowHides[`${sidy + 1}`] === 0) {
                // 该行隐藏
                ySpace += 0
            } else {
                // 该行显示
                if (changedRowHeights[`${sidy + 1}`]) {
                    // 该行高度有自定义
                    ySpace += changedRowHeights[`${sidy + 1}`]
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
            ySpace += changedRowHeights[`${sidx + 1}`] ? changedRowHeights[`${sidx + 1}`] : rowHeight
            sidx++
        }
        return ySpace
    }
    if (Object.keys(changedRowHides).length) {
        // 配置中只有行隐藏定义
        let sidx = 0
        let ySpace = 0
        while (startIndex > sidx) {
            ySpace += changedRowHides[`${sidx + 1}`] === 0 ? 0 : rowHeight
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
    } else if (Object.keys(changedRowHeights).length) {
        // 配置中只有行高定义
        for (const k in Object.keys(changedRowHeights)) {
            if (changedRowHeights.hasOwnProperty(Object.keys(changedRowHeights)[k])) {
                changeSum += changedRowHeights[Object.keys(changedRowHeights)[k]] - rowHeight
            }
        }
    } else if (Object.keys(changedRowHides).length) {
        // 配置中只有行隐藏定义
        for (const k in Object.keys(changedRowHides)) {
            if (changedRowHides.hasOwnProperty(Object.keys(changedRowHides)[k])) {
                changeSum -= rowHeight
            }
        }
    }

    return total * rowHeight + changeSum
}

type ttf<nd> = (data: nd, index: number, list: ll<nd>) => boolean

type tmf<nd> = (data: any, index: number, list: ll<nd>) => any

export class ll<nd = any> {
    public head: lln<nd> | null
    public tail: lln<nd> | null
    private size: number

    constructor(...args: nd[]) {
        this.head = null
        this.tail = null
        this.size = 0

        for (let i = 0; i < args.length; i++) {
            this.append(args[i])
        }
    }

    public get length(): number {
        return this.size
    }

    public static from<T>(iterable: Iterable<T>): ll<T> {
        return new ll(...iterable)
    }

    public get(index: number): nd | undefined {
        const node = this.getNode(index)
        return node !== undefined ? node.data : undefined
    }

    public getNode(index: number): lln<nd> | undefined {
        if (this.head === null || index < 0 || index >= this.length) {
            return undefined
        }
        const asc = index < this.length / 2
        const stopAt = asc ? index : this.length - index - 1
        const nextNode = asc ? 'next' : 'prev'
        let currentNode = asc ? this.head : this.tail
        for (let currentIndex = 0; currentIndex < stopAt; currentIndex++) {
            currentNode = currentNode![nextNode]
        }
        return currentNode!
    }

    public findNodeIndex(f: ttf<nd>):
        | {
        node: lln<nd>
        index: number
    }
        | undefined {
        let currentIndex = 0
        let currentNode = this.head
        while (currentNode) {
            if (f(currentNode.data, currentIndex, this)) {
                return {
                    index: currentIndex,
                    node: currentNode
                }
            }
            currentNode = currentNode.next
            currentIndex += 1
        }
        return undefined
    }

    public findNode(f: ttf<nd>): lln<nd> | undefined {
        const nodeIndex = this.findNodeIndex(f)
        return nodeIndex !== undefined ? nodeIndex.node : undefined
    }

    public find(f: ttf<nd>): nd | undefined {
        const nodeIndex = this.findNodeIndex(f)
        return nodeIndex !== undefined ? nodeIndex.node.data : undefined
    }

    public findIndex(f: ttf<nd>): number {
        const nodeIndex = this.findNodeIndex(f)
        return nodeIndex !== undefined ? nodeIndex.index : -1
    }

    public append(...args: nd[]): ll<nd> {
        for (const data of args) {
            const node = new lln(data, this.tail, null, this)
            if (this.head === null) {
                this.head = node
            }
            if (this.tail !== null) {
                this.tail.next = node
            }
            this.tail = node
            this.size += 1
        }
        return this
    }

    public push(...args: nd[]): number {
        this.append(...args)
        return this.length
    }

    public prepend(...args: nd[]): ll<nd> {
        const reverseArgs = Array.from(args).reverse()
        for (const data of reverseArgs) {
            const node = new lln(data, null, this.head, this)
            if (this.tail === null) {
                this.tail = node
            }
            if (this.head !== null) {
                this.head.prev = node
            }
            this.head = node
            this.size += 1
        }
        return this
    }

    public insertAt(index: number, data: nd): ll<nd> {
        if (this.head === null) {
            return this.append(data)
        }
        if (index <= 0) {
            return this.prepend(data)
        }

        let currentNode = this.head
        let currentIndex = 0
        while (currentIndex < index - 1 && currentNode.next !== null) {
            currentIndex += 1
            currentNode = currentNode.next
        }
        currentNode.insertAfter(data)
        return this
    }

    public removeNode(node: lln<nd>): lln<nd> {
        if (node.list !== this) {
            throw new ReferenceError('Node does not belong to this list')
        }

        if (node.prev !== null) {
            node.prev.next = node.next
        }

        if (node.next !== null) {
            node.next.prev = node.prev
        }

        if (this.head === node) {
            this.head = node.next
        }

        if (this.tail === node) {
            this.tail = node.prev
        }

        this.size -= 1
        node.next = null
        node.prev = null
        node.list = null
        return node
    }

    public removeAt(index: number): lln<nd> | undefined {
        const node = this.getNode(index)
        return node !== undefined ? this.removeNode(node) : undefined
    }

    public insertBefore(rn: lln<nd>, data: nd): ll<nd> {
        const node = new lln(data, rn.prev, rn, this)
        if (rn.prev === null) {
            this.head = node
        }
        if (rn.prev !== null) {
            rn.prev.next = node
        }
        rn.prev = node
        this.size += 1
        return this
    }

    public sort(compare: (a: nd, b: nd) => boolean): ll<nd> {
        if (this.head === null || this.tail === null) {
            return this
        }
        if (this.length < 2) {
            return this
        }

        const quicksort = (start: lln<nd>, end: lln<nd>) => {
            if (start === end) {
                return
            }
            const pivotData = end.data
            let current: lln | null = start
            let split: lln = start
            while (current && current !== end) {
                const sort = compare(current.data, pivotData)
                if (sort) {
                    if (current !== split) {
                        const temp = split.data
                        split.data = current.data
                        current.data = temp
                    }
                    split = split.next!
                }
                current = current.next
            }
            end.data = split.data
            split.data = pivotData

            if (start.next === end.prev) {
                return
            }

            if (split.prev && split !== start) {
                quicksort(start, split.prev)
            }
            if (split.next && split !== end) {
                quicksort(split.next, end)
            }
        }

        quicksort(this.head, this.tail)
        return this
    }

    public insertAfter(rn: lln<nd>, data: nd): ll<nd> {
        const node = new lln(data, rn, rn.next, this)
        if (rn.next === null) {
            this.tail = node
        }
        if (rn.next !== null) {
            rn.next.prev = node
        }
        rn.next = node
        this.size += 1
        return this
    }

    public shift(): nd | undefined {
        return this.removeFromAnyEnd(this.head)
    }

    public pop(): nd | undefined {
        return this.removeFromAnyEnd(this.tail)
    }

    public merge(list: ll<nd>): void {
        if (this.tail !== null) {
            this.tail.next = list.head
        }
        if (list.head !== null) {
            list.head.prev = this.tail
        }
        this.head = this.head || list.head
        this.tail = list.tail || this.tail
        this.size += list.size
        list.size = this.size
        list.head = this.head
        list.tail = this.tail
    }

    public clear() {
        this.head = null
        this.tail = null
        this.size = 0
        return this
    }

    public slice(start: number, end?: number): ll<nd | Record<string | number | symbol, unknown>> {
        const list = new ll()
        let finish = end

        if (this.head === null || this.tail === null) {
            return list
        }
        if (finish === undefined || finish < start) {
            finish = this.length
        }

        let head: lln<nd> | null | undefined = this.getNode(start)
        for (let i = 0; i < finish - start && head !== null && head !== undefined; i++) {
            list.append(head.data)
            head = head.next
        }
        return list
    }

    public reverse(): ll<nd> {
        let currentNode = this.head
        while (currentNode) {
            const next = currentNode.next
            currentNode.next = currentNode.prev
            currentNode.prev = next
            currentNode = currentNode.prev
        }
        const tail = this.tail
        this.tail = this.head
        this.head = tail
        return this
    }

    public forEach(f: tmf<nd>, reverse = false): void {
        let currentIndex = reverse ? this.length - 1 : 0
        let currentNode = reverse ? this.tail : this.head
        const modifier = reverse ? -1 : 1
        const nextNode = reverse ? 'prev' : 'next'
        while (currentNode) {
            f(currentNode.data, currentIndex, this)
            currentNode = currentNode[nextNode]
            currentIndex += modifier
        }
    }

    public map(f: tmf<nd>, reverse = false): ll<nd | Record<string | number | symbol, unknown>> {
        const list = new ll()
        this.forEach((data, index) => list.append(f(data, index, this)), reverse)
        return list
    }

    public filter(f: ttf<nd>, reverse = false): ll<nd | Record<string | number | symbol, unknown>> {
        const list = new ll()
        this.forEach((data, index) => {
            if (f(data, index, this)) {
                list.append(data)
            }
        }, reverse)
        return list
    }

    public reduce(f: (accumulator: any, currentNode: nd, index: number, list: ll<nd>) => any, start?: any, reverse = false): any {
        let currentIndex = reverse ? this.length - 1 : 0
        const modifier = reverse ? -1 : 1
        const nextNode = reverse ? 'prev' : 'next'
        let currentElement = reverse ? this.tail : this.head
        let result

        if (start !== undefined) {
            result = start
        } else if (currentElement) {
            result = currentElement.data
            currentElement = currentElement[nextNode]
        } else {
            throw new TypeError('Reduce of empty ll with no initial value')
        }

        while (currentElement) {
            result = f(result, currentElement.data, currentIndex, this)
            currentIndex += modifier
            currentElement = currentElement[nextNode]
        }

        return result
    }

    public toArray(): nd[] {
        return [...this]
    }

    public toString(separator = ' '): string {
        return this.reduce((s, data) => `${s}${separator}${data}`)
    }

    public* [Symbol.iterator](): IterableIterator<nd> {
        let element = this.head

        while (element !== null) {
            yield element.data
            element = element.next
        }
    }

    private removeFromAnyEnd(node: lln<nd> | null) {
        return node !== null ? this.removeNode(node).data : undefined
    }
}


export class lln<nd = any> {
    constructor(
        public data: nd,
        public prev: lln<nd> | null,
        public next: lln<nd> | null,
        public list: ll<nd> | null
    ) {
    }

    public get value() {
        return this.data
    }

    public get index() {
        if (!this.list) {
            return undefined
        }
        return this.list.findIndex(value => value === this.value)
    }

    public insertBefore(data: nd): ll<nd> {
        return this.list !== null ? this.list.insertBefore(this, data) : new ll(data, this.data)
    }

    public insertAfter(data: nd): ll<nd> {
        return this.list !== null ? this.list.insertAfter(this, data) : new ll(this.data, data)
    }

    public remove(): lln<nd> {
        if (this.list === null) {
            throw new ReferenceError('Node does not belong to any list')
        }
        return this.list.removeNode(this)
    }
}


export class d {
    constructor(g: Record<string, any>) {
        this._g = g
        const gks = Object.keys(this._g)
        this._v = gks.length
        this._e = 0
        this._aj = ll.from([...Array.from({length: this._v}, () => new ll<number>())])
        this._aj.forEach((_, index) => {
            this._g[gks[index]].children.forEach((item: any) => {
                this.ae(index, gks.indexOf(item))
            })
        })
    }

    private _v: number

    get v(): number {
        return this._v
    }

    set v(value: number) {
        this._v = value
    }

    private _e: number

    get e(): number {
        return this._e
    }

    set e(value: number) {
        this._e = value
    }

    private _g: Record<string, any>

    get g(): Record<string, any> {
        return this._g
    }

    set g(value: Record<string, any>) {
        this._g = value
    }

    private _aj: ll<ll<number>>

    get aj(): ll<ll<number>> {
        return this._aj
    }

    set aj(value: ll<ll<number>>) {
        this._aj = value
    }

    private ae = (v: number, w: number) => {
        this._aj.get(v)!.append(w)
        this._e++
    }
}

export default class dc {
    constructor(dg: d) {
        this._m = Array.from({length: dg.v})
        this._et = Array.from({length: dg.v})
        this._os = Array.from({length: dg.v})

        for (let i = 0; i < dg.v; i++) {
            if (!this._m[i]) this.dfp(dg, i)
        }
    }

    private _m: boolean[]

    get m(): boolean[] {
        return this._m
    }

    set m(value: boolean[]) {
        this._m = value
    }

    private _et: number[]

    get et(): number[] {
        return this._et
    }

    set et(value: number[]) {
        this._et = value
    }

    private _cy: number[] = []

    get c(): number[] {
        return this._cy
    }

    set c(value: number[]) {
        this._cy = value
    }

    private _os: boolean[]

    get os(): boolean[] {
        return this._os
    }

    set os(value: boolean[]) {
        this._os = value
    }

    hc = (): boolean => this._cy !== null && this._cy !== undefined && this._cy.length > 0

    private dfp = (dg: d, v: number) => {
        this._m[v] = true
        this._os[v] = true
        if (dg.aj.get(v)) {
            dg.aj.get(v)!.forEach((item: number) => {
                if (this._cy === null || this._cy === undefined || this._cy.length === 0) {
                    if (!this._m[item]) {
                        this._et[item] = v
                        this.dfp(dg, item)
                    } else if (this._os[item]) {
                        for (let x = v; x !== item; x = this._et[x]) {
                            this._cy.push(x)
                        }
                        this._cy.push(item)
                        this._cy.push(v)
                    }
                }
            })
        }
        this._os[v] = false
    }
}


export class dfo {
    constructor(dg: d) {
        this._f = new ll<number>()
        this._b = new ll<number>()
        this._rb = new ll<number>()
        this._m = Array.from({length: dg.v})

        for (let i = 0; i < dg.v; i++) {
            if (!this._m[i]) this.dfp(dg, i)
        }
    }

    private _m: boolean[]

    get m(): boolean[] {
        return this._m
    }

    set m(value: boolean[]) {
        this._m = value
    }

    private _f: ll<number>

    get f(): ll<number> {
        return this._f
    }

    set f(value: ll<number>) {
        this._f = value
    }

    private _b: ll<number>

    get b(): ll<number> {
        return this._b
    }

    set b(value: ll<number>) {
        this._b = value
    }

    private _rb: ll<number>

    get rb(): ll<number> {
        return this._rb
    }

    set rb(value: ll<number>) {
        this._rb = value
    }

    private dfp = (dg: d, v: number) => {
        this._f.append(v)
        this._m[v] = true
        if (dg.aj.get(v)) {
            dg.aj.get(v)!.forEach((item: number) => {
                if (!this._m[item]) {
                    this.dfp(dg, item)
                }
            })
        }
        this._b.append(v)
        this._rb.push(v)
    }
}


export function filterVertexes(vertexes: Record<string, any>, errorMap: Record<string, any>) {
    const vertexKeys = Object.keys(vertexes)
    if (vertexKeys.length === 0) {
        return { noErrorVertexes: vertexes, errorMap }
    }
    const errorMapKeys = Object.keys(errorMap)
    let hasErrorDep = false
    for (let i = 0; i < vertexKeys.length; i++) {
        if (vertexes.hasOwnProperty(vertexKeys[i]) && vertexes[vertexKeys[i]].children && vertexes[vertexKeys[i]].children.length > 0) {
            const dp = vertexes[vertexKeys[i]].children.find((item: any) => errorMapKeys.indexOf(item) >= 0)
            if (dp) {
                hasErrorDep = true
                errorMap[vertexKeys[i]] = vertexes[vertexKeys[i]]
                delete vertexes[vertexKeys[i]]
                break
            }
        }
        if (hasErrorDep) {
            filterVertexes(vertexes, errorMap)
        }
    }
    return { noErrorVertexes: vertexes, errorMap }
}

export function calcVertexes(vertexes: Record<string, any>, cycleVertexes: Record<string, any>): any {
    const vertexKeys = Object.keys(vertexes)
    let result
    const g = new d(vertexes)
    const dcs = new dc(g)
    if (dcs.hc()) {
        for (let i = 0; i < dcs.c.length; i++) {
            if (!cycleVertexes.hasOwnProperty(vertexKeys[dcs.c[i]])) {
                cycleVertexes[vertexKeys[dcs.c[i]]] = [vertexes[vertexKeys[dcs.c[i]]]].concat()[0]
                delete vertexes[vertexKeys[dcs.c[i]]]
            }
        }
        result = calcVertexes(vertexes, cycleVertexes)
    } else {
        const dfos = new dfo(g)
        const topological: any = []
        if (dfos.rb && dfos.rb.length > 0) {
            dfos.rb.forEach((item: any) => {
                topological.push(vertexKeys[item])
            })
        }
        result = { g, topological, noCycleVertexes: vertexes, cycleVertexes }
    }
    return result
}
