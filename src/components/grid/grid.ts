import {
    ComponentOptions,
    computed,
    createCommentVNode,
    defineComponent,
    h,
    nextTick, onBeforeUnmount,
    onMounted, onUnmounted,
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
    VmaFormulaGridEmits,
    VmaFormulaGridMethods,
    VmaFormulaGridPrivateMethods,
    VmaFormulaGridPropTypes,
    VmaFormulaGridReactiveData,
    VmaFormulaGridRefs
} from "../../types";
import {Guid} from "../../utils/guid.ts";
import {
    calcVertexes, checkCellInMerges,
    filterVertexes,
    getColumnCount,
    getHeight,
    getIndexFromColumnWidths,
    getIndexFromRowHeights,
    getRealVisibleHeightSize,
    getRealVisibleWidthSize,
    getRenderDefaultColWidth,
    getRenderDefaultRowHeight,
    getRenderRowIndicatorWidth, getRowColSpanFromMerges,
    getWidth,
    getXSpaceFromColumnWidths,
    getYSpaceFromRowHeights,
    isNumeric,
    isObject
} from "../../utils";
import {Column} from "./internals/column.ts";
import {Row} from "./internals/row.ts";
import {Cell} from "./internals/cell.ts";
import {debounce} from "../../utils/debounce.ts";
import {createResizeEvent} from "../../utils/resize.ts";
import {DepParser, FormulaParser} from "../../formula";
import GlobalEvent from "../../utils/events.ts";
import VmaFormulaGrid from "../../vma-formula-grid";
import {DomTools} from "../../utils/doms.ts";

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

        let resizeObserver: ResizeObserver

        onMounted(() => {
            loadData().then(() => {
                $vmaFormulaGrid
                    .recalculate(true)
                    .then(() => {
                        const el = refGridDiv.value
                        const parentEl = $vmaFormulaGrid.getParentElem()
                        resizeObserver = createResizeEvent(() => {
                            $vmaFormulaGrid.recalculate(true)
                        })
                        if (el) {
                            resizeObserver.observe(el)
                        }
                        if (parentEl) {
                            resizeObserver.observe(parentEl)
                        }
                        GlobalEvent.on(
                            $vmaFormulaGrid,
                            'mousewheel',
                            handleGlobalMousewheelEvent,
                        )
                        GlobalEvent.on(
                            $vmaFormulaGrid,
                            'mousedown',
                            handleGlobalMousedownEvent,
                        )
                        GlobalEvent.on($vmaFormulaGrid, 'keydown', handleGlobalKeydownEvent)
                        if ($vmaFormulaGrid.handleContextmenuEvent) {
                            GlobalEvent.on(
                                $vmaFormulaGrid,
                                'contextmenu',
                                $vmaFormulaGrid.handleContextmenuEvent,
                            )
                        }
                        GlobalEvent.on($vmaFormulaGrid, 'resize', handleGlobalResizeEvent)
                    }).finally(() => {
                    $vmaFormulaGrid.calc()
                })
            })
        })

        onBeforeUnmount(() => {
            if (resizeObserver) {
                resizeObserver.disconnect()
            }
            if ($vmaFormulaGrid.closeMenu) {
                $vmaFormulaGrid.closeMenu()
            }
        })

        onUnmounted(() => {
            GlobalEvent.off($vmaFormulaGrid, 'mousedown')
            GlobalEvent.off($vmaFormulaGrid, 'mousewheel')
            GlobalEvent.off($vmaFormulaGrid, 'keydown')
            GlobalEvent.off($vmaFormulaGrid, 'resize')
            GlobalEvent.off($vmaFormulaGrid, 'contextmenu')
        })

        watch(() => props.data, () => {
            reset().then(() => {
                loadData().then(() => {
                    $vmaFormulaGrid
                        .recalculate(true)
                        .then(() => {
                            const el = refGridDiv.value
                            const parentEl = $vmaFormulaGrid.getParentElem()
                            resizeObserver = createResizeEvent(() => {
                                $vmaFormulaGrid.recalculate(true)
                            })
                            if (el) {
                                resizeObserver.observe(el)
                            }
                            if (parentEl) {
                                resizeObserver.observe(parentEl)
                            }
                            GlobalEvent.on(
                                $vmaFormulaGrid,
                                'mousewheel',
                                handleGlobalMousewheelEvent,
                            )
                            GlobalEvent.on(
                                $vmaFormulaGrid,
                                'mousedown',
                                handleGlobalMousedownEvent,
                            )
                            GlobalEvent.on($vmaFormulaGrid, 'keydown', handleGlobalKeydownEvent)
                            if ($vmaFormulaGrid.handleContextmenuEvent) {
                                GlobalEvent.on(
                                    $vmaFormulaGrid,
                                    'contextmenu',
                                    $vmaFormulaGrid.handleContextmenuEvent,
                                )
                            }
                            GlobalEvent.on($vmaFormulaGrid, 'resize', handleGlobalResizeEvent)
                        })
                        .finally(() => {$vmaFormulaGrid.calc()})
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

        const refGridContextMenu = ref() as Ref<HTMLDivElement>

        const renderDefaultColWidth = computed(() => getRenderDefaultColWidth(props.defaultColumnWidth, props.size))

        const renderDefaultRowHeight = computed(() => getRenderDefaultRowHeight(props.defaultRowHeight, props.size))

        const rowIndicatorElWidth = computed(
            () => Math.max(getRenderRowIndicatorWidth(props.size) + gridReactiveData.yEnd.toString().length * getRenderRowIndicatorWidth(props.size), 54)
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
            lastScrollLeftTime: 0,
            lastScrollXVisibleIndex: 0,
            lastScrollTop: 0,
            lastScrollTopTime: 0,
            lastScrollYVisibleIndex: 0,
            cells: {
                eMap: {},
                cMap: {},
                ncMap: {},
            },
            merges: {},
            ctxMenuStore: {
                selected: null,
                visible: false,
                showChild: false,
                selectChild: null,
                list: [],
                style: null,
            },
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
            rowIndicatorElWidth,

            refGridContextMenu
        }

        const gridMethods = {
            calc: () => {
                const calcCells: Cell[] = []
                gridReactiveData.cells = {
                    eMap: {},
                    cMap: {},
                    ncMap: {},
                }
                const position = {
                    row: 1,
                    col: 1,
                    sheet: 'calc',
                }
                const depParser = new DepParser({})
                const errorKeyList: any = []

                gridReactiveData.currentSheetData.forEach((row: any[]) => {
                    row.forEach((item: Cell) => {
                        let isFormulaCell = false
                        let isFormulaCellDepParseError = true
                        let se = null
                        let formulaCellDepParseResult = null
                        if (item && item.v && typeof item.v === 'string' && item.v.trim().startsWith('=')) {
                            isFormulaCell = true
                            se = '#DEPPARSEERROR!'
                            try {
                                formulaCellDepParseResult = depParser.parse(item.v.trim().substring(1), position)
                                isFormulaCellDepParseError = false
                                se = null
                            } catch (e) {
                                console.error(`parse error: ${item.col!}_${item.row}`)
                            }
                            if (isFormulaCellDepParseError) {
                                errorKeyList.push(`${item.col}_${item.row}`)
                            }
                            // 检查是否有引用错误（例如，超出范围的单元格引用，是否引用了merge块中的cell）
                            if (formulaCellDepParseResult !== null) {
                                const errorRefCell = formulaCellDepParseResult.find(
                                    (i: any) => {
                                        return i.row > gridReactiveData.rowConfs.length || i.col > gridReactiveData.colConfs.length
                                        || checkCellInMerges(i.col, i.row, gridReactiveData.merges)
                                    }
                                )
                                if (errorRefCell) {
                                    se = '#REFERROR!'
                                    errorKeyList.push(`${item.col + 1}_${item.row + 1}`)
                                    isFormulaCellDepParseError = true
                                    formulaCellDepParseResult = null
                                }
                            }
                            item.mv = isFormulaCell ? (isFormulaCellDepParseError ? se : null) : item && item.v ? item.v : null
                            item.fd = isFormulaCell ? (isFormulaCellDepParseError ? null : formulaCellDepParseResult) : null
                            item.se = se
                            calcCells.push(item)
                        } else {
                            item.mv = item.v
                        }
                    })

                })

                const vertexes: Record<string, any> = {}
                calcCells.forEach(item => {
                    if (errorKeyList.indexOf(`${item.col + 1}_${item.row + 1}`) >= 0) {
                        gridReactiveData.cells.eMap[`${item.col + 1}_${item.row +1}`] = {
                            c: item.col + 1,
                            r: item.row + 1,
                            children: [],
                            ref: item,
                        }
                    } else {
                        vertexes[`${item.col + 1}_${item.row + 1}`] = {
                            c: item.col + 1,
                            r: item.row + 1,
                            children: [],
                            ref: item,
                        }
                        if (item.fd && item.fd.length > 0) {
                            item.fd.forEach((fdItem: any) => {
                                if (fdItem.hasOwnProperty('from') || fdItem.hasOwnProperty('to')) {
                                    for (let r = fdItem.from.row; r <= fdItem.to.row; r++) {
                                        for (let c = fdItem.from.col; c <= fdItem.to.col; c++) {
                                            if (!vertexes.hasOwnProperty(`${c}_${r}`)) {
                                                if (errorKeyList.indexOf(`${c}_${r}`) < 0) {
                                                    vertexes[`${c}_${r}`] = {
                                                        c: c,
                                                        r: r,
                                                        children: [],
                                                        ref: gridReactiveData.currentSheetData[r - 1][c],
                                                    }
                                                }
                                            }
                                            if (vertexes[`${item.col + 1}_${item.row + 1}`].children.indexOf(`${c}_${r}`) < 0) {
                                                vertexes[`${item.col + 1}_${item.row + 1}`].children.push(`${c}_${r}`)
                                            }
                                        }
                                    }
                                } else {
                                    if (!vertexes.hasOwnProperty(`${fdItem.col}_${fdItem.row}`)) {
                                        if (errorKeyList.indexOf(`${fdItem.col}_${fdItem.row}`) < 0) {
                                            vertexes[`${fdItem.col}_${fdItem.row}`] = {
                                                c: fdItem.col,
                                                r: fdItem.row,
                                                children: [],
                                                ref: gridReactiveData.currentSheetData[fdItem.row - 1][fdItem.col],
                                            }
                                        }
                                    }
                                    if (vertexes[`${item.col + 1}_${item.row + 1}`].children.indexOf(`${fdItem.col}_${fdItem.row}`) < 0) {
                                        vertexes[`${item.col + 1}_${item.row + 1}`].children.push(`${fdItem.col}_${fdItem.row}`)
                                    }
                                }
                            })
                        }
                    }
                })

                const { noErrorVertexes } = filterVertexes(vertexes, gridReactiveData.cells.eMap)

                const errorMapKeys = Object.keys(gridReactiveData.cells.eMap)
                if (errorMapKeys.length > 0) {
                    for (let i = 0; i < errorMapKeys.length; i++) {
                        if (gridReactiveData.cells.eMap[errorMapKeys[i]].ref.se !== null) {
                            gridReactiveData.cells.eMap[errorMapKeys[i]].ref.mv = gridReactiveData.cells.eMap[errorMapKeys[i]].ref.se
                        } else {
                            gridReactiveData.cells.eMap[errorMapKeys[i]].ref.mv = '#REFERROR!'
                            gridReactiveData.cells.eMap[errorMapKeys[i]].ref.se = '#REFERROR!'
                        }
                    }
                }
                const { topological, noCycleVertexes, cycleVertexes } = calcVertexes(noErrorVertexes, {})

                gridReactiveData.cells.cMap = cycleVertexes
                gridReactiveData.cells.ncMap = noCycleVertexes

                const cycleVertexKeys = Object.keys(cycleVertexes)
                for (let i = 0; i < cycleVertexKeys.length; i++) {
                    cycleVertexes[cycleVertexKeys[i]].ref.mv = '#CYCLEERROR!'
                }

                const parser = new FormulaParser({
                    // functions: props.functions,
                    onCell: (ref: any) => gridReactiveData.currentSheetData[ref.row - 1][ref.col].mv,
                    onRange: (ref: any) => {
                        const arr = []
                        for (let row = ref.from.row; row <= ref.to.row; row++) {
                            const innerArr = []
                            for (let col = ref.from.col; col <= ref.to.col; col++) {
                                innerArr.push(
                                    checkCellInMerges(col, row - 1, gridReactiveData.merges) ?
                                        null :
                                        gridReactiveData.currentSheetData[row - 1][col].mv
                                )
                            }
                            arr.push(innerArr)
                        }
                        return arr
                    },
                })
                for (let i = 0; i < topological.length; i++) {
                    if (
                        noCycleVertexes[topological[i]] &&
                        noCycleVertexes[topological[i]].ref &&
                        noCycleVertexes[topological[i]].ref.v &&
                        typeof noCycleVertexes[topological[i]].ref.v === 'string' &&
                        noCycleVertexes[topological[i]].ref.v.trim().startsWith('=')
                    ) {
                        let isParseError = true
                        try {
                            let result = parser.parse(noCycleVertexes[topological[i]].ref.v.trim().substring(1), { row: 1, col: 1 })
                            if (result && result.result) {
                                result = result.result
                            }
                            if (typeof result === 'number' || typeof result === 'string') {
                                noCycleVertexes[topological[i]].ref.mv = result
                            } else {
                                noCycleVertexes[topological[i]].ref.mv = `${result}`
                            }
                            isParseError = false
                        } catch (e) {
                            console.error(topological[i], e)
                        }
                        if (isParseError) {
                            noCycleVertexes[topological[i]].ref.mv = '#ERROR!'
                            noCycleVertexes[topological[i]].ref.se = '#ERROR!'
                        }
                    }
                }
            },
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
            getParentElem() {
                const el = refGridDiv.value
                if ($vmaFormulaGrid) {
                    const gridEl = $vmaFormulaGrid.getRefs().refGridDiv.value
                    return gridEl ? (gridEl.parentNode as HTMLElement) : null
                }
                return el ? (el.parentNode as HTMLElement) : null
            },
            triggerScrollXEvent: (event: Event) => {
                const scrollBodyElem = (event.currentTarget || event.target) as HTMLDivElement
                debounceScrollX(scrollBodyElem)
            },
            triggerScrollYEvent: (event: Event) => {
                const scrollBodyElem = (event.currentTarget || event.target) as HTMLDivElement
                debounceScrollY(scrollBodyElem)
            },
            insertColumn: (col: number) => {
                updateConfs('insertColumn', col, null)
                gridReactiveData.colConfs.map((item: Column) => {
                    if (item.index >= col) {
                        item.index += 1
                    }
                    return item
                })
                let colVisible = true
                if (gridReactiveData.columnHidesChanged.hasOwnProperty((col + 1).toString())) {
                    colVisible = false
                    gridReactiveData.columnHidesChanged[col.toString()] = 0
                }
                gridReactiveData.colConfs.splice(
                    col + 1,
                    0,
                    new Column(Number(col), 'default', colVisible,),
                )
                gridReactiveData.currentSheetData.map(
                    (row: Cell[], index: number) => {
                        row.map((cell: Cell) => {
                            if (cell.colSpan && cell.colSpan > 1 && cell.col < col && cell.col + cell.colSpan >= col) {
                                cell.colSpan += 1
                            }
                            if (cell.col >= col) {
                                cell.col += 1
                            }
                            return null
                        })
                        row.splice(
                            col + 1,
                            0,
                            new Cell(index, col, 1, 1, null, null, null, null, false, -1,) as Cell & { [key: string]: string },
                        )
                        return null
                    },
                )

            },
            updateColVisible: (type: string, colStart: number, colEnd: number) => {
                if (type === 'showForwardCols') {
                    if (Object.keys(gridReactiveData.columnHidesChanged).length) {
                        if (colStart === colEnd) {
                            let idx = 0
                            const removeKeys: string[] = []
                            while (
                                gridReactiveData.columnHidesChanged.hasOwnProperty(
                                    `${Number(colStart) - idx}`
                                )
                                ) {
                                gridReactiveData.colConfs[Number(colStart) - idx].visible = true
                                removeKeys.push(`${Number(colStart) - idx}`)
                                idx++
                            }
                            const gridColumnsVisibleChangedNew: Record<string, number> = {}
                            Object.keys(gridReactiveData.columnHidesChanged).map(
                                (key) => {
                                    if (removeKeys.indexOf(key) < 0) {
                                        gridColumnsVisibleChangedNew[key] =
                                            gridReactiveData.columnHidesChanged[key]
                                    }
                                    return null
                                }
                            )
                            gridReactiveData.columnHidesChanged =
                                gridColumnsVisibleChangedNew
                        }
                        $vmaFormulaGrid.recalculate(false).then(() => {
                        })
                    }
                }
                if (type === 'showBackwardCols') {
                    if (Object.keys(gridReactiveData.columnHidesChanged).length) {
                        if (colStart === colEnd) {
                            let idx = 2
                            const removeKeys: string[] = []
                            while (
                                gridReactiveData.columnHidesChanged.hasOwnProperty(
                                    `${Number(colStart) + idx}`
                                )
                                ) {
                                gridReactiveData.colConfs[Number(colStart) + idx].visible = true
                                removeKeys.push(`${Number(colStart) + idx}`)
                                idx++
                            }
                            const gridColumnsVisibleChangedNew: Record<string, number> = {}
                            Object.keys(gridReactiveData.columnHidesChanged).map(
                                (key) => {
                                    if (removeKeys.indexOf(key) < 0) {
                                        gridColumnsVisibleChangedNew[key] =
                                            gridReactiveData.columnHidesChanged[key]
                                    }
                                    return null
                                }
                            )
                            gridReactiveData.columnHidesChanged =
                                gridColumnsVisibleChangedNew
                        }
                        $vmaFormulaGrid.recalculate(false).then(() => {
                        })
                    }
                }
            },
            updateRowVisible: (type: string, rowStart: number, rowEnd: number) => {
                if (type === 'showUpRows') {
                    if (Object.keys(gridReactiveData.rowHidesChanged).length) {
                        if (rowStart === rowEnd) {
                            let idx = 0
                            const removeKeys: string[] = []
                            while (
                                gridReactiveData.rowHidesChanged.hasOwnProperty(
                                    `${Number(rowStart) - idx}`
                                )
                                ) {
                                gridReactiveData.rowConfs[Number(rowStart) - idx - 1].visible = true
                                removeKeys.push(`${Number(rowStart) - idx}`)
                                idx++
                            }
                            const gridRowsVisibleChangedNew: Record<string, number> = {}
                            Object.keys(gridReactiveData.rowHidesChanged).map((key) => {
                                if (removeKeys.indexOf(key) < 0) {
                                    gridRowsVisibleChangedNew[key] =
                                        gridReactiveData.rowHidesChanged[key]
                                }
                                return null
                            })
                            gridReactiveData.rowHidesChanged = gridRowsVisibleChangedNew
                        }
                        $vmaFormulaGrid.recalculate(false).then(() => {
                        })
                    }
                }
                if (type === 'showDownRows') {
                    if (Object.keys(gridReactiveData.rowHidesChanged).length) {
                        if (rowStart === rowEnd) {
                            let idx = 2
                            const removeKeys: string[] = []
                            while (
                                gridReactiveData.rowHidesChanged.hasOwnProperty(
                                    `${Number(rowStart) + idx}`
                                )
                                ) {
                                gridReactiveData.rowConfs[Number(rowStart) + idx - 1].visible = true
                                removeKeys.push(`${Number(rowStart) + idx}`)
                                idx++
                            }
                            const gridRowsVisibleChangedNew: Record<string, number> = {}
                            Object.keys(gridReactiveData.rowHidesChanged).map((key) => {
                                if (removeKeys.indexOf(key) < 0) {
                                    gridRowsVisibleChangedNew[key] =
                                        gridReactiveData.rowHidesChanged[key]
                                }
                                return null
                            })
                            gridReactiveData.rowHidesChanged = gridRowsVisibleChangedNew
                        }
                        $vmaFormulaGrid.recalculate(false).then(() => {
                        })
                    }
                }
            },
        } as VmaFormulaGridPrivateMethods

        const updateConfs = (type: string, col: number | null, row: number | null) : void => {
            console.log(type, col, row)
            if (type === 'insertColumn') {
                const gridColumnsVisibleChangedNew: Record<string, number> = {}
                Object.keys(gridReactiveData.columnHidesChanged).map((key) => {
                    if (Number(key) >= col!) {
                        const newKey = Number(key) + 1
                        gridColumnsVisibleChangedNew[newKey] =
                            gridReactiveData.columnHidesChanged[key]
                    } else {
                        gridColumnsVisibleChangedNew[key] =
                            gridReactiveData.columnHidesChanged[key]
                    }
                    return null
                })
                gridReactiveData.columnHidesChanged =
                    gridColumnsVisibleChangedNew

                const gridColumnsWidthChangedNew: Record<string, number> = {}
                Object.keys(gridReactiveData.columnWidthsChanged).map((key) => {
                    if (Number(key) >= col!) {
                        const newKey = Number(key) + 1
                        gridColumnsWidthChangedNew[newKey] =
                            gridReactiveData.columnWidthsChanged[key]
                    } else {
                        gridColumnsWidthChangedNew[key] =
                            gridReactiveData.columnWidthsChanged[key]
                    }
                    return null
                })
                gridReactiveData.columnWidthsChanged = gridColumnsWidthChangedNew

                const mergesNew: Record<string, any> = {}
                Object.keys(gridReactiveData.merges).map((key) => {
                    const crArr = key.split(':')
                    const crStartArr = crArr[0].split('_')
                    const crEndArr = crArr[1].split('_')
                    if (Number(crStartArr[0]) > col!) {
                        crStartArr[0] = (Number(crStartArr[0]) + 1).toString()
                        crEndArr[0] = (Number(crEndArr[0]) + 1).toString()
                    } else if (Number(crStartArr[0]) <= col! && col! < Number(crEndArr[0])) {
                        crEndArr[0] = (Number(crEndArr[0]) + 1).toString()
                    }
                    mergesNew[`${crStartArr.join('_') + ':' + crEndArr.join('_')}`] = {
                            colStart: Number(crStartArr[0]),
                            colEnd: Number(crEndArr[0]),
                            colSpan: Number(crEndArr[0]) - Number(crStartArr[0]) + 1,
                            rowStart: Number(crStartArr[1]),
                            rowEnd: Number(crEndArr[1]),
                            rowSpan: Number(crEndArr[1]) - Number(crStartArr[1]) + 1
                        }
                })
                gridReactiveData.merges = mergesNew
            }
            $vmaFormulaGrid
                .recalculate(true)
                .then(() => {
                    $vmaFormulaGrid.calc()
                })
        }

        const debounceScrollX = debounce((scrollBodyElem: HTMLDivElement) => {
            calcScrollSizeX(scrollBodyElem).then(() => {
                updateStyle()
            })
        }, 50)

        const debounceScrollY = debounce((scrollBodyElem: HTMLDivElement) => {
            calcScrollSizeY(scrollBodyElem).then(() => {
                updateStyle()
            })
        }, 50)



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
                h(resolveComponent('VmaFormulaGridCompContextMenu') as ComponentOptions, {
                    ref: refGridContextMenu,
                }),
                // header left fixed
                h(FormulaGridHeaderComponent, {
                    'data-uid': $vmaFormulaGrid.uId,
                    fixed: 'left',
                    class: ['left'],
                    style: {
                        height: `${gridReactiveData.gridHeaderHeight}px`,
                        width: `${gridReactiveData.gridLeftFixedHeaderWidth}px`,
                    },
                }),
                // header center
                h(FormulaGridHeaderComponent, {
                    'data-uid': $vmaFormulaGrid.uId,
                    fixed: 'center',
                    class: ['center'],
                    style: {
                        height: `${gridReactiveData.gridHeaderHeight}px`,
                        width: `${gridReactiveData.gridHeaderWidth}px`,
                    },
                }),
                // body left fixed
                h(FormulaGridBodyComponent, {
                    'data-uid': $vmaFormulaGrid.uId,
                    fixed: 'left',
                    class: ['left'],
                }),
                // body center
                h(FormulaGridBodyComponent, {
                    'data-uid': $vmaFormulaGrid.uId,
                    fixed: 'center',
                    class: ['center'],
                    style: {
                        height: `${gridReactiveData.gridBodyHeight}px`,
                    },
                })
            ])
        }

        const handleGlobalResizeEvent = () => {
            if ($vmaFormulaGrid.closeMenu) {
                $vmaFormulaGrid.closeMenu()
            }
            $vmaFormulaGrid.recalculate(false)
        }

        const handleGlobalMousewheelEvent = (event: MouseEvent) => {
            if ($vmaFormulaGrid.closeMenu) {
                const { ctxMenuStore } = gridReactiveData
                const ctxMenu = refGridContextMenu.value
                if (
                    ctxMenuStore.visible &&
                    ctxMenu &&
                    !DomTools.getEventTargetNode(event, ctxMenu).flag
                ) {
                    $vmaFormulaGrid.closeMenu()
                }
            }
        }

        const handleGlobalMousedownEvent = (event: MouseEvent) => {
            if ($vmaFormulaGrid.closeMenu) {
                const { ctxMenuStore } = gridReactiveData
                const ctxMenu = refGridContextMenu.value
                if (
                    ctxMenuStore.visible &&
                    ctxMenu &&
                    !DomTools.getEventTargetNode(event, ctxMenu).flag
                ) {
                    $vmaFormulaGrid.closeMenu()
                }
            }
        }

        const handleGlobalKeydownEvent = (event: KeyboardEvent) => {
            if ($vmaFormulaGrid.closeMenu) {
                const { ctxMenuStore } = gridReactiveData
                const ctxMenu = refGridContextMenu.value
                if (
                    ctxMenuStore.visible &&
                    ctxMenu &&
                    !DomTools.getEventTargetNode(event, ctxMenu).flag
                ) {
                    $vmaFormulaGrid.closeMenu()
                }
            }
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
                if (!scrollBodyElem) {
                    resolve()
                }
                const scrollLeft = scrollBodyElem.scrollLeft
                const visibleIndex = getIndexFromColumnWidths(scrollLeft, renderDefaultColWidth.value, gridReactiveData.columnWidthsChanged, gridReactiveData.columnHidesChanged)
                const viewportWidth = refGridBodyTableWrapperDiv.value.clientWidth
                const visibleSize = Math.max(
                    Math.ceil(viewportWidth / renderDefaultColWidth.value),
                    getRealVisibleWidthSize(viewportWidth, visibleIndex, renderDefaultColWidth.value, gridReactiveData.columnWidthsChanged, gridReactiveData.columnHidesChanged)
                )

                const offsetItem = {
                    startColIndex: Math.max(0, visibleIndex - 20),
                    endColIndex: Math.min(visibleIndex + visibleSize + 20, gridReactiveData.colConfs.length)
                }

                const { startColIndex: offsetStartColIndex, endColIndex: offsetEndColIndex } = offsetItem

                if (gridReactiveData.lastScrollXVisibleIndex === 0) {
                    gridReactiveData.xStart = offsetStartColIndex
                    gridReactiveData.xEnd = offsetEndColIndex
                }

                if (Math.abs(offsetEndColIndex - visibleIndex - visibleSize) / 2 > 5 || Math.abs(visibleIndex - offsetStartColIndex) / 2 > 5) {
                    gridReactiveData.xStart = offsetStartColIndex
                    gridReactiveData.xEnd = offsetEndColIndex
                    gridReactiveData.lastScrollXVisibleIndex = visibleIndex
                    updateScrollXYSpace()
                }

                resolve()
            })

        const calcScrollSizeY = (scrollBodyElem: HTMLDivElement): Promise<void> =>
            new Promise((resolve): void => {
                if (!scrollBodyElem) {
                    resolve()
                }
                const scrollTop = scrollBodyElem.scrollTop
                const visibleIndex = getIndexFromRowHeights(scrollTop, renderDefaultRowHeight.value, gridReactiveData.rowHeightsChanged, gridReactiveData.rowHidesChanged)
                const viewportHeight = refGridBodyTableWrapperDiv.value.clientHeight
                const visibleSize = Math.max(
                    Math.ceil(viewportHeight / renderDefaultRowHeight.value),
                    getRealVisibleHeightSize(viewportHeight, visibleIndex, renderDefaultRowHeight.value, gridReactiveData.rowHeightsChanged, gridReactiveData.rowHidesChanged)
                )

                const offsetItem = {
                    startIndex: Math.max(0, visibleIndex - 20),
                    endIndex: Math.min(visibleIndex + visibleSize + 20, gridReactiveData.rowConfs.length - 1)
                }

                const { startIndex: offsetStartIndex, endIndex: offsetEndIndex } = offsetItem

                if (gridReactiveData.lastScrollYVisibleIndex === 0) {
                    gridReactiveData.yStart = offsetStartIndex
                    gridReactiveData.yEnd = offsetEndIndex
                }

                if (Math.abs(offsetEndIndex - visibleIndex - visibleSize) / 2 > 5 || Math.abs(visibleIndex - offsetStartIndex) / 2 > 5) {
                    gridReactiveData.yStart = offsetStartIndex
                    gridReactiveData.yEnd = offsetEndIndex
                    gridReactiveData.lastScrollYVisibleIndex = visibleIndex
                    updateScrollXYSpace()
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

            if (gridReactiveData.xStart !== -1) {
                firstList.push(gridReactiveData.colConfs[0])
            }

            for (let index = gridReactiveData.xStart; index <= gridReactiveData.xEnd; index++) {
                if (index >= gridReactiveData.colConfs.length - 1) {
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

            nextTick(() => {
                calcColumnWidth()
            })
        }

        const calcColumnWidth = () => {
            let gridWidth = 0

            const { firstList, otherList } = gridReactiveData.columns
            firstList.forEach((column: any) => {
                gridWidth += rowIndicatorElWidth.value
                column.width = rowIndicatorElWidth.value
            })
            otherList.forEach((column: any) => {
                gridWidth += column.visible ? (typeof column.width === 'string' ? renderDefaultColWidth.value : column.width) : 0
            })

            gridReactiveData.gridWidth = gridWidth

            nextTick(() => {
                updateStyle()
            })
        }

        const updateStyle = () => {
            if (refGridDiv.value === null || refGridDiv.value === undefined) {
                return
            }
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

            gridReactiveData.gridBodyWidth = gridReactiveData.gridWidth
            gridReactiveData.gridBodyHeight = gridReactiveData.gridHeight - gridReactiveData.gridHeaderHeight
            gridReactiveData.isOverflowX = bodyOffsetWidth > bodyClientWidth
            gridReactiveData.isOverflowY = bodyOffsetHeight > bodyClientHeight

            gridReactiveData.scrollbarWidth = Math.max(bodyOffsetWidth - bodyClientWidth, 0)
            gridReactiveData.scrollbarHeight = Math.max(bodyOffsetHeight - bodyClientHeight, 0)

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
                        gridReactiveData.xStart = -1
                        gridReactiveData.xEnd = gridReactiveData.xDim - 1
                        gridReactiveData.yStart = 0
                        gridReactiveData.yEnd = gridReactiveData.yDim - 1
                    }

                    if (props.data.hasOwnProperty('conf') && props.data.conf.hasOwnProperty('merges') && props.data.conf.merges.length > 0) {
                        props.data.conf.merges.forEach((item: any) => {
                            const mArr = item.split(':')

                            let colStart = getColumnCount(mArr[0].replace(/[0-9]/g, ''))
                            let colEnd = getColumnCount(mArr[1].replace(/[0-9]/g, ''))
                            let rowStart = parseInt(mArr[0].replace(/[^0-9]/ig, ''))
                            let rowEnd = parseInt(mArr[1].replace(/[^0-9]/ig, ''))

                            if (colStart !== colEnd || rowStart !== rowEnd) {
                                if (colStart > colEnd) {
                                    const t = colEnd
                                    colEnd = colStart
                                    colStart = t
                                }
                                if (rowStart > rowEnd) {
                                    const t = rowEnd
                                    rowEnd = rowStart
                                    rowStart = t
                                }
                                gridReactiveData.merges[`${colStart}_${rowStart}:${colEnd}_${rowEnd}`] = {
                                    colStart: colStart,
                                    colEnd: colEnd,
                                    colSpan: colEnd - colStart + 1,
                                    rowStart: rowStart,
                                    rowEnd: rowEnd,
                                    rowSpan: rowEnd - rowStart + 1
                                }
                            }
                        })
                    }

                    const columns = [...Array<Record<string, unknown>>(gridReactiveData.xDim.valueOf() + 1)]
                    columns.forEach((_, index) => {
                        let colWidth = null
                        let colVisible = true
                        if (props.data && props.data.hasOwnProperty('conf') && props.data.conf.hasOwnProperty('colWidth') && props.data.conf.colWidth.length) {
                            for (let i = 0; i < props.data.conf.colWidth.length; i++) {
                                if (getColumnCount(props.data.conf.colWidth[i].col) === index && isNumeric(props.data.conf.colWidth[i].width)) {
                                    colWidth = props.data.conf.colWidth[i].width
                                    gridReactiveData.columnWidthsChanged[`${index}`] = props.data.conf.colWidth[i].width
                                    break
                                }
                            }
                        }
                        if (props.data && props.data.hasOwnProperty('conf') && props.data.conf.hasOwnProperty('colHide') && props.data.conf.colHide.length) {
                            for (let i = 0; i < props.data.conf.colHide.length; i++) {
                                if (getColumnCount(props.data.conf.colHide[i]) === index) {
                                    colVisible = false
                                    gridReactiveData.columnHidesChanged[`${index}`] = 0
                                    break
                                }
                            }
                        }
                        gridReactiveData.colConfs.push(new Column(index - 1, colWidth || 'default', colVisible))
                    })

                    const rows = [...Array<Record<string, unknown>>(gridReactiveData.yDim.valueOf())]
                    rows.forEach((_, index) => {
                        let rowHeight = null
                        let rowVisible = true
                        if (props.data && props.data.hasOwnProperty('conf') && props.data.conf.hasOwnProperty('rowHeight') && props.data.conf.rowHeight.length) {
                            for (let i = 0; i < props.data.conf.rowHeight.length; i++) {
                                if (props.data.conf.rowHeight[i].row === index + 1 && isNumeric(props.data.conf.rowHeight[i].height)) {
                                    rowHeight = props.data.conf.rowHeight[i].height
                                    gridReactiveData.rowHeightsChanged[`${index + 1}`] = props.data.conf.rowHeight[i].height
                                    break
                                }
                            }
                        }
                        if (props.data && props.data.hasOwnProperty('conf') && props.data.conf.hasOwnProperty('rowHide') && props.data.conf.rowHide.length) {
                            for (let i = 0; i < props.data.conf.rowHide.length; i++) {
                                if (props.data.conf.rowHide[i] === index + 1) {
                                    rowVisible = false
                                    gridReactiveData.rowHidesChanged[`${index + 1}`] = 0
                                    break
                                }
                            }
                        }
                        gridReactiveData.rowConfs.push(new Row(index, rowHeight || 'default', rowVisible))
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
                                        cellData = props.data.arrayData[rowIndex][colIndex - 1]
                                    }
                                }
                            }
                            const {rowSpan, colSpan} = getRowColSpanFromMerges(colIndex, rowIndex + 1, gridReactiveData.merges)
                            gridReactiveData.currentSheetData[rowIndex][colIndex] = new Cell(
                                rowIndex,
                                colIndex - 1,
                                rowSpan,
                                colSpan,
                                props.data && props.data.type === 'map' ? (cellData && cellData.v ? cellData.v : null) : isObject(cellData) ? (cellData && cellData.v ? cellData.v : null) : cellData,
                                null,
                                null,
                                null,
                                false,
                                -1,
                            )
                        })
                    })
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

        VmaFormulaGrid.hooks.forEach((options) => {
            if (options.setupGrid) {
                const hookRest = options.setupGrid($vmaFormulaGrid)
                if (hookRest && typeof hookRest === 'object') {
                    Object.assign($vmaFormulaGrid, hookRest)
                }
            }
        })

        provide('$vmaFormulaGrid', $vmaFormulaGrid)

        return $vmaFormulaGrid
    },
    render() {
        return this.renderVN()
    },
})