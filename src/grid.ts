import {
    ComponentOptions, computed, createCommentVNode,
    defineComponent,
    h, nextTick,
    onMounted,
    PropType,
    provide,
    reactive,
    ref,
    Ref,
    resolveComponent,
    watch
} from "vue";
import {
    VmaFormulaGridConstructor,
    VmaFormulaGridEmits, VmaFormulaGridMethods, VmaFormulaGridPrivateMethods,
    VmaFormulaGridPropTypes,
    VmaFormulaGridReactiveData,
    VmaFormulaGridRefs
} from "./types/grid";
import {Guid} from "./utils/guid.ts";
import {
    getColumnCount,
    getHeight,
    getIndexFromColumnWidths,
    getIndexFromRowHeights,
    getRealVisibleHeightSize,
    getRealVisibleWidthSize,
    getRenderDefaultColWidth,
    getRenderDefaultRowHeight,
    getRenderRowIndicatorWidth,
    getWidth,
    getXSpaceFromColumnWidths,
    getYSpaceFromRowHeights,
    isObject
} from "./utils";
import {Column} from "./internals/column.ts";
import {Row} from "./internals/row.ts";
import {Cell} from "./internals/cell.ts";
import {debounce} from "./utils/debounce.ts";

export default defineComponent({
    name: "VmaFormulaGrid",
    props: {
        data: Object as PropType<VmaFormulaGridPropTypes.Data>,
        type: {
            type: String as PropType<VmaFormulaGridPropTypes.Type>,
            default: 'primary',
        },
        size: {
            type: String as PropType<VmaFormulaGridPropTypes.Size>,
            default: 'normal'
        },
        minDims: {
            type: Array as PropType<VmaFormulaGridPropTypes.MinDims>,
            default: [10, 10], // [column, row]
        },
        defaultRowHeight: {
            type: Number as PropType<VmaFormulaGridPropTypes.DefaultRowHeight>,
        },
        defaultColumnWidth: {
            type: Number as PropType<VmaFormulaGridPropTypes.DefaultColumnWidth>,
        },
        columnResizable: {
            type: Boolean as PropType<VmaFormulaGridPropTypes.ColumnResizable>,
            default: true
        },
        rowResizable: {
            type: Boolean as PropType<VmaFormulaGridPropTypes.RowResizable>,
            default: true
        }
    },
    emits: ['update:data', 'change'] as VmaFormulaGridEmits,
    setup(props, context) {

        onMounted(() => {
            loadData().then(() => {
                console.log('data loaded.')
                $vmaFormulaGrid.recalculate(true)
            })
        })

        watch(() => props.data, () => {
            reset().then(() => {
                loadData().then(() => {
                    console.log('data reloaded.')
                    $vmaFormulaGrid.recalculate(true)
                })
            })

        }, {
            deep: true
        })

        watch(() => props.size, () => {
            $vmaFormulaGrid.recalculate(false)
        })

        watch(() => props.type, () => {
            $vmaFormulaGrid.recalculate(false)
        })

        const FormulaGridHeaderComponent = resolveComponent('VmaFormulaGridHeader') as ComponentOptions
        const FormulaGridBodyComponent = resolveComponent('VmaFormulaGridBody') as ComponentOptions

        const refGridDiv = ref() as Ref<HTMLDivElement>

        const refColumnResizeBarDiv = ref() as Ref<HTMLDivElement>
        const refRowResizeBarDiv = ref() as Ref<HTMLDivElement>

        const refGridHeaderTableWrapperDiv = ref() as Ref<HTMLDivElement>
        const refGridBodyTableWrapperDiv = ref() as Ref<HTMLDivElement>
        const refGridHeaderLeftFixedTableWrapperDiv = ref() as Ref<HTMLDivElement>
        const refGridBodyLeftFixedTableWrapperDiv = ref() as Ref<HTMLDivElement>

        const refGridHeaderTable = ref() as Ref<HTMLTableElement>
        const refGridHeaderLeftFixedTable = ref() as Ref<HTMLTableElement>
        const refGridBodyTable = ref() as Ref<HTMLTableElement>
        const refGridBodyLeftFixedTable = ref() as Ref<HTMLTableElement>
        const refGridBodyLeftFixedScrollWrapperDiv = ref() as Ref<HTMLDivElement>

        const refGridBodyYLineDiv = ref() as Ref<HTMLDivElement>
        const refGridBodyXLineDiv = ref() as Ref<HTMLDivElement>

        const refGridBodyLeftFixedYLineDiv = ref() as Ref<HTMLDivElement>
        const refGridBodyLeftFixedXLineDiv = ref() as Ref<HTMLDivElement>

        const refGridHeaderLeftFixedXLineDiv = ref() as Ref<HTMLDivElement>

        const refGridHeaderTableColgroup = ref() as Ref<HTMLTableColElement>
        const refGridHeaderLeftFixedTableColgroup = ref() as Ref<HTMLTableColElement>

        const refGridBodyTableColgroup = ref() as Ref<HTMLTableColElement>
        const refGridBodyLeftFixedTableColgroup = ref() as Ref<HTMLTableColElement>

        const renderDefaultColWidth = computed(() => getRenderDefaultColWidth(props.defaultColumnWidth, props.size))

        const renderDefaultRowHeight = computed(() => getRenderDefaultRowHeight(props.defaultRowHeight, props.size))

        const rowIndicatorElWidth = computed(
            () => Math.max(getRenderRowIndicatorWidth(props.size) + gridReactiveData.yEnd.toString().length * getRenderRowIndicatorWidth(props.size), 40)
        )

        const gridReactiveData = reactive({
            xDim: 0,
            yDim: 0,
            xStart: -1,
            xEnd: 0,
            yStart: 0,
            yEnd: 0,
            scrollbarWidth: 0,
            scrollbarHeight: 0,
            gridWidth: 0,
            gridHeight: 0,
            gridHeaderWidth: 0,
            gridHeaderHeight: 0,
            gridBodyWidth: 0,
            gridBodyHeight: 0,
            gridLeftFixedHeaderWidth: 0,
            isOverflowX: false,
            isOverflowY: false,
            frozenColumnCount: 0,
            frozenRowCount: 0,
            colConfs: [],
            rowConfs: [],
            currentSheetData: [],
            rowHeightsChanged: {},
            columnWidthsChanged: {},
            rowHidesChanged: {},
            columnHidesChanged: {},
            columns: {
                firstList: [],
                leftList: [],
                otherList: [],
            },
            lastScrollLeft: 0,
            lastScrollTop: 0,
            lastScrollTime: 0
        }) as VmaFormulaGridReactiveData

        const gridRefs: VmaFormulaGridRefs = {
            refGridDiv,

            refColumnResizeBarDiv,
            refRowResizeBarDiv,

            refGridHeaderTableWrapperDiv,
            refGridBodyTableWrapperDiv,
            refGridHeaderLeftFixedTableWrapperDiv,
            refGridBodyLeftFixedTableWrapperDiv,

            refGridHeaderTable,
            refGridHeaderLeftFixedTable,
            refGridBodyTable,
            refGridBodyLeftFixedTable,
            refGridBodyLeftFixedScrollWrapperDiv,

            refGridBodyYLineDiv,
            refGridBodyXLineDiv,
            refGridBodyLeftFixedYLineDiv,
            refGridBodyLeftFixedXLineDiv,
            refGridHeaderLeftFixedXLineDiv,

            refGridHeaderTableColgroup,
            refGridHeaderLeftFixedTableColgroup,
            refGridBodyTableColgroup,
            refGridBodyLeftFixedTableColgroup,

            renderDefaultColWidth,
            renderDefaultRowHeight,
            rowIndicatorElWidth

        }

        const gridMethods = {
            recalculate: (refresh: boolean) => {
                arrangeColumnWidth()
                if (refresh) {
                    return computeScrollLoad().then(() => {
                        arrangeColumnWidth()
                        return computeScrollLoad()
                    })
                }
                return computeScrollLoad()
            }
        } as VmaFormulaGridMethods

        const gridPrivateMethods = {
            // getParentElem() {
            //     const el = refTableDiv.value
            //     if ($vmaFormulaTable) {
            //         const gridEl = $vmaFormulaTable.getRefs().refTableDiv.value
            //         return gridEl ? (gridEl.parentNode as HTMLElement) : null
            //     }
            //     return el ? (el.parentNode as HTMLElement) : null
            // },
            triggerScrollXEvent: (event: Event) => {
                const scrollBodyElem = (event.currentTarget || event.target) as HTMLDivElement
                debounceScrollX(scrollBodyElem)
            },
            triggerScrollYEvent: (event: Event) => {
                const scrollBodyElem = (event.currentTarget || event.target) as HTMLDivElement
                debounceScrollY(scrollBodyElem)
            },
        } as VmaFormulaGridPrivateMethods

        const debounceScrollX = debounce((scrollBodyElem: HTMLDivElement) => {
            calcScrollSizeX(scrollBodyElem).then(() => {
                arrangeColumnWidth()
            })
        }, 20)

        const debounceScrollY = debounce((scrollBodyElem: HTMLDivElement) => {
            calcScrollSizeY(scrollBodyElem).then(() => {
                updateStyle()
            })
        }, 20)



        const renderVN = () => {
            return h('div', {
                ref: refGridDiv,
                class: [
                    'vma-formula-grid',
                    `${props.size}`,
                    `${props.type}`,
                    {
                        'overflow-x': gridReactiveData.isOverflowX,
                        'overflow-y': gridReactiveData.isOverflowY,
                    },
                ]
            }, [
                props.columnResizable
                    ? h('div', {
                        ref: refColumnResizeBarDiv,
                        class: ['column-resize-bar', `${props.type}`],
                        style: gridReactiveData.isOverflowX
                            ? {
                                height: `calc(100% - ${gridReactiveData.scrollbarHeight}px)`,
                            }
                            : {},
                    })
                    : createCommentVNode(),
                props.rowResizable
                    ? h('div', {
                        ref: refRowResizeBarDiv,
                        class: ['row-resize-bar', `${props.type}`],
                        style: gridReactiveData.isOverflowY
                            ? {
                                width: `calc(100% - ${gridReactiveData.scrollbarWidth}px)`,
                            }
                            : {},
                    })
                    : createCommentVNode(),
                // header left fixed
                h(FormulaGridHeaderComponent, {
                    fixed: 'left',
                    class: ['left'],
                    style: {
                        height: `${gridReactiveData.gridHeaderHeight}px`,
                        width: `${gridReactiveData.gridLeftFixedHeaderWidth}px`,
                    },
                }),
                // header center
                h(FormulaGridHeaderComponent, {
                    fixed: 'center',
                    class: ['center'],
                    style: {
                        height: `${gridReactiveData.gridHeaderHeight}px`,
                        width: `${gridReactiveData.gridHeaderWidth}px`,
                    },
                }),
                // body left fixed
                h(FormulaGridBodyComponent, {
                    fixed: 'left',
                    class: ['left'],
                }),
                // body center
                h(FormulaGridBodyComponent, {
                    fixed: 'center',
                    class: ['center'],
                    style: {
                        height: `${gridReactiveData.gridBodyHeight}px`,
                    },
                })
            ])
        }

        const computeScrollLoad = () => {
            return nextTick().then(() => {
                calcScrollSizeX(refGridBodyTableWrapperDiv.value).then(() => {
                    calcScrollSizeY(refGridBodyTableWrapperDiv.value).then(() => {
                        arrangeColumnWidth()
                    })
                })
            })
        }

        const calcScrollSizeX = (scrollBodyElem: HTMLDivElement): Promise<void> =>
            new Promise((resolve): void => {
                const scrollLeft = scrollBodyElem.scrollLeft
                const visibleIndex = getIndexFromColumnWidths(scrollLeft, renderDefaultColWidth.value, gridReactiveData.columnWidthsChanged, gridReactiveData.columnHidesChanged)
                const viewportWidth = refGridBodyTableWrapperDiv.value.clientWidth
                const visibleSize = Math.max(
                    Math.ceil(viewportWidth / renderDefaultColWidth.value),
                    getRealVisibleWidthSize(viewportWidth, visibleIndex, renderDefaultColWidth.value, gridReactiveData.columnWidthsChanged, gridReactiveData.columnHidesChanged)
                )

                const offsetItem = {
                    startColIndex: Math.max(-1, visibleIndex + 1 - 5),
                    endColIndex: visibleIndex + visibleSize + 1 + 5,
                }

                const { startColIndex: offsetStartColIndex, endColIndex: offsetEndColIndex } = offsetItem
                const { xStart, xEnd } = gridReactiveData
                if (visibleIndex <= 0 || visibleIndex >= offsetEndColIndex - visibleSize - 1 - 5) {
                    if (xStart !== offsetStartColIndex || xEnd !== offsetEndColIndex) {
                        gridReactiveData.xStart = offsetStartColIndex
                        gridReactiveData.xEnd = offsetEndColIndex
                        updateScrollXYSpace()
                    }
                }
                resolve()
            })

        const calcScrollSizeY = (scrollBodyElem: HTMLDivElement): Promise<void> =>
            new Promise((resolve): void => {
                const scrollTop = scrollBodyElem.scrollTop
                const visibleIndex = getIndexFromRowHeights(scrollTop, renderDefaultRowHeight.value, gridReactiveData.rowHeightsChanged, gridReactiveData.rowHidesChanged)
                const viewportHeight = refGridBodyTableWrapperDiv.value.clientHeight
                const visibleSize = Math.max(
                    Math.ceil(viewportHeight / renderDefaultRowHeight.value),
                    getRealVisibleHeightSize(viewportHeight, visibleIndex, renderDefaultRowHeight.value, gridReactiveData.rowHeightsChanged, gridReactiveData.rowHidesChanged)
                )

                const offsetItem = {
                    startIndex: Math.max(0, visibleIndex + 1 - 5),
                    endIndex: visibleIndex + visibleSize + 1 + 5,
                }

                const { startIndex: offsetStartIndex, endIndex: offsetEndIndex } = offsetItem
                const { yStart, yEnd } = gridReactiveData
                if (visibleIndex <= 0 || visibleIndex >= offsetEndIndex - visibleSize - 1 - 5) {
                    if (yStart !== offsetStartIndex || yEnd !== offsetEndIndex) {
                        gridReactiveData.yStart = offsetStartIndex
                        gridReactiveData.yEnd = offsetEndIndex
                        updateScrollXYSpace()
                    }
                }
                resolve()
            })

        const updateScrollXYSpace = () => {
            const leftSpaceWidth = getXSpaceFromColumnWidths(gridReactiveData.xStart, renderDefaultColWidth.value, gridReactiveData.columnWidthsChanged, gridReactiveData.columnHidesChanged)
            const marginLeft = `${leftSpaceWidth}px`
            const topSpaceHeight = getYSpaceFromRowHeights(gridReactiveData.yStart, renderDefaultRowHeight.value, gridReactiveData.rowHeightsChanged, gridReactiveData.rowHidesChanged)
            const marginTop = `${topSpaceHeight}px`
            if (refGridBodyTable.value) {
                refGridBodyTable.value.style.transform = `translateX(${marginLeft}) translateY(${marginTop})`
                refGridBodyTable.value.style.width = `${gridReactiveData.gridWidth}px`
                refGridBodyLeftFixedTable.value.style.transform = `translateY(${marginTop})`
                refGridBodyLeftFixedTable.value.style.width = `${gridReactiveData.gridWidth}px`
            }
            if (refGridHeaderTable.value) {
                refGridHeaderTable.value.style.transform = `translateX(${marginLeft})`
                refGridHeaderTable.value.style.width = `${gridReactiveData.gridWidth + gridReactiveData.scrollbarWidth}px`
            }
        }

        const arrangeColumnWidth = () => {
            const firstList: any = []
            const leftList: any = []
            const otherList: any = []

            console.log({'gridReactiveData.xStart': gridReactiveData.xStart})

            if (gridReactiveData.xStart !== -1) {
                firstList.push(gridReactiveData.colConfs[0])
            }

            for (let index = gridReactiveData.xStart; index <= gridReactiveData.xEnd; index++) {
                if (index > gridReactiveData.colConfs.length - 1) {
                    break
                }
                const cf = gridReactiveData.colConfs[index + 1]
                if (index === -1) {
                    firstList.push(cf)
                } else if (cf.visible) {
                    otherList.push(cf)
                    if (cf.fixed === 'left') {
                        leftList.push(cf)
                    }
                }
            }

            Object.assign(gridReactiveData.columns, {
                firstList,
                leftList,
                otherList,
            })

            console.log({'gridReactiveData.columns': gridReactiveData.columns})

            nextTick(() => {
                calcColumnWidth()
            })
        }

        const calcColumnWidth = () => {
            let gridWidth = 0

            const { firstList, otherList } = gridReactiveData.columns
            // 第一列
            firstList.forEach((column: any) => {
                gridWidth += rowIndicatorElWidth.value
                column.width = rowIndicatorElWidth.value
            })
            // 其他列
            otherList.forEach((column: any) => {
                gridWidth += column.visible ? (typeof column.width === 'string' ? renderDefaultColWidth.value : column.width) : 0
            })

            gridReactiveData.gridWidth = gridWidth

            console.log({'gridReactiveData.gridWidth': gridReactiveData.gridWidth})

            nextTick(() => {
                updateStyle()
            })
        }

        const updateStyle = () => {
            const gridDivClientWidth = refGridDiv.value.clientWidth
            const gridDivClientHeight = refGridDiv.value.clientHeight

            const bodyClientWidth = refGridBodyTableWrapperDiv.value.clientWidth
            const bodyClientHeight = refGridBodyTableWrapperDiv.value.clientHeight
            const bodyOffsetWidth = refGridBodyTableWrapperDiv.value.offsetWidth
            const bodyOffsetHeight = refGridBodyTableWrapperDiv.value.offsetHeight

            gridReactiveData.gridWidth = gridDivClientWidth
            gridReactiveData.gridHeight = gridDivClientHeight
            gridReactiveData.gridHeaderWidth = gridReactiveData.gridWidth
            gridReactiveData.gridHeaderHeight = refGridHeaderTable.value.clientHeight

            const { firstList, leftList } = gridReactiveData.columns
            gridReactiveData.gridLeftFixedHeaderWidth = firstList
                .concat(leftList)
                .reduce((previous: any, column: any) => previous + (column.visible ? (typeof column.width === 'string' ? renderDefaultColWidth.value : column.width) : 0), 0)

            console.log({'gridReactiveData.gridLeftFixedHeaderWidth': gridReactiveData.gridLeftFixedHeaderWidth})

            gridReactiveData.gridBodyWidth = gridReactiveData.gridWidth
            gridReactiveData.gridBodyHeight = gridReactiveData.gridHeight - gridReactiveData.gridHeaderHeight
            gridReactiveData.isOverflowX = bodyOffsetWidth > bodyClientWidth
            gridReactiveData.isOverflowY = bodyOffsetHeight > bodyClientHeight

            gridReactiveData.scrollbarWidth = Math.max(bodyOffsetWidth - bodyClientWidth, 0)
            gridReactiveData.scrollbarHeight = Math.max(bodyOffsetHeight - bodyClientHeight, 0)

            console.log(
                {'gridReactiveData.gridWidth': gridReactiveData.gridWidth},
                {'gridReactiveData.gridHeight': gridReactiveData.gridHeight},
                {'gridReactiveData.gridHeaderWidth': gridReactiveData.gridHeaderWidth},
                {'gridReactiveData.gridHeaderHeight': gridReactiveData.gridHeaderHeight},
                {'gridReactiveData.gridBodyWidth': gridReactiveData.gridBodyWidth},
                {'gridReactiveData.gridBodyHeight': gridReactiveData.gridBodyHeight},
                {'gridReactiveData.isOverflowX': gridReactiveData.isOverflowX},
                {'gridReactiveData.isOverflowY': gridReactiveData.isOverflowY},
                {'gridReactiveData.scrollbarWidth': gridReactiveData.scrollbarWidth},
                {'gridReactiveData.scrollbarHeight': gridReactiveData.scrollbarHeight}
            )

            const { colConfs, scrollbarWidth } = gridReactiveData
            if (refGridHeaderTableColgroup.value.children && refGridHeaderTableColgroup.value.children.length) {
                Array.from(refGridHeaderTableColgroup.value.children).forEach((colgroupElem: any, _: number) => {
                    const idx = parseInt(colgroupElem.attributes.idx.value)
                    if (idx === -1) {
                        colgroupElem.style.width = `${rowIndicatorElWidth.value}px`
                    } else if (idx + 1 < colConfs.length) {
                        colgroupElem.style.width = `${colConfs[idx + 1].visible ? (typeof colConfs[idx + 1].width === 'string' ? renderDefaultColWidth.value : colConfs[idx + 1].width) : 0}px`
                    } else {
                        colgroupElem.style.width = `${scrollbarWidth}px`
                    }
                })
                Array.from(refGridBodyTableColgroup.value.children).forEach((colgroupElem: any, _: number) => {
                    const idx = parseInt(colgroupElem.attributes.idx.value)
                    if (idx === -1) {
                        colgroupElem.style.width = `${rowIndicatorElWidth.value}px`
                    } else if (idx + 1 < colConfs.length) {
                        colgroupElem.style.width = `${colConfs[idx + 1].visible ? (typeof colConfs[idx + 1].width === 'string' ? renderDefaultColWidth.value : colConfs[idx + 1].width) : 0}px`
                    }
                })
            }
            if (refGridHeaderLeftFixedTableColgroup.value.children && refGridHeaderLeftFixedTableColgroup.value.children.length) {
                Array.from(refGridHeaderLeftFixedTableColgroup.value.children).forEach((colgroupElem: any, _: number) => {
                    const idx = parseInt(colgroupElem.attributes.idx.value)
                    if (idx === -1) {
                        colgroupElem.style.width = `${rowIndicatorElWidth.value}px`
                    } else if (idx + 1 < colConfs.length) {
                        colgroupElem.style.width = `${colConfs[idx + 1].visible ? (typeof colConfs[idx + 1].width === 'string' ? renderDefaultColWidth.value : colConfs[idx + 1].width) : 0}px`
                    } else {
                        colgroupElem.style.width = `${scrollbarWidth}px`
                    }
                })
                Array.from(refGridBodyLeftFixedTableColgroup.value.children).forEach((colgroupElem: any, _: number) => {
                    const idx = parseInt(colgroupElem.attributes.idx.value)
                    if (idx === -1) {
                        colgroupElem.style.width = `${rowIndicatorElWidth.value}px`
                    } else if (idx + 1 < colConfs.length) {
                        colgroupElem.style.width = `${colConfs[idx + 1].visible ? (typeof colConfs[idx + 1].width === 'string' ? renderDefaultColWidth.value : colConfs[idx + 1].width) : 0}px`
                    }
                })
            }

            refGridHeaderLeftFixedTable.value.style.width = `${gridReactiveData.gridWidth + gridReactiveData.scrollbarWidth}px`
            refGridBodyLeftFixedTableWrapperDiv.value.style.width = `${gridReactiveData.gridLeftFixedHeaderWidth}px`
            refGridBodyLeftFixedTableWrapperDiv.value.style.height = `${gridReactiveData.gridBodyHeight - gridReactiveData.scrollbarHeight}px`

            console.log({'rowIndicatorElWidth.value': rowIndicatorElWidth.value},
                {'gridReactiveData.colConfs.length': gridReactiveData.colConfs.length},
                {'renderDefaultColWidth.value': renderDefaultColWidth.value},
                {'gridReactiveData.columnWidthsChanged': gridReactiveData.columnWidthsChanged},
                {'gridReactiveData.columnHidesChanged': gridReactiveData.columnHidesChanged})

            refGridBodyLeftFixedXLineDiv.value.style.width = `${getWidth(
                rowIndicatorElWidth.value,
                gridReactiveData.colConfs.length,
                renderDefaultColWidth.value,
                gridReactiveData.columnWidthsChanged,
                gridReactiveData.columnHidesChanged
            )}px`
            refGridHeaderLeftFixedXLineDiv.value.style.width = `${
                getWidth(rowIndicatorElWidth.value, gridReactiveData.colConfs.length, renderDefaultColWidth.value, gridReactiveData.columnWidthsChanged, gridReactiveData.columnHidesChanged) + gridReactiveData.scrollbarWidth
            }px`

            console.log({'refGridBodyLeftFixedXLineDiv.value.style.width': refGridBodyLeftFixedXLineDiv.value.style.width})
            refGridBodyLeftFixedYLineDiv.value.style.height = `${getHeight(gridReactiveData.rowConfs.length, renderDefaultRowHeight.value, gridReactiveData.rowHeightsChanged, gridReactiveData.rowHidesChanged)}px`
            refGridBodyXLineDiv.value.style.width = refGridBodyLeftFixedXLineDiv.value.style.width
            refGridBodyYLineDiv.value.style.height = refGridBodyLeftFixedYLineDiv.value.style.height
            refGridBodyLeftFixedTableWrapperDiv.value.style.top = `${gridReactiveData.gridHeaderHeight}px`
            if (refGridBodyTable.value) {
                refGridBodyTable.value.style.width = `${gridReactiveData.gridWidth}px`
                refGridBodyLeftFixedTable.value.style.width = `${gridReactiveData.gridWidth}px`
            }
            if (refGridHeaderTable.value) {
                refGridHeaderTable.value.style.width = `${gridReactiveData.gridWidth + gridReactiveData.scrollbarWidth}px`
            }
        }

        const reset = (): Promise<void> => {
            return new Promise(resolve => {
                gridReactiveData.colConfs = []
                gridReactiveData.rowConfs = []
                gridReactiveData.currentSheetData = []
                resolve()
            })
        }

        const loadData = (): Promise<void> => {
            return new Promise(resolve => {
                gridReactiveData.xDim = props.minDims[0] + 1
                gridReactiveData.yDim = props.minDims[1]

                if (props.data) {
                    if (props.data.type === 'map') {
                        console.log(props.data.mapData)
                        if (props.data.mapData && props.data.mapData.data && props.data.mapData.data.length > 0) {
                            props.data.mapData.data.forEach((item: any) => {
                                if (item.p) {
                                    const x = getColumnCount(item.p.replace(/[0-9]/g, '')) + 1
                                    if (x > gridReactiveData.xDim) {
                                        gridReactiveData.xDim = x
                                    }
                                    const y = parseInt(item.p.replace(/[^0-9]/ig, ''))
                                    if (y > gridReactiveData.yDim) {
                                        gridReactiveData.yDim = y
                                    }
                                }
                            })
                        }
                        console.log(gridReactiveData.xDim, gridReactiveData.yDim)
                        gridReactiveData.xStart = -1
                        gridReactiveData.xEnd = gridReactiveData.xDim - 1
                        gridReactiveData.yStart = 0
                        gridReactiveData.yEnd = gridReactiveData.yDim - 1
                    } else {
                        if (props.data.arrayData && props.data.arrayData.length > 0) {
                            if (props.data.arrayData.length + 1 > gridReactiveData.yDim) {
                                gridReactiveData.yDim = props.data.arrayData.length + 1
                            }
                            props.data.arrayData.forEach((item: any) => {
                                if (item.length > gridReactiveData.xDim) {
                                    gridReactiveData.xDim = item.length
                                }
                            })
                        }
                        console.log(gridReactiveData.xDim, gridReactiveData.yDim)
                        gridReactiveData.xStart = -1
                        gridReactiveData.xEnd = gridReactiveData.xDim - 1
                        gridReactiveData.yStart = 0
                        gridReactiveData.yEnd = gridReactiveData.yDim - 1
                    }

                    const columns = [...Array<Record<string, unknown>>(gridReactiveData.xDim.valueOf() + 1)]
                    columns.forEach((_, index) => {
                        gridReactiveData.colConfs.push(new Column(index - 1, 'default', true))
                    })

                    const rows = [...Array<Record<string, unknown>>(gridReactiveData.yDim.valueOf())]
                    rows.forEach((_, index) => {
                        gridReactiveData.rowConfs.push(new Row(index, 'default', true))
                    })


                    gridReactiveData.currentSheetData = new Array(rows.length).fill(null).map(() => new Array(columns.length).fill(null))


                    gridReactiveData.currentSheetData.forEach((row, rowIndex) => {
                        row.forEach((_, colIndex) => {
                            let cellData = null
                            if (props.data) {
                                if (props.data.type === 'map') {
                                    if (props.data.mapData && props.data.mapData.data && props.data.mapData.data.length > 0) {
                                        cellData = props.data.mapData.data.find((d: any) => getColumnCount(d.p.replace(/[0-9]/g, '')) === colIndex && parseInt(d.p.replace(/[^0-9]/ig, '')) === rowIndex + 1)
                                    }
                                } else {
                                    if (props.data.arrayData && props.data.arrayData.length > 0 && rowIndex + 1 <= props.data.arrayData.length && colIndex <= props.data.arrayData[rowIndex].length) {
                                        cellData = props.data.arrayData[rowIndex][colIndex]
                                    }
                                }
                            }
                            gridReactiveData.currentSheetData[rowIndex][colIndex] = new Cell(rowIndex, colIndex - 1, 1, 1,
                                props.data && props.data.type === 'map' ? (cellData && cellData.v ? cellData.v : null) : isObject(cellData) ? (cellData && cellData.v ? cellData.v : null) : cellData,
                                null
                            )
                        })
                    })

                    console.log(
                        {'gridReactiveData.colConfs': gridReactiveData.colConfs},
                        {'gridReactiveData.rowConfs': gridReactiveData.rowConfs},
                        {'gridReactiveData.currentSheetData': gridReactiveData.currentSheetData}
                    )
                }

                resolve()
            })
        }

        const $vmaFormulaGrid = {
            uId: Guid.create().toString(),
            props,
            context,
            reactiveData: gridReactiveData,
            getRefs: () => gridRefs,
            renderVN: renderVN,
        } as unknown as VmaFormulaGridConstructor & VmaFormulaGridMethods & VmaFormulaGridPrivateMethods

        Object.assign($vmaFormulaGrid, gridMethods)
        Object.assign($vmaFormulaGrid, gridPrivateMethods)

        provide('$vmaFormulaGrid', $vmaFormulaGrid)

        return $vmaFormulaGrid
    },
    render() {
        return this.renderVN()
    },
})