import {
    ComponentOptions,
    ComponentPublicInstance,
    computed,
    createCommentVNode,
    defineComponent,
    h,
    nextTick,
    onBeforeUnmount,
    onMounted,
    onUnmounted,
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
} from "../../../types";
import {Guid} from "../../utils/guid.ts";
import {
    calcCellBgType,
    calcCellBorders,
    calcCellStyles,
    calcVertexes,
    calcXOverlapMerges,
    calcYOverlapMerges,
    checkCellInMerges,
    filterVertexes,
    getColumnCount,
    getColumnSymbol,
    getHeight,
    getIndexFromColumnWidths,
    getIndexFromRowHeights,
    getRealArea,
    getRealVisibleHeightSize,
    getRealVisibleWidthSize,
    getRenderDefaultColWidth,
    getRenderDefaultRowHeight,
    getRenderRowIndicatorWidth,
    getRowColSpanFromMerges,
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
import VmaFormulaGrid from "../../v-m-a-formula-grid";
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
        functions: {
            type: Object as PropType<VmaFormulaGridPropTypes.CustomFunction>,
            default: null
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
        },
        virtualScrollX: {
            type: Boolean as PropType<VmaFormulaGridPropTypes.VirtualScrollX>,
            default: false
        },
        virtualScrollY: {
            type: Boolean as PropType<VmaFormulaGridPropTypes.VirtualScrollY>,
            default: false
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
                    })
                    .then(() => {
                        $vmaFormulaGrid.calc()
                    })
                    .then(() => {
                        $vmaFormulaGrid.calcCurrentCellEditorStyle()
                        $vmaFormulaGrid.calcCurrentCellEditorDisplay()
                        $vmaFormulaGrid.updateCurrentAreaStyle()
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
            $vmaFormulaGrid.recalculate(false).then(() => {
                $vmaFormulaGrid.calcCurrentCellEditorStyle()
                $vmaFormulaGrid.calcCurrentCellEditorDisplay()
                $vmaFormulaGrid.updateCurrentAreaStyle()
            })
        })

        watch(() => props.type, () => {
            $vmaFormulaGrid.recalculate(false)
        })

        watch(() => props.virtualScrollX, () => {
            $vmaFormulaGrid.recalculate(true)
        })

        watch(() => props.virtualScrollY, () => {
            $vmaFormulaGrid.recalculate(true)
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
        const refGridColorPicker = ref() as Ref<HTMLDivElement>

        const refCurrentCellEditor = ref() as Ref<ComponentPublicInstance>

        const refCurrentCellBorderTop = ref() as Ref<HTMLDivElement>
        const refCurrentCellBorderRight = ref() as Ref<HTMLDivElement>
        const refCurrentCellBorderBottom = ref() as Ref<HTMLDivElement>
        const refCurrentCellBorderLeft = ref() as Ref<HTMLDivElement>
        const refCurrentCellBorderCorner = ref() as Ref<HTMLDivElement>

        const refCurrentAreaBorderTop = ref() as Ref<HTMLDivElement>
        const refCurrentAreaBorderRight = ref() as Ref<HTMLDivElement>
        const refCurrentAreaBorderBottom = ref() as Ref<HTMLDivElement>
        const refCurrentAreaBorderLeft = ref() as Ref<HTMLDivElement>
        const refCurrentAreaBorderCorner = ref() as Ref<HTMLDivElement>

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
            currentSheetDataMap: {},
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
            colorPickerStore: {
                selected: null,
                visible: false,
                selectValue: null,
                style: null,
            },
            currentCell: null,
            currentCellBorderStyle: {
                transform: 'translateX(0) translateY(0)',
                left: 0,
                top: 0,
                width: 0,
                height: 0
            },
            currentCellEditorStyle: {
                transform: 'translateX(0) translateY(0)',
                display: 'none',
                left: 0,
                top: 0,
                width: 0,
                height: 0
            },
            currentCellEditorActive: false,
            currentCellEditorContent: null,
            currentAreaStatus: false,
            currentArea: {
                start: null,
                end: null
            },
            currentAreaBorderStyle: {
                transform: 'translateX(0) translateY(0)',
                left: 0,
                top: 0,
                width: 0,
                height: 0
            },
            styles: {
                bgc: [],
                fgc: []
            },
            borders: []
        }) as VmaFormulaGridReactiveData

        watch(
            () => gridReactiveData.currentCell,
            () => {
                $vmaFormulaGrid.calcCurrentCellEditorStyle()
            },
            {
                deep: true
            }
        )

        watch(
            () => gridReactiveData.currentCellEditorActive,
            () => {
                $vmaFormulaGrid.calcCurrentCellEditorDisplay()
            }
        )

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

            refGridContextMenu,
            refGridColorPicker,

            refCurrentCellEditor,

            refCurrentCellBorderTop,
            refCurrentCellBorderRight,
            refCurrentCellBorderBottom,
            refCurrentCellBorderLeft,
            refCurrentCellBorderCorner,

            refCurrentAreaBorderTop,
            refCurrentAreaBorderRight,
            refCurrentAreaBorderBottom,
            refCurrentAreaBorderLeft,
            refCurrentAreaBorderCorner,
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
                    functions: props.functions,
                    onCell: (ref: any) => checkCellInMerges(ref.col, ref.row, gridReactiveData.merges) ?
                                            null :
                                            gridReactiveData.currentSheetData[ref.row - 1][ref.col].mv,
                    onRange: (ref: any) => {
                        const arr = []
                        for (let row = ref.from.row; row <= ref.to.row; row++) {
                            const innerArr = []
                            for (let col = ref.from.col; col <= ref.to.col; col++) {
                                innerArr.push(
                                    checkCellInMerges(col, row, gridReactiveData.merges) ?
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
            },
            getCurrentGridData: () => {

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
            updateCellStyle: () => {

            },
            updateCurrentAreaStyle: () => {
                if ($vmaFormulaGrid.reactiveData.currentArea
                    && $vmaFormulaGrid.reactiveData.currentArea.start !== null
                    && $vmaFormulaGrid.reactiveData.currentArea.end != null) {


                    const leftSpaceWidth = getXSpaceFromColumnWidths(
                        $vmaFormulaGrid.reactiveData.xStart,
                        renderDefaultColWidth.value,
                        $vmaFormulaGrid.reactiveData.columnWidthsChanged,
                        $vmaFormulaGrid.reactiveData.columnHidesChanged
                    )

                    const topSpaceHeight = getYSpaceFromRowHeights(
                        $vmaFormulaGrid.reactiveData.yStart,
                        renderDefaultRowHeight.value,
                        $vmaFormulaGrid.reactiveData.rowHeightsChanged,
                        $vmaFormulaGrid.reactiveData.rowHidesChanged
                    )

                    nextTick(() => {
                        const {w, h,
                            sci, eci,
                            sri, eri,
                            startRowIndex, startColIndex} = getRealArea(renderDefaultColWidth.value,
                            $vmaFormulaGrid.reactiveData.columnWidthsChanged,
                            $vmaFormulaGrid.reactiveData.columnHidesChanged,
                            renderDefaultRowHeight.value,
                            $vmaFormulaGrid.reactiveData.rowHeightsChanged,
                            $vmaFormulaGrid.reactiveData.rowHidesChanged,
                            gridReactiveData.merges,
                            $vmaFormulaGrid.reactiveData.currentArea)
                        refGridBodyTable.value
                            .querySelectorAll(
                                `td[data-row="${startRowIndex}"][data-col="${startColIndex}"]`
                            )
                            .forEach((cellElem: any) => {
                                const borderMarginLeft = `${
                                    leftSpaceWidth + cellElem.offsetLeft - 1
                                }px`
                                const borderMarginTop = `${
                                    topSpaceHeight + cellElem.offsetTop - 1
                                }px`
                                $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.transform = `translateX(${borderMarginLeft}) translateY(${borderMarginTop})`
                                $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.height = `${h}px`
                                $vmaFormulaGrid.reactiveData.currentAreaBorderStyle.width = `${w}px`
                            })

                        refGridBodyTable.value
                            .querySelectorAll('.cell-active')
                            .forEach((elem: any, index: any) => {
                                elem.classList.remove('cell-active')
                            })
                        for (let i = sri; i <= eri; i++) {
                            for (let j = sci; j <= eci; j++) {
                                refGridBodyTable.value
                                    .querySelectorAll(`td[data-row="${i}"][data-col="${j}"]`)
                                    .forEach((cellElem: any) => cellElem.classList.add('cell-active'))
                            }
                        }
                    })
                } else {
                    $vmaFormulaGrid.reactiveData.currentAreaBorderStyle = {
                        transform: 'translateX(0) translateY(0)',
                        left: 0,
                        top: 0,
                        width: 0,
                        height: 0
                    }
                    refGridBodyTable.value
                        .querySelectorAll('.cell-active')
                        .forEach((elem: any, index: any) => {
                            elem.classList.remove('cell-active')
                        })
                }
            },
            calcCurrentCellEditorStyle: () => {
                if (gridReactiveData.currentCell) {
                    nextTick(() => {
                        const leftSpaceWidth = getXSpaceFromColumnWidths(
                            gridReactiveData.xStart,
                            renderDefaultColWidth.value,
                            gridReactiveData.columnWidthsChanged,
                            gridReactiveData.columnHidesChanged
                        )

                        const topSpaceHeight = getYSpaceFromRowHeights(
                            gridReactiveData.yStart,
                            renderDefaultRowHeight.value,
                            gridReactiveData.rowHeightsChanged,
                            gridReactiveData.rowHidesChanged
                        )
                        const { row, col } = gridReactiveData.currentCell
                        const cells = refGridBodyTable.value
                            .querySelectorAll(`td[data-row="${row}"][data-col="${col!}"]`)
                        if (cells.length > 0) {
                            cells.forEach((cellElem: any) => {
                                const marginLeft = `${leftSpaceWidth + cellElem.offsetLeft}px`
                                const marginTop = `${topSpaceHeight + cellElem.offsetTop}px`
                                const borderMarginLeft = `${leftSpaceWidth + cellElem.offsetLeft - 1}px`
                                const borderMarginTop = `${topSpaceHeight + cellElem.offsetTop - 1}px`
                                gridReactiveData.currentCellEditorStyle.transform = `translateX(${marginLeft}) translateY(${marginTop})`
                                gridReactiveData.currentCellEditorStyle.height = `${cellElem.offsetHeight - 1}px`
                                gridReactiveData.currentCellEditorStyle.width = `${cellElem.offsetWidth - 1}px`
                                gridReactiveData.currentCellBorderStyle.transform = `translateX(${borderMarginLeft}) translateY(${borderMarginTop})`
                                gridReactiveData.currentCellBorderStyle.height = `${cellElem.offsetHeight}px`
                                gridReactiveData.currentCellBorderStyle.width = `${cellElem.offsetWidth}px`
                            })
                        } else {
                            gridReactiveData.currentCell = null
                        }
                    })
                }
            },
            calcCurrentCellEditorDisplay: () => {
                if (gridReactiveData.currentCell) {
                    const { row, col } = gridReactiveData.currentCell
                    if (
                        row! <= gridReactiveData.yEnd &&
                        row! >= gridReactiveData.yStart &&
                        col! <= gridReactiveData.xEnd &&
                        col! >= gridReactiveData.xStart &&
                        gridReactiveData.currentCellEditorActive
                    ) {
                        gridReactiveData.currentCellEditorStyle.display = 'block'
                    } else {
                        gridReactiveData.currentCellEditorStyle.display = 'none'
                    }
                } else {
                    gridReactiveData.currentCellEditorStyle.display = 'none'
                }
            },
            insertColumn: (colNumber: number) => {
                updateConfs('insertColumn', colNumber, null)
                gridReactiveData.colConfs.map((item: Column) => {
                    if (item.index >= colNumber) {
                        item.index += 1
                    }
                    return item
                })
                let colVisible = true
                if (gridReactiveData.columnHidesChanged.hasOwnProperty((colNumber + 1).toString())) {
                    colVisible = false
                    gridReactiveData.columnHidesChanged[colNumber.toString()] = 0
                }
                gridReactiveData.colConfs.splice(
                    colNumber + 1,
                    0,
                    new Column(Number(colNumber), 'default', colVisible,),
                )
                gridReactiveData.currentSheetData.map(
                    (row: Cell[], index: number) => {
                        row.map((cell: Cell) => {
                            if (cell.colSpan && cell.colSpan > 1 && cell.col < colNumber && cell.col + cell.colSpan >= colNumber) {
                                cell.colSpan += 1
                            }
                            if (cell.col >= colNumber) {
                                cell.col += 1
                            }
                            return null
                        })
                        row.splice(
                            colNumber + 1,
                            0,
                            new Cell(index, colNumber, 1, 1, null, null, null, null, false, -1, '17', '', '', null, null, null, null) as Cell & { [key: string]: string },
                        )
                        return null
                    },
                )
                $vmaFormulaGrid
                    .recalculate(true)
                    .then(() => {
                        $vmaFormulaGrid.calcCurrentCellEditorStyle()
                        $vmaFormulaGrid.calcCurrentCellEditorDisplay()
                        $vmaFormulaGrid.updateCurrentAreaStyle()
                    })
                    .then(() => {
                        $vmaFormulaGrid.calc()
                    })
            },
            insertRow: (rowNumber: number) => {
                updateConfs('insertRow', null, rowNumber)
                gridReactiveData.rowConfs.map((item: Column) => {
                    if (item.index >= rowNumber) {
                        item.index += 1
                    }
                    return item
                })
                let rowVisible = true
                if (gridReactiveData.rowHidesChanged.hasOwnProperty((rowNumber + 1).toString())) {
                    rowVisible = false
                    gridReactiveData.rowHidesChanged[rowNumber.toString()] = 0
                }
                gridReactiveData.rowConfs.splice(
                    rowNumber,
                    0,
                    new Row(Number(rowNumber), 'default', rowVisible,),
                )
                gridReactiveData.currentSheetData.map(
                    (row: Cell[], _: number) => {
                        row.map((cell: Cell) => {
                            if (cell.rowSpan && cell.rowSpan > 1 && cell.row < rowNumber && cell.row + cell.rowSpan >= rowNumber) {
                                cell.rowSpan += 1
                            }
                            if (cell.row >= rowNumber) {
                                cell.row += 1
                            }
                            return null
                        })
                        return null
                    },
                )

                const aNewRow: Cell[] = []
                for (let i = -1; i < gridReactiveData.colConfs.length - 1; i++) {
                    aNewRow.push(
                        new Cell(Number(rowNumber), i, 1, 1, null, null, null, null, false, -1, '17', '', '', null, null, null, null) as Cell & { [key: string]: string },
                    )
                }
                gridReactiveData.currentSheetData.splice(Number(rowNumber), 0, aNewRow)
                $vmaFormulaGrid
                    .recalculate(true)
                    .then(() => {
                        $vmaFormulaGrid.calcCurrentCellEditorStyle()
                        $vmaFormulaGrid.calcCurrentCellEditorDisplay()
                        $vmaFormulaGrid.updateCurrentAreaStyle()
                    })
                    .then(() => {
                        $vmaFormulaGrid.calc()
                    })
            },
            hideColumn: (colNumber: number) => {
                updateConfs('hideColumn', colNumber, null)
                gridReactiveData.colConfs[colNumber + 1].visible = false
                $vmaFormulaGrid.recalculate(false).then(() => {
                    $vmaFormulaGrid.calcCurrentCellEditorStyle()
                    $vmaFormulaGrid.calcCurrentCellEditorDisplay()
                    $vmaFormulaGrid.updateCurrentAreaStyle()
                })
            },
            hideRow: (rowNumber: number) => {
                updateConfs('hideRow', null, rowNumber)
                gridReactiveData.rowConfs[rowNumber].visible = false
                $vmaFormulaGrid.recalculate(false).then(() => {
                    $vmaFormulaGrid.calcCurrentCellEditorStyle()
                    $vmaFormulaGrid.calcCurrentCellEditorDisplay()
                    $vmaFormulaGrid.updateCurrentAreaStyle()
                })
            },
            deleteColumn: (colNumber: number) => {
                updateConfs('deleteColumn', colNumber, null)
                gridReactiveData.colConfs.map((item: Column) => {
                    if (item.index >= colNumber) {
                        item.index -= 1
                    }
                    return item
                })
                gridReactiveData.colConfs.splice(
                    colNumber + 1,
                    1
                )

                if (colNumber + 1 <= gridReactiveData.colConfs.length - 1) {
                    gridReactiveData.currentSheetData.map(
                        (row: Cell[], _: number) => {
                            if (row[colNumber + 1].colSpan && row[colNumber + 1].colSpan! > 1) {
                                row[colNumber + 1 + 1].rowSpan = row[colNumber + 1].rowSpan!
                                row[colNumber + 1 + 1].colSpan = row[colNumber + 1].colSpan! - 1
                            }
                        })
                }

                gridReactiveData.currentSheetData.map(
                    (row: Cell[], _: number) => {
                        row.map((cell: Cell) => {
                            if (cell.colSpan && cell.colSpan > 1 && cell.col <= colNumber && cell.col + cell.colSpan > colNumber) {
                                cell.colSpan -= 1
                            }
                            if (cell.col >= colNumber) {
                                cell.col -= 1
                            }
                            return null
                        })
                        row.splice(
                            colNumber + 1,
                            1
                        )
                        return null
                    },
                )

                $vmaFormulaGrid
                    .recalculate(true)
                    .then(() => {
                        $vmaFormulaGrid.calcCurrentCellEditorStyle()
                        $vmaFormulaGrid.calcCurrentCellEditorDisplay()
                        $vmaFormulaGrid.updateCurrentAreaStyle()
                    })
                    .then(() => {
                        $vmaFormulaGrid.calc()
                    })

                updateCurrentCell()
            },
            deleteRow: (rowNumber: number) => {
                updateConfs('deleteRow', null, rowNumber)
                gridReactiveData.rowConfs.map((item: Column) => {
                    if (item.index >= rowNumber) {
                        item.index -= 1
                    }
                    return item
                })
                gridReactiveData.rowConfs.splice(
                    rowNumber,
                    1
                )

                if (rowNumber + 1 <= gridReactiveData.currentSheetData.length) {
                    gridReactiveData.currentSheetData[rowNumber].map((cell: Cell) => {
                        if (cell.rowSpan && cell.rowSpan > 1) {
                            gridReactiveData.currentSheetData[rowNumber + 1][cell.col + 1].colSpan = cell.colSpan!
                            gridReactiveData.currentSheetData[rowNumber + 1][cell.col + 1].rowSpan = cell.rowSpan! - 1
                        }
                    })
                }

                gridReactiveData.currentSheetData.map(
                    (row: Cell[], _: number) => {
                        row.map((cell: Cell) => {
                            if (cell.rowSpan && cell.rowSpan > 1 && cell.row <= rowNumber && cell.row + cell.rowSpan > rowNumber) {
                                cell.rowSpan -= 1
                            }
                            if (cell.row >= rowNumber) {
                                cell.row -= 1
                            }
                            return null
                        })
                        return null
                    },
                )

                gridReactiveData.currentSheetData.splice(Number(rowNumber), 1)

                $vmaFormulaGrid
                    .recalculate(true)
                    .then(() => {
                        $vmaFormulaGrid.calcCurrentCellEditorStyle()
                        $vmaFormulaGrid.calcCurrentCellEditorDisplay()
                        $vmaFormulaGrid.updateCurrentAreaStyle()
                        $vmaFormulaGrid.updateCellStyle()
                    })
                    .then(() => {
                        $vmaFormulaGrid.calc()
                    })

                updateCurrentCell()
            },
            setCellBorder: (type: "cells" | "rows" | "columns", target: "l" | "t" | "r" | "b" | "none" | "full" | "outer" | "inner") => {
                if (type === 'cells') {
                    const pt: any = {}
                    if (target === 'none') pt.none = true
                    if (target === 'full') pt.full = true
                    if (target === 'outer') pt.outer = true
                    if (target === 'inner') pt.inner = true
                    if (target === 'l') pt.left = true
                    if (target === 't') pt.top = true
                    if (target === 'r') pt.right = true
                    if (target === 'b') pt.bottom = true
                    const pStart = getColumnSymbol($vmaFormulaGrid.reactiveData.currentArea.start.col + 1) + ($vmaFormulaGrid.reactiveData.currentArea.start.row + 1)
                    const pEnd =  getColumnSymbol($vmaFormulaGrid.reactiveData.currentArea.end.col + 1) + ($vmaFormulaGrid.reactiveData.currentArea.end.row + 1)
                    const p = pStart === pEnd ? pStart : pStart + ':' + pEnd
                    gridReactiveData.borders.push({
                        p: p,
                        details: pt,
                        type: 'cells'
                    })
                    for (let col = Math.min($vmaFormulaGrid.reactiveData.currentArea.start.col, $vmaFormulaGrid.reactiveData.currentArea.end.col);
                         col <= Math.max($vmaFormulaGrid.reactiveData.currentArea.start.col, $vmaFormulaGrid.reactiveData.currentArea.end.col);
                         col++
                    ) {
                        for (let row = Math.min($vmaFormulaGrid.reactiveData.currentArea.start.row, $vmaFormulaGrid.reactiveData.currentArea.end.row);
                             row <= Math.max($vmaFormulaGrid.reactiveData.currentArea.start.row, $vmaFormulaGrid.reactiveData.currentArea.end.row);
                             row++
                        ) {
                            const {bg} = calcCellStyles(col, row, $vmaFormulaGrid.reactiveData.styles)
                            const {bdl: bdlCurrent, bdt: bdtCurrent, bdr: bdrCurrent, bdb: bdbCurrent} = calcCellBorders(col, row, gridReactiveData.borders, gridReactiveData.colConfs.length, gridReactiveData.rowConfs.length)
                            $vmaFormulaGrid.reactiveData.currentSheetData[row][col + 1].bgt = calcCellBgType(bg.length > 0, bdlCurrent, bdtCurrent, bdrCurrent, bdbCurrent)
                            // TODO 修改bgt之后，会导致cell-active状态消失，待查明修正
                        }
                    }
                }
            },
            setBackgroundColor: (type: 'cells' | 'rows' | 'columns', mode: 'none' | 'normal', color: any) => {
                if (type === 'cells') {
                    const pStart = getColumnSymbol($vmaFormulaGrid.reactiveData.currentArea.start.col + 1) + ($vmaFormulaGrid.reactiveData.currentArea.start.row + 1)
                    const pEnd =  getColumnSymbol($vmaFormulaGrid.reactiveData.currentArea.end.col + 1) + ($vmaFormulaGrid.reactiveData.currentArea.end.row + 1)
                    const p = pStart === pEnd ? pStart : pStart + ':' + pEnd
                    gridReactiveData.styles.bgc.push({
                        p: p,
                        color: mode === 'none' ? 'none' : color,
                        type: 'cells'
                    })
                    for (let col = Math.min($vmaFormulaGrid.reactiveData.currentArea.start.col, $vmaFormulaGrid.reactiveData.currentArea.end.col);
                         col <= Math.max($vmaFormulaGrid.reactiveData.currentArea.start.col, $vmaFormulaGrid.reactiveData.currentArea.end.col);
                         col++
                    ) {
                        for (let row = Math.min($vmaFormulaGrid.reactiveData.currentArea.start.row, $vmaFormulaGrid.reactiveData.currentArea.end.row);
                             row <= Math.max($vmaFormulaGrid.reactiveData.currentArea.start.row, $vmaFormulaGrid.reactiveData.currentArea.end.row);
                             row++
                        ) {
                            const {bg} = calcCellStyles(col, row, $vmaFormulaGrid.reactiveData.styles)
                            const {bdl: bdlCurrent, bdt: bdtCurrent, bdr: bdrCurrent, bdb: bdbCurrent} = calcCellBorders(col, row, gridReactiveData.borders, gridReactiveData.colConfs.length, gridReactiveData.rowConfs.length)
                            $vmaFormulaGrid.reactiveData.currentSheetData[row][col + 1].bg = bg
                            $vmaFormulaGrid.reactiveData.currentSheetData[row][col + 1].bgt = calcCellBgType(bg.length > 0, bdlCurrent, bdtCurrent, bdrCurrent, bdbCurrent)
                            // TODO 修改bgt之后，会导致cell-active状态消失，待查明修正
                        }
                    }
                }
            },
            setFontColor: (type: 'cells' | 'rows' | 'columns', mode: 'none' | 'normal', color: any) => {
                if (type === 'cells') {
                    const pStart = getColumnSymbol($vmaFormulaGrid.reactiveData.currentArea.start.col + 1) + ($vmaFormulaGrid.reactiveData.currentArea.start.row + 1)
                    const pEnd =  getColumnSymbol($vmaFormulaGrid.reactiveData.currentArea.end.col + 1) + ($vmaFormulaGrid.reactiveData.currentArea.end.row + 1)
                    const p = pStart === pEnd ? pStart : pStart + ':' + pEnd
                    gridReactiveData.styles.fgc.push({
                        p: p,
                        color: mode === 'none' ? 'none' : color,
                        type: 'cells'
                    })
                    for (let col = Math.min($vmaFormulaGrid.reactiveData.currentArea.start.col, $vmaFormulaGrid.reactiveData.currentArea.end.col);
                         col <= Math.max($vmaFormulaGrid.reactiveData.currentArea.start.col, $vmaFormulaGrid.reactiveData.currentArea.end.col);
                         col++
                    ) {
                        for (let row = Math.min($vmaFormulaGrid.reactiveData.currentArea.start.row, $vmaFormulaGrid.reactiveData.currentArea.end.row);
                             row <= Math.max($vmaFormulaGrid.reactiveData.currentArea.start.row, $vmaFormulaGrid.reactiveData.currentArea.end.row);
                             row++
                        ) {
                            const {fg} = calcCellStyles(col, row, $vmaFormulaGrid.reactiveData.styles)
                            $vmaFormulaGrid.reactiveData.currentSheetData[row][col + 1].fg = fg
                        }
                    }
                }
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
                            $vmaFormulaGrid.calcCurrentCellEditorStyle()
                            $vmaFormulaGrid.calcCurrentCellEditorDisplay()
                            $vmaFormulaGrid.updateCurrentAreaStyle()
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
                            $vmaFormulaGrid.calcCurrentCellEditorStyle()
                            $vmaFormulaGrid.calcCurrentCellEditorDisplay()
                            $vmaFormulaGrid.updateCurrentAreaStyle()
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
                            $vmaFormulaGrid.calcCurrentCellEditorStyle()
                            $vmaFormulaGrid.calcCurrentCellEditorDisplay()
                            $vmaFormulaGrid.updateCurrentAreaStyle()
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
                            $vmaFormulaGrid.calcCurrentCellEditorStyle()
                            $vmaFormulaGrid.calcCurrentCellEditorDisplay()
                            $vmaFormulaGrid.updateCurrentAreaStyle()
                        })
                    }
                }
            },
        } as VmaFormulaGridPrivateMethods

        const updateCurrentCell = () => {
            if (gridReactiveData.currentCell) {
                if (gridReactiveData.currentCell.row < 0 || gridReactiveData.currentCell.col < 0) {
                    gridReactiveData.currentCell = null
                }
            }
        }

        const updateConfs = (type: string, col: number | null, row: number | null) : void => {
            if (type === 'hideColumn') {
                gridReactiveData.columnHidesChanged[col! + 1] = 0
            }
            if (type === 'hideRow') {
                gridReactiveData.rowHidesChanged[row! + 1] = 0
            }
            if (type === 'deleteColumn') {
                const gridColumnsVisibleChangedNew: Record<string, number> = {}
                Object.keys(gridReactiveData.columnHidesChanged).map((key) => {
                    if (Number(key) > col!) {
                        const newKey = Number(key) - 1
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
                    if (Number(key) > col!) {
                        const newKey = Number(key) - 1
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
                        crStartArr[0] = (Number(crStartArr[0]) - 1).toString()
                        crEndArr[0] = (Number(crEndArr[0]) - 1).toString()
                    } else if (Number(crStartArr[0]) <= col! && col! < Number(crEndArr[0])) {
                        crEndArr[0] = (Number(crEndArr[0]) - 1).toString()
                    }
                    if (!(Number(crStartArr[0]) === 0 && Number(crEndArr[0]) === 0)) {
                        if (Number(crStartArr[0]) === 0 && Number(crEndArr[0]) > 0) {
                            crStartArr[0] = '1'
                        }
                        mergesNew[`${crStartArr.join('_') + ':' + crEndArr.join('_')}`] = {
                            colStart: Number(crStartArr[0]),
                            colEnd: Number(crEndArr[0]),
                            colSpan: Number(crEndArr[0]) - Number(crStartArr[0]) + 1,
                            rowStart: Number(crStartArr[1]),
                            rowEnd: Number(crEndArr[1]),
                            rowSpan: Number(crEndArr[1]) - Number(crStartArr[1]) + 1
                        }

                    }
                })
                gridReactiveData.merges = mergesNew

                // bgc fgc
                if ($vmaFormulaGrid.reactiveData.styles) {
                    if ($vmaFormulaGrid.reactiveData.styles && $vmaFormulaGrid.reactiveData.styles.bgc && $vmaFormulaGrid.reactiveData.styles.bgc.length > 0) {
                        const bgcNew: Record<string, any>[] = []
                        $vmaFormulaGrid.reactiveData.borders.forEach((bgcItem: any) => {
                            if (bgcItem.hasOwnProperty('type') && (bgcItem.type === 'columns' || bgcItem.type === 'cells')) {
                                if (bgcItem.type === 'columns' && bgcItem.hasOwnProperty('p') && bgcItem.p.length > 0) {
                                    const posTemp: any[] = []
                                    bgcItem.p.forEach((bgcItemPos: string) => {
                                        if (bgcItemPos.indexOf(':') >= 0) {
                                            let columnRangeArr: any[] = bgcItemPos.split(':')
                                            columnRangeArr = columnRangeArr.map((col: string) => {
                                                return getColumnCount(col)
                                            })
                                            let columnStart = Math.min(...columnRangeArr)
                                            let columnEnd = Math.max(...columnRangeArr)
                                            if (col! + 1 < columnStart) {
                                                columnStart -= 1
                                                columnEnd -= 1
                                            } else if (col! + 1 >= columnStart && col! + 1 <= columnEnd) {
                                                columnEnd -= 1
                                            }
                                            if (columnEnd >= columnStart) {
                                                posTemp.push(getColumnSymbol(columnStart) + ':' + getColumnSymbol(columnEnd))
                                            }
                                        } else {
                                            if (col! + 1 < getColumnCount(bgcItemPos)) {
                                                posTemp.push(getColumnSymbol(getColumnCount(bgcItemPos) - 1))
                                            } else if (col! + 1 > getColumnCount(bgcItemPos)) {
                                                posTemp.push(bgcItemPos)
                                            }
                                        }
                                    })
                                    if (posTemp.length > 0) {
                                        bgcNew.push(Object.assign({}, bgcItem, {p: posTemp}))
                                    }
                                }
                                if (bgcItem.type === 'cells' && bgcItem.hasOwnProperty('p') && bgcItem.p.length > 0) {
                                    if (bgcItem.p.indexOf(':') >= 0) {
                                        let cellRangeArr = bgcItem.p.split(':')
                                        let cellPrev = cellRangeArr[0]
                                        let cellNext = cellRangeArr[1]
                                        let cellPrevColStr = cellPrev.replace(/[0-9]/g, '')
                                        let cellPrevRow = parseInt(cellPrev.replace(/[^0-9]/ig, ''))
                                        let cellNextColStr = cellNext.replace(/[0-9]/g, '')
                                        let cellNextRow = parseInt(cellNext.replace(/[^0-9]/ig, ''))
                                        if (col! + 1 < Math.min(getColumnCount(cellPrevColStr), getColumnCount(cellNextColStr))) {
                                            cellPrevColStr = getColumnSymbol(getColumnCount(cellPrevColStr) - 1)
                                            cellNextColStr = getColumnSymbol(getColumnCount(cellNextColStr) - 1)
                                        } else if ((col! + 1 >= getColumnCount(cellPrevColStr) && col! + 1 <= getColumnCount(cellNextColStr)) || col! + 1 >= getColumnCount(cellNextColStr) && col! + 1 <= getColumnCount(cellPrevColStr)) {
                                            if (getColumnCount(cellNextColStr) > getColumnCount(cellPrevColStr)) {
                                                cellNextColStr = getColumnSymbol(getColumnCount(cellNextColStr) - 1)
                                            } else {
                                                cellPrevColStr = getColumnSymbol(getColumnCount(cellPrevColStr) - 1)
                                            }
                                        }
                                        bgcNew.push(Object.assign({}, bgcItem, {p: cellPrevColStr + cellPrevRow + ':' + cellNextColStr + cellNextRow}))
                                    } else {
                                        let cellColStr = bgcItem.p.replace(/[0-9]/g, '')
                                        let cellRow = parseInt(bgcItem.p.replace(/[^0-9]/ig, ''))
                                        if (col! + 1 < getColumnCount(cellColStr)) {
                                            cellColStr = getColumnSymbol(getColumnCount(cellColStr) - 1)
                                            bgcNew.push(Object.assign({}, bgcItem, {p: cellColStr + cellRow}))
                                        } else if (col! + 1 > getColumnCount(cellColStr)) {
                                            bgcNew.push(Object.assign({}, bgcItem, {p: cellColStr + cellRow}))
                                        }
                                    }
                                }
                            } else if (bgcItem.hasOwnProperty('type') && bgcItem.type === 'rows') {
                                bgcNew.push(Object.assign({}, bgcItem))
                            }
                        })
                        $vmaFormulaGrid.reactiveData.styles.bgc = bgcNew
                    }
                    if ($vmaFormulaGrid.reactiveData.styles && $vmaFormulaGrid.reactiveData.styles.fgc && $vmaFormulaGrid.reactiveData.styles.fgc.length > 0) {
                        const fgcNew: Record<string, any>[] = []
                        $vmaFormulaGrid.reactiveData.borders.forEach((fgcItem: any) => {
                            if (fgcItem.hasOwnProperty('type') && (fgcItem.type === 'columns' || fgcItem.type === 'cells')) {
                                if (fgcItem.type === 'columns' && fgcItem.hasOwnProperty('p') && fgcItem.p.length > 0) {
                                    const posTemp: any[] = []
                                    fgcItem.p.forEach((fgcItemPos: string) => {
                                        if (fgcItemPos.indexOf(':') >= 0) {
                                            let columnRangeArr: any[] = fgcItemPos.split(':')
                                            columnRangeArr = columnRangeArr.map((col: string) => {
                                                return getColumnCount(col)
                                            })
                                            let columnStart = Math.min(...columnRangeArr)
                                            let columnEnd = Math.max(...columnRangeArr)
                                            if (col! + 1 < columnStart) {
                                                columnStart -= 1
                                                columnEnd -= 1
                                            } else if (col! + 1 >= columnStart && col! + 1 <= columnEnd) {
                                                columnEnd -= 1
                                            }
                                            if (columnEnd >= columnStart) {
                                                posTemp.push(getColumnSymbol(columnStart) + ':' + getColumnSymbol(columnEnd))
                                            }
                                        } else {
                                            if (col! + 1 < getColumnCount(fgcItemPos)) {
                                                posTemp.push(getColumnSymbol(getColumnCount(fgcItemPos) - 1))
                                            } else if (col! + 1 > getColumnCount(fgcItemPos)) {
                                                posTemp.push(fgcItemPos)
                                            }
                                        }
                                    })
                                    if (posTemp.length > 0) {
                                        fgcNew.push(Object.assign({}, fgcItem, {p: posTemp}))
                                    }
                                }
                                if (fgcItem.type === 'cells' && fgcItem.hasOwnProperty('p') && fgcItem.p.length > 0) {
                                    if (fgcItem.p.indexOf(':') >= 0) {
                                        let cellRangeArr = fgcItem.p.split(':')
                                        let cellPrev = cellRangeArr[0]
                                        let cellNext = cellRangeArr[1]
                                        let cellPrevColStr = cellPrev.replace(/[0-9]/g, '')
                                        let cellPrevRow = parseInt(cellPrev.replace(/[^0-9]/ig, ''))
                                        let cellNextColStr = cellNext.replace(/[0-9]/g, '')
                                        let cellNextRow = parseInt(cellNext.replace(/[^0-9]/ig, ''))
                                        if (col! + 1 < Math.min(getColumnCount(cellPrevColStr), getColumnCount(cellNextColStr))) {
                                            cellPrevColStr = getColumnSymbol(getColumnCount(cellPrevColStr) - 1)
                                            cellNextColStr = getColumnSymbol(getColumnCount(cellNextColStr) - 1)
                                        } else if ((col! + 1 >= getColumnCount(cellPrevColStr) && col! + 1 <= getColumnCount(cellNextColStr)) || col! + 1 >= getColumnCount(cellNextColStr) && col! + 1 <= getColumnCount(cellPrevColStr)) {
                                            if (getColumnCount(cellNextColStr) > getColumnCount(cellPrevColStr)) {
                                                cellNextColStr = getColumnSymbol(getColumnCount(cellNextColStr) - 1)
                                            } else {
                                                cellPrevColStr = getColumnSymbol(getColumnCount(cellPrevColStr) - 1)
                                            }
                                        }
                                        fgcNew.push(Object.assign({}, fgcItem, {p: cellPrevColStr + cellPrevRow + ':' + cellNextColStr + cellNextRow}))
                                    } else {
                                        let cellColStr = fgcItem.p.replace(/[0-9]/g, '')
                                        let cellRow = parseInt(fgcItem.p.replace(/[^0-9]/ig, ''))
                                        if (col! + 1 < getColumnCount(cellColStr)) {
                                            cellColStr = getColumnSymbol(getColumnCount(cellColStr) - 1)
                                            fgcNew.push(Object.assign({}, fgcItem, {p: cellColStr + cellRow}))
                                        } else if (col! + 1 > getColumnCount(cellColStr)) {
                                            fgcNew.push(Object.assign({}, fgcItem, {p: cellColStr + cellRow}))
                                        }
                                    }
                                }
                            } else if (fgcItem.hasOwnProperty('type') && fgcItem.type === 'rows') {
                                fgcNew.push(Object.assign({}, fgcItem))
                            }
                        })
                        $vmaFormulaGrid.reactiveData.styles.fgc = fgcNew
                    }
                }

                // borders
                if ($vmaFormulaGrid.reactiveData.borders && $vmaFormulaGrid.reactiveData.borders.length > 0) {
                    const bordersNew: Record<string, any>[] = []
                    $vmaFormulaGrid.reactiveData.borders.forEach((borderItem: any) => {
                        if (borderItem.hasOwnProperty('type') && (borderItem.type === 'columns' || borderItem.type === 'cells')) {
                            if (borderItem.type === 'columns' && borderItem.hasOwnProperty('p') && borderItem.p.length > 0) {
                                const posTemp: any[] = []
                                borderItem.p.forEach((borderItemPos: string) => {
                                    if (borderItemPos.indexOf(':') >= 0) {
                                        let columnRangeArr: any[] = borderItemPos.split(':')
                                        columnRangeArr = columnRangeArr.map((col: string) => {
                                            return getColumnCount(col)
                                        })
                                        let columnStart = Math.min(...columnRangeArr)
                                        let columnEnd = Math.max(...columnRangeArr)
                                        if (col! + 1 < columnStart) {
                                            columnStart -= 1
                                            columnEnd -= 1
                                        } else if (col! + 1 >= columnStart && col! + 1 <= columnEnd) {
                                            columnEnd -= 1
                                        }
                                        if (columnEnd >= columnStart) {
                                            posTemp.push(getColumnSymbol(columnStart) + ':' + getColumnSymbol(columnEnd))
                                        }
                                    } else {
                                        if (col! + 1 < getColumnCount(borderItemPos)) {
                                            posTemp.push(getColumnSymbol(getColumnCount(borderItemPos) - 1))
                                        } else if (col! + 1 > getColumnCount(borderItemPos)) {
                                            posTemp.push(borderItemPos)
                                        }
                                    }
                                })
                                if (posTemp.length > 0) {
                                    bordersNew.push(Object.assign({}, borderItem, {p: posTemp}))
                                }
                            }
                            if (borderItem.type === 'cells' && borderItem.hasOwnProperty('p') && borderItem.p.length > 0) {
                                if (borderItem.p.indexOf(':') >= 0) {
                                    let cellRangeArr = borderItem.p.split(':')
                                    let cellPrev = cellRangeArr[0]
                                    let cellNext = cellRangeArr[1]
                                    let cellPrevColStr = cellPrev.replace(/[0-9]/g, '')
                                    let cellPrevRow = parseInt(cellPrev.replace(/[^0-9]/ig, ''))
                                    let cellNextColStr = cellNext.replace(/[0-9]/g, '')
                                    let cellNextRow = parseInt(cellNext.replace(/[^0-9]/ig, ''))
                                    if (col! + 1 < Math.min(getColumnCount(cellPrevColStr), getColumnCount(cellNextColStr))) {
                                        cellPrevColStr = getColumnSymbol(getColumnCount(cellPrevColStr) - 1)
                                        cellNextColStr = getColumnSymbol(getColumnCount(cellNextColStr) - 1)
                                    } else if ((col! + 1 >= getColumnCount(cellPrevColStr) && col! + 1 <= getColumnCount(cellNextColStr)) || col! + 1 >= getColumnCount(cellNextColStr) && col! + 1 <= getColumnCount(cellPrevColStr)) {
                                        if (getColumnCount(cellNextColStr) > getColumnCount(cellPrevColStr)) {
                                            cellNextColStr = getColumnSymbol(getColumnCount(cellNextColStr) - 1)
                                        } else {
                                            cellPrevColStr = getColumnSymbol(getColumnCount(cellPrevColStr) - 1)
                                        }
                                    }
                                    bordersNew.push(Object.assign({}, borderItem, {p: cellPrevColStr + cellPrevRow + ':' + cellNextColStr + cellNextRow}))
                                } else {
                                    let cellColStr = borderItem.p.replace(/[0-9]/g, '')
                                    let cellRow = parseInt(borderItem.p.replace(/[^0-9]/ig, ''))
                                    if (col! + 1 < getColumnCount(cellColStr)) {
                                        cellColStr = getColumnSymbol(getColumnCount(cellColStr) - 1)
                                        bordersNew.push(Object.assign({}, borderItem, {p: cellColStr + cellRow}))
                                    } else if (col! + 1 > getColumnCount(cellColStr)) {
                                        bordersNew.push(Object.assign({}, borderItem, {p: cellColStr + cellRow}))
                                    }
                                }
                            }
                        } else if (borderItem.hasOwnProperty('type') && borderItem.type === 'rows') {
                            bordersNew.push(Object.assign({}, borderItem))
                        }
                    })
                    $vmaFormulaGrid.reactiveData.borders = bordersNew
                }

                if ($vmaFormulaGrid.reactiveData.currentArea
                    && $vmaFormulaGrid.reactiveData.currentArea.start !== null
                    && $vmaFormulaGrid.reactiveData.currentArea.end != null) {
                    const {start, end} = $vmaFormulaGrid.reactiveData.currentArea
                    if (start.col === col || end.col === col) {
                        if (start.col === end.col) {
                            $vmaFormulaGrid.reactiveData.currentArea = {
                                start: null,
                                end: null
                            }
                            $vmaFormulaGrid.reactiveData.currentAreaStatus = false
                        } else if (start.col < end.col) {
                            if (start.col === col) {
                                $vmaFormulaGrid.reactiveData.currentArea.start = $vmaFormulaGrid.reactiveData.currentSheetData[start.row][start.col + 1 + 1]
                            }
                            if (end.col === col) {
                                $vmaFormulaGrid.reactiveData.currentArea.end = $vmaFormulaGrid.reactiveData.currentSheetData[end.row][end.col + 1 - 1]
                            }
                        } else if (start.col > end.col) {
                            if (end.col === col) {
                                $vmaFormulaGrid.reactiveData.currentArea.end = $vmaFormulaGrid.reactiveData.currentSheetData[end.row][end.col + 1 + 1]
                            }
                            if (start.col === col) {
                                $vmaFormulaGrid.reactiveData.currentArea.start = $vmaFormulaGrid.reactiveData.currentSheetData[start.row][start.col + 1 - 1]
                            }
                        }
                    }
                }
            }
            if (type === 'deleteRow') {
                const gridRowsVisibleChangedNew: Record<string, number> = {}
                Object.keys(gridReactiveData.rowHidesChanged).map((key) => {
                    if (Number(key) > row!) {
                        const newKey = Number(key) - 1
                        gridRowsVisibleChangedNew[newKey] = gridReactiveData.rowHidesChanged[key]
                    } else {
                        gridRowsVisibleChangedNew[key] = gridReactiveData.rowHidesChanged[key]
                    }
                    return null
                })
                gridReactiveData.rowHidesChanged = gridRowsVisibleChangedNew

                const gridRowsHeightChangedNew: Record<string, number> = {}
                Object.keys(gridReactiveData.rowHeightsChanged).map((key) => {
                    if (Number(key) > row!) {
                        const newKey = Number(key) - 1
                        gridRowsHeightChangedNew[newKey] = gridReactiveData.rowHeightsChanged[key]
                    } else {
                        gridRowsHeightChangedNew[key] = gridReactiveData.rowHeightsChanged[key]
                    }
                    return null
                })
                gridReactiveData.rowHeightsChanged = gridRowsHeightChangedNew

                const mergesNew: Record<string, any> = {}
                Object.keys(gridReactiveData.merges).map((key) => {
                    const crArr = key.split(':')
                    const crStartArr = crArr[0].split('_')
                    const crEndArr = crArr[1].split('_')
                    if (Number(crStartArr[1]) > row! + 1) {
                        crStartArr[1] = (Number(crStartArr[1]) - 1).toString()
                        crEndArr[1] = (Number(crEndArr[1]) - 1).toString()
                    } else if (Number(crStartArr[1]) <= row! + 1 && row! + 1 <= Number(crEndArr[1])) {
                        crEndArr[1] = (Number(crEndArr[1]) - 1).toString()
                    }
                    if (!(Number(crStartArr[1]) === 0 && Number(crEndArr[1]) === 0)) {
                        if (Number(crStartArr[1]) === 0 && Number(crEndArr[1]) > 0) {
                            crStartArr[1] = '1'
                        }
                        mergesNew[`${crStartArr.join('_') + ':' + crEndArr.join('_')}`] = {
                            colStart: Number(crStartArr[0]),
                            colEnd: Number(crEndArr[0]),
                            colSpan: Number(crEndArr[0]) - Number(crStartArr[0]) + 1,
                            rowStart: Number(crStartArr[1]),
                            rowEnd: Number(crEndArr[1]),
                            rowSpan: Number(crEndArr[1]) - Number(crStartArr[1]) + 1
                        }
                    }
                })
                gridReactiveData.merges = mergesNew

                // bgc fgc
                if ($vmaFormulaGrid.reactiveData.styles) {
                    if ($vmaFormulaGrid.reactiveData.styles && $vmaFormulaGrid.reactiveData.styles.bgc && $vmaFormulaGrid.reactiveData.styles.bgc.length > 0) {
                        const bgcNew: Record<string, any>[] = []
                        $vmaFormulaGrid.reactiveData.styles.bgc.forEach((bgcItem: any) => {
                            if (bgcItem.hasOwnProperty('type') && (bgcItem.type === 'rows' || bgcItem.type === 'cells')) {
                                if (bgcItem.type === 'rows' && bgcItem.hasOwnProperty('p') && bgcItem.p.length > 0) {
                                    const posTemp: any[] = []
                                    bgcItem.p.forEach((bgcItemPos: string | number) => {
                                        if (typeof bgcItemPos === 'string' && bgcItemPos.indexOf(':') >= 0) {
                                            let rowRangeArr: any[] = bgcItemPos.split(':')
                                            rowRangeArr = rowRangeArr.map(Number)
                                            let rowStart = Math.min(...rowRangeArr)
                                            let rowEnd = Math.max(...rowRangeArr)
                                            if (row! + 1 < rowStart) {
                                                rowStart -= 1
                                                rowEnd -= 1
                                            } else if (row! + 1 >= rowStart && row! + 1 <= rowEnd) {
                                                rowEnd -= 1
                                            }
                                            if (rowEnd >= rowStart) {
                                                posTemp.push('' + rowStart + ':' + rowEnd)
                                            }
                                        } else if (typeof bgcItemPos === 'number') {
                                            if (row! + 1 < bgcItemPos) {
                                                posTemp.push(bgcItemPos - 1)
                                            } else if (row! + 1 > bgcItemPos) {
                                                posTemp.push(bgcItemPos)
                                            }
                                        }
                                    })
                                    if (posTemp.length > 0) {
                                        bgcNew.push(Object.assign({}, bgcItem, {p: posTemp}))
                                    }
                                }
                                if (bgcItem.type === 'cells' && bgcItem.hasOwnProperty('p') && bgcItem.p.length > 0) {
                                    if (bgcItem.p.indexOf(':') >= 0) {
                                        let cellRangeArr = bgcItem.p.split(':')
                                        let cellPrev = cellRangeArr[0]
                                        let cellNext = cellRangeArr[1]
                                        let cellPrevColStr = cellPrev.replace(/[0-9]/g, '')
                                        let cellPrevRow = parseInt(cellPrev.replace(/[^0-9]/ig, ''))
                                        let cellNextColStr = cellNext.replace(/[0-9]/g, '')
                                        let cellNextRow = parseInt(cellNext.replace(/[^0-9]/ig, ''))
                                        if (row! + 1 < Math.min(cellPrevRow, cellNextRow)) {
                                            cellPrevRow -= 1
                                            cellNextRow -= 1
                                        } else if ((row! + 1 >= cellPrevRow && row! + 1 <= cellNextRow) || row! + 1 >= cellNextRow && row! + 1 <= cellPrevRow) {
                                            if (cellNextRow > cellPrevRow) {
                                                cellNextRow -= 1
                                            } else {
                                                cellPrevRow -= 1
                                            }
                                        }
                                        bgcNew.push(Object.assign({}, bgcItem, {p: cellPrevColStr + cellPrevRow + ':' + cellNextColStr + cellNextRow}))
                                    } else {
                                        let cellColStr = bgcItem.p.replace(/[0-9]/g, '')
                                        let cellRow = parseInt(bgcItem.p.replace(/[^0-9]/ig, ''))
                                        if (row! + 1 < cellRow) {
                                            cellRow -= 1
                                            bgcNew.push(Object.assign({}, bgcItem, {p: cellColStr + cellRow}))
                                        } else if (row! + 1 > cellRow) {
                                            bgcNew.push(Object.assign({}, bgcItem, {p: cellColStr + cellRow}))
                                        }
                                    }
                                }
                            } else if (bgcItem.hasOwnProperty('type') && bgcItem.type === 'columns') {
                                bgcNew.push(Object.assign({}, bgcItem))
                            }
                        })
                        $vmaFormulaGrid.reactiveData.styles.bgc = bgcNew
                    }
                    if ($vmaFormulaGrid.reactiveData.styles && $vmaFormulaGrid.reactiveData.styles.fgc && $vmaFormulaGrid.reactiveData.styles.fgc.length > 0) {
                        const fgcNew: Record<string, any>[] = []
                        $vmaFormulaGrid.reactiveData.styles.fgc.forEach((fgcItem: any) => {
                            if (fgcItem.hasOwnProperty('type') && (fgcItem.type === 'rows' || fgcItem.type === 'cells')) {
                                if (fgcItem.type === 'rows' && fgcItem.hasOwnProperty('p') && fgcItem.p.length > 0) {
                                    const posTemp: any[] = []
                                    fgcItem.p.forEach((fgcItemPos: string | number) => {
                                        if (typeof fgcItemPos === 'string' && fgcItemPos.indexOf(':') >= 0) {
                                            let rowRangeArr: any[] = fgcItemPos.split(':')
                                            rowRangeArr = rowRangeArr.map(Number)
                                            let rowStart = Math.min(...rowRangeArr)
                                            let rowEnd = Math.max(...rowRangeArr)
                                            if (row! + 1 < rowStart) {
                                                rowStart -= 1
                                                rowEnd -= 1
                                            } else if (row! + 1 >= rowStart && row! + 1 <= rowEnd) {
                                                rowEnd -= 1
                                            }
                                            if (rowEnd >= rowStart) {
                                                posTemp.push('' + rowStart + ':' + rowEnd)
                                            }
                                        } else if (typeof fgcItemPos === 'number') {
                                            if (row! + 1 < fgcItemPos) {
                                                posTemp.push(fgcItemPos - 1)
                                            } else if (row! + 1 > fgcItemPos) {
                                                posTemp.push(fgcItemPos)
                                            }
                                        }
                                    })
                                    if (posTemp.length > 0) {
                                        fgcNew.push(Object.assign({}, fgcItem, {p: posTemp}))
                                    }
                                }
                                if (fgcItem.type === 'cells' && fgcItem.hasOwnProperty('p') && fgcItem.p.length > 0) {
                                    if (fgcItem.p.indexOf(':') >= 0) {
                                        let cellRangeArr = fgcItem.p.split(':')
                                        let cellPrev = cellRangeArr[0]
                                        let cellNext = cellRangeArr[1]
                                        let cellPrevColStr = cellPrev.replace(/[0-9]/g, '')
                                        let cellPrevRow = parseInt(cellPrev.replace(/[^0-9]/ig, ''))
                                        let cellNextColStr = cellNext.replace(/[0-9]/g, '')
                                        let cellNextRow = parseInt(cellNext.replace(/[^0-9]/ig, ''))
                                        if (row! + 1 < Math.min(cellPrevRow, cellNextRow)) {
                                            cellPrevRow -= 1
                                            cellNextRow -= 1
                                        } else if ((row! + 1 >= cellPrevRow && row! + 1 <= cellNextRow) || row! + 1 >= cellNextRow && row! + 1 <= cellPrevRow) {
                                            if (cellNextRow > cellPrevRow) {
                                                cellNextRow -= 1
                                            } else {
                                                cellPrevRow -= 1
                                            }
                                        }
                                        fgcNew.push(Object.assign({}, fgcItem, {p: cellPrevColStr + cellPrevRow + ':' + cellNextColStr + cellNextRow}))
                                    } else {
                                        let cellColStr = fgcItem.p.replace(/[0-9]/g, '')
                                        let cellRow = parseInt(fgcItem.p.replace(/[^0-9]/ig, ''))
                                        if (row! + 1 < cellRow) {
                                            cellRow -= 1
                                            fgcNew.push(Object.assign({}, fgcItem, {p: cellColStr + cellRow}))
                                        } else if (row! + 1 > cellRow) {
                                            fgcNew.push(Object.assign({}, fgcItem, {p: cellColStr + cellRow}))
                                        }
                                    }
                                }
                            } else if (fgcItem.hasOwnProperty('type') && fgcItem.type === 'columns') {
                                fgcNew.push(Object.assign({}, fgcItem))
                            }
                        })
                        $vmaFormulaGrid.reactiveData.styles.fgc = fgcNew
                    }
                }

                // borders
                if ($vmaFormulaGrid.reactiveData.borders && $vmaFormulaGrid.reactiveData.borders.length > 0) {
                    const bordersNew: Record<string, any>[] = []
                    $vmaFormulaGrid.reactiveData.borders.forEach((borderItem: any) => {
                        if (borderItem.hasOwnProperty('type') && (borderItem.type === 'rows' || borderItem.type === 'cells')) {
                            if (borderItem.type === 'rows' && borderItem.hasOwnProperty('p') && borderItem.p.length > 0) {
                                const posTemp: any[] = []
                                borderItem.p.forEach((borderItemPos: string | number) => {
                                    if (typeof borderItemPos === 'string' && borderItemPos.indexOf(':') >= 0) {
                                        let rowRangeArr: any[] = borderItemPos.split(':')
                                        rowRangeArr = rowRangeArr.map(Number)
                                        let rowStart = Math.min(...rowRangeArr)
                                        let rowEnd = Math.max(...rowRangeArr)
                                        if (row! + 1 < rowStart) {
                                            rowStart -= 1
                                            rowEnd -= 1
                                        } else if (row! + 1 >= rowStart && row! + 1 <= rowEnd) {
                                            rowEnd -= 1
                                        }
                                        if (rowEnd >= rowStart) {
                                            posTemp.push('' + rowStart + ':' + rowEnd)
                                        }
                                    } else if (typeof borderItemPos === 'number') {
                                        if (row! + 1 < borderItemPos) {
                                            posTemp.push(borderItemPos - 1)
                                        } else if (row! + 1 > borderItemPos) {
                                            posTemp.push(borderItemPos)
                                        }
                                    }
                                })
                                if (posTemp.length > 0) {
                                    bordersNew.push(Object.assign({}, borderItem, {p: posTemp}))
                                }
                            }
                            if (borderItem.type === 'cells' && borderItem.hasOwnProperty('p') && borderItem.p.length > 0) {
                                if (borderItem.p.indexOf(':') >= 0) {
                                    let cellRangeArr = borderItem.p.split(':')
                                    let cellPrev = cellRangeArr[0]
                                    let cellNext = cellRangeArr[1]
                                    let cellPrevColStr = cellPrev.replace(/[0-9]/g, '')
                                    let cellPrevRow = parseInt(cellPrev.replace(/[^0-9]/ig, ''))
                                    let cellNextColStr = cellNext.replace(/[0-9]/g, '')
                                    let cellNextRow = parseInt(cellNext.replace(/[^0-9]/ig, ''))
                                    if (row! + 1 < Math.min(cellPrevRow, cellNextRow)) {
                                        cellPrevRow -= 1
                                        cellNextRow -= 1
                                    } else if ((row! + 1 >= cellPrevRow && row! + 1 <= cellNextRow) || row! + 1 >= cellNextRow && row! + 1 <= cellPrevRow) {
                                        if (cellNextRow > cellPrevRow) {
                                            cellNextRow -= 1
                                        } else {
                                            cellPrevRow -= 1
                                        }
                                    }
                                    bordersNew.push(Object.assign({}, borderItem, {p: cellPrevColStr + cellPrevRow + ':' + cellNextColStr + cellNextRow}))
                                } else {
                                    let cellColStr = borderItem.p.replace(/[0-9]/g, '')
                                    let cellRow = parseInt(borderItem.p.replace(/[^0-9]/ig, ''))
                                    if (row! + 1 < cellRow) {
                                        cellRow -= 1
                                        bordersNew.push(Object.assign({}, borderItem, {p: cellColStr + cellRow}))
                                    } else if (row! + 1 > cellRow) {
                                        bordersNew.push(Object.assign({}, borderItem, {p: cellColStr + cellRow}))
                                    }
                                }
                            }
                        } else if (borderItem.hasOwnProperty('type') && borderItem.type === 'columns') {
                            bordersNew.push(Object.assign({}, borderItem))
                        }
                    })
                    $vmaFormulaGrid.reactiveData.borders = bordersNew
                }

                if ($vmaFormulaGrid.reactiveData.currentArea
                    && $vmaFormulaGrid.reactiveData.currentArea.start !== null
                    && $vmaFormulaGrid.reactiveData.currentArea.end != null) {
                    const {start, end} = $vmaFormulaGrid.reactiveData.currentArea
                    if (start.row === row || end.row === row) {
                        if (start.row === end.row) {
                            $vmaFormulaGrid.reactiveData.currentArea = {
                                start: null,
                                end: null
                            }
                            $vmaFormulaGrid.reactiveData.currentAreaStatus = false
                        } else if (start.row < end.row) {
                            if (start.row === row) {
                                $vmaFormulaGrid.reactiveData.currentArea.start = $vmaFormulaGrid.reactiveData.currentSheetData[start.row + 1][start.col + 1]
                            }
                            if (end.row === row) {
                                $vmaFormulaGrid.reactiveData.currentArea.end = $vmaFormulaGrid.reactiveData.currentSheetData[end.row - 1][end.col + 1]
                            }
                        } else if (start.row > end.row) {
                            if (end.row === row) {
                                $vmaFormulaGrid.reactiveData.currentArea.end = $vmaFormulaGrid.reactiveData.currentSheetData[end.row + 1][end.col + 1]
                            }
                            if (start.row === row) {
                                $vmaFormulaGrid.reactiveData.currentArea.start = $vmaFormulaGrid.reactiveData.currentSheetData[start.row - 1][start.col + 1]
                            }
                        }
                    }
                }
            }
            if (type === 'insertColumn') {
                const gridColumnsVisibleChangedNew: Record<string, number> = {}
                Object.keys(gridReactiveData.columnHidesChanged).map((key) => {
                    if (Number(key) > col!) {
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
                    if (Number(key) > col!) {
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

                // bgc fgc
                if ($vmaFormulaGrid.reactiveData.styles) {
                    if ($vmaFormulaGrid.reactiveData.styles && $vmaFormulaGrid.reactiveData.styles.bgc && $vmaFormulaGrid.reactiveData.styles.bgc.length > 0) {
                        const bgcNew: Record<string, any>[] = []
                        $vmaFormulaGrid.reactiveData.styles.bgc.forEach((bgcItem: any) => {
                            if (bgcItem.hasOwnProperty('type') && (bgcItem.type === 'columns' || bgcItem.type === 'cells')) {
                                if (bgcItem.type === 'columns' && bgcItem.hasOwnProperty('p') && bgcItem.p.length > 0) {
                                    const posTemp: any[] = []
                                    bgcItem.p.forEach((bgcItemPos: string) => {
                                        if (bgcItemPos.indexOf(':') >= 0) {
                                            let columnRangeArr: any[] = bgcItemPos.split(':')
                                            columnRangeArr = columnRangeArr.map((col: string) => {
                                                return getColumnCount(col)
                                            })
                                            let columnStart = Math.min(...columnRangeArr)
                                            let columnEnd = Math.max(...columnRangeArr)
                                            if (col! + 1 <= columnStart) {
                                                columnStart += 1
                                                columnEnd += 1
                                            } else if (col! + 1 > columnStart && col! + 1 <= columnEnd) {
                                                columnEnd += 1
                                            }
                                            posTemp.push(getColumnSymbol(columnStart) + ':' + getColumnSymbol(columnEnd))
                                        } else {
                                            if (col! + 1 <= getColumnCount(bgcItemPos)) {
                                                posTemp.push(getColumnSymbol(getColumnCount(bgcItemPos) + 1))
                                            } else {
                                                posTemp.push(bgcItemPos)
                                            }
                                        }
                                    })
                                    if (posTemp.length > 0) {
                                        bgcNew.push(Object.assign({}, bgcItem, {p: posTemp}))
                                    }
                                }
                                if (bgcItem.type === 'cells' && bgcItem.hasOwnProperty('p') && bgcItem.p.length > 0) {
                                    if (bgcItem.p.indexOf(':') >= 0) {
                                        let cellRangeArr = bgcItem.p.split(':')
                                        let cellPrev = cellRangeArr[0]
                                        let cellNext = cellRangeArr[1]
                                        let cellPrevColStr = cellPrev.replace(/[0-9]/g, '')
                                        let cellPrevRow = parseInt(cellPrev.replace(/[^0-9]/ig, ''))
                                        let cellNextColStr = cellNext.replace(/[0-9]/g, '')
                                        let cellNextRow = parseInt(cellNext.replace(/[^0-9]/ig, ''))
                                        if (col! + 1 <= Math.min(getColumnCount(cellPrevColStr), getColumnCount(cellNextColStr))) {
                                            cellPrevColStr = getColumnSymbol(getColumnCount(cellPrevColStr) + 1)
                                            cellNextColStr = getColumnSymbol(getColumnCount(cellNextColStr) + 1)
                                        } else if ((col! + 1 > getColumnCount(cellPrevColStr) && col! + 1 <= getColumnCount(cellNextColStr)) || col! + 1 > getColumnCount(cellNextColStr) && col! + 1 <= getColumnCount(cellPrevColStr)) {
                                            if (getColumnCount(cellNextColStr) > getColumnCount(cellPrevColStr)) {
                                                cellNextColStr = getColumnSymbol(getColumnCount(cellNextColStr) + 1)
                                            } else {
                                                cellPrevColStr = getColumnSymbol(getColumnCount(cellPrevColStr) + 1)
                                            }
                                        }
                                        bgcNew.push(Object.assign({}, bgcItem, {p: cellPrevColStr + cellPrevRow + ':' + cellNextColStr + cellNextRow}))
                                    } else {
                                        let cellColStr = bgcItem.p.replace(/[0-9]/g, '')
                                        let cellRow = parseInt(bgcItem.p.replace(/[^0-9]/ig, ''))
                                        if (col! + 1 <= getColumnCount(cellColStr)) {
                                            cellColStr = getColumnSymbol(getColumnCount(cellColStr) + 1)
                                            bgcNew.push(Object.assign({}, bgcItem, {p: cellColStr + cellRow}))
                                        } else {
                                            bgcNew.push(Object.assign({}, bgcItem, {p: cellColStr + cellRow}))
                                        }
                                    }
                                }
                            } else if (bgcItem.hasOwnProperty('type') && bgcItem.type === 'rows') {
                                bgcNew.push(Object.assign({}, bgcItem))
                            }
                        })
                        $vmaFormulaGrid.reactiveData.styles.bgc = bgcNew
                    }
                    if ($vmaFormulaGrid.reactiveData.styles && $vmaFormulaGrid.reactiveData.styles.fgc && $vmaFormulaGrid.reactiveData.styles.fgc.length > 0) {
                        const fgcNew: Record<string, any>[] = []
                        $vmaFormulaGrid.reactiveData.styles.fgc.forEach((fgcItem: any) => {
                            if (fgcItem.hasOwnProperty('type') && (fgcItem.type === 'columns' || fgcItem.type === 'cells')) {
                                if (fgcItem.type === 'columns' && fgcItem.hasOwnProperty('p') && fgcItem.p.length > 0) {
                                    const posTemp: any[] = []
                                    fgcItem.p.forEach((fgcItemPos: string) => {
                                        if (fgcItemPos.indexOf(':') >= 0) {
                                            let columnRangeArr: any[] = fgcItemPos.split(':')
                                            columnRangeArr = columnRangeArr.map((col: string) => {
                                                return getColumnCount(col)
                                            })
                                            let columnStart = Math.min(...columnRangeArr)
                                            let columnEnd = Math.max(...columnRangeArr)
                                            if (col! + 1 <= columnStart) {
                                                columnStart += 1
                                                columnEnd += 1
                                            } else if (col! + 1 > columnStart && col! + 1 <= columnEnd) {
                                                columnEnd += 1
                                            }
                                            posTemp.push(getColumnSymbol(columnStart) + ':' + getColumnSymbol(columnEnd))
                                        } else {
                                            if (col! + 1 <= getColumnCount(fgcItemPos)) {
                                                posTemp.push(getColumnSymbol(getColumnCount(fgcItemPos) + 1))
                                            } else {
                                                posTemp.push(fgcItemPos)
                                            }
                                        }
                                    })
                                    if (posTemp.length > 0) {
                                        fgcNew.push(Object.assign({}, fgcItem, {p: posTemp}))
                                    }
                                }
                                if (fgcItem.type === 'cells' && fgcItem.hasOwnProperty('p') && fgcItem.p.length > 0) {
                                    if (fgcItem.p.indexOf(':') >= 0) {
                                        let cellRangeArr = fgcItem.p.split(':')
                                        let cellPrev = cellRangeArr[0]
                                        let cellNext = cellRangeArr[1]
                                        let cellPrevColStr = cellPrev.replace(/[0-9]/g, '')
                                        let cellPrevRow = parseInt(cellPrev.replace(/[^0-9]/ig, ''))
                                        let cellNextColStr = cellNext.replace(/[0-9]/g, '')
                                        let cellNextRow = parseInt(cellNext.replace(/[^0-9]/ig, ''))
                                        if (col! + 1 <= Math.min(getColumnCount(cellPrevColStr), getColumnCount(cellNextColStr))) {
                                            cellPrevColStr = getColumnSymbol(getColumnCount(cellPrevColStr) + 1)
                                            cellNextColStr = getColumnSymbol(getColumnCount(cellNextColStr) + 1)
                                        } else if ((col! + 1 > getColumnCount(cellPrevColStr) && col! + 1 <= getColumnCount(cellNextColStr)) || col! + 1 > getColumnCount(cellNextColStr) && col! + 1 <= getColumnCount(cellPrevColStr)) {
                                            if (getColumnCount(cellNextColStr) > getColumnCount(cellPrevColStr)) {
                                                cellNextColStr = getColumnSymbol(getColumnCount(cellNextColStr) + 1)
                                            } else {
                                                cellPrevColStr = getColumnSymbol(getColumnCount(cellPrevColStr) + 1)
                                            }
                                        }
                                        fgcNew.push(Object.assign({}, fgcItem, {p: cellPrevColStr + cellPrevRow + ':' + cellNextColStr + cellNextRow}))
                                    } else {
                                        let cellColStr = fgcItem.p.replace(/[0-9]/g, '')
                                        let cellRow = parseInt(fgcItem.p.replace(/[^0-9]/ig, ''))
                                        if (col! + 1 <= getColumnCount(cellColStr)) {
                                            cellColStr = getColumnSymbol(getColumnCount(cellColStr) + 1)
                                            fgcNew.push(Object.assign({}, fgcItem, {p: cellColStr + cellRow}))
                                        } else {
                                            fgcNew.push(Object.assign({}, fgcItem, {p: cellColStr + cellRow}))
                                        }
                                    }
                                }
                            } else if (fgcItem.hasOwnProperty('type') && fgcItem.type === 'rows') {
                                fgcNew.push(Object.assign({}, fgcItem))
                            }
                        })
                        $vmaFormulaGrid.reactiveData.styles.fgc = fgcNew
                    }
                }


                // borders
                if ($vmaFormulaGrid.reactiveData.borders && $vmaFormulaGrid.reactiveData.borders.length > 0) {
                    const bordersNew: Record<string, any>[] = []
                    $vmaFormulaGrid.reactiveData.borders.forEach((borderItem: any) => {
                        if (borderItem.hasOwnProperty('type') && (borderItem.type === 'columns' || borderItem.type === 'cells')) {
                            if (borderItem.type === 'columns' && borderItem.hasOwnProperty('p') && borderItem.p.length > 0) {
                                const posTemp: any[] = []
                                borderItem.p.forEach((borderItemPos: string) => {
                                    if (borderItemPos.indexOf(':') >= 0) {
                                        let columnRangeArr: any[] = borderItemPos.split(':')
                                        columnRangeArr = columnRangeArr.map((col: string) => {
                                            return getColumnCount(col)
                                        })
                                        let columnStart = Math.min(...columnRangeArr)
                                        let columnEnd = Math.max(...columnRangeArr)
                                        if (col! + 1 <= columnStart) {
                                            columnStart += 1
                                            columnEnd += 1
                                        } else if (col! + 1 > columnStart && col! + 1 <= columnEnd) {
                                            columnEnd += 1
                                        }
                                        posTemp.push(getColumnSymbol(columnStart) + ':' + getColumnSymbol(columnEnd))
                                    } else {
                                        if (col! + 1 <= getColumnCount(borderItemPos)) {
                                            posTemp.push(getColumnSymbol(getColumnCount(borderItemPos) + 1))
                                        } else {
                                            posTemp.push(borderItemPos)
                                        }
                                    }
                                })
                                if (posTemp.length > 0) {
                                    bordersNew.push(Object.assign({}, borderItem, {p: posTemp}))
                                }
                            }
                            if (borderItem.type === 'cells' && borderItem.hasOwnProperty('p') && borderItem.p.length > 0) {
                                if (borderItem.p.indexOf(':') >= 0) {
                                    let cellRangeArr = borderItem.p.split(':')
                                    let cellPrev = cellRangeArr[0]
                                    let cellNext = cellRangeArr[1]
                                    let cellPrevColStr = cellPrev.replace(/[0-9]/g, '')
                                    let cellPrevRow = parseInt(cellPrev.replace(/[^0-9]/ig, ''))
                                    let cellNextColStr = cellNext.replace(/[0-9]/g, '')
                                    let cellNextRow = parseInt(cellNext.replace(/[^0-9]/ig, ''))
                                    if (col! + 1 <= Math.min(getColumnCount(cellPrevColStr), getColumnCount(cellNextColStr))) {
                                        cellPrevColStr = getColumnSymbol(getColumnCount(cellPrevColStr) + 1)
                                        cellNextColStr = getColumnSymbol(getColumnCount(cellNextColStr) + 1)
                                    } else if ((col! + 1 > getColumnCount(cellPrevColStr) && col! + 1 <= getColumnCount(cellNextColStr)) || col! + 1 > getColumnCount(cellNextColStr) && col! + 1 <= getColumnCount(cellPrevColStr)) {
                                        if (getColumnCount(cellNextColStr) > getColumnCount(cellPrevColStr)) {
                                            cellNextColStr = getColumnSymbol(getColumnCount(cellNextColStr) + 1)
                                        } else {
                                            cellPrevColStr = getColumnSymbol(getColumnCount(cellPrevColStr) + 1)
                                        }
                                    }
                                    bordersNew.push(Object.assign({}, borderItem, {p: cellPrevColStr + cellPrevRow + ':' + cellNextColStr + cellNextRow}))
                                } else {
                                    let cellColStr = borderItem.p.replace(/[0-9]/g, '')
                                    let cellRow = parseInt(borderItem.p.replace(/[^0-9]/ig, ''))
                                    if (col! + 1 <= getColumnCount(cellColStr)) {
                                        cellColStr = getColumnSymbol(getColumnCount(cellColStr) + 1)
                                        bordersNew.push(Object.assign({}, borderItem, {p: cellColStr + cellRow}))
                                    } else {
                                        bordersNew.push(Object.assign({}, borderItem, {p: cellColStr + cellRow}))
                                    }
                                }
                            }
                        } else if (borderItem.hasOwnProperty('type') && borderItem.type === 'rows') {
                            bordersNew.push(Object.assign({}, borderItem))
                        }
                    })
                    $vmaFormulaGrid.reactiveData.borders = bordersNew
                }

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
            if (type === 'insertRow') {
                const gridRowsVisibleChangedNew: Record<string, number> = {}
                Object.keys(gridReactiveData.rowHidesChanged).map((key) => {
                    if (Number(key) > row!) {
                        const newKey = Number(key) + 1
                        gridRowsVisibleChangedNew[newKey] = gridReactiveData.rowHidesChanged[key]
                    } else {
                        gridRowsVisibleChangedNew[key] = gridReactiveData.rowHidesChanged[key]
                    }
                    return null
                })
                gridReactiveData.rowHidesChanged = gridRowsVisibleChangedNew

                const gridRowsHeightChangedNew: Record<string, number> = {}
                Object.keys(gridReactiveData.rowHeightsChanged).map((key) => {
                    if (Number(key) > row!) {
                        const newKey = Number(key) + 1
                        gridRowsHeightChangedNew[newKey] = gridReactiveData.rowHeightsChanged[key]
                    } else {
                        gridRowsHeightChangedNew[key] = gridReactiveData.rowHeightsChanged[key]
                    }
                    return null
                })
                gridReactiveData.rowHeightsChanged = gridRowsHeightChangedNew

                // bgc fgc
                if ($vmaFormulaGrid.reactiveData.styles) {
                    if ($vmaFormulaGrid.reactiveData.styles && $vmaFormulaGrid.reactiveData.styles.bgc && $vmaFormulaGrid.reactiveData.styles.bgc.length > 0) {
                        const bgcNew: Record<string, any>[] = []
                        $vmaFormulaGrid.reactiveData.styles.bgc.forEach((bgcItem: any) => {
                            if (bgcItem.hasOwnProperty('type') && (bgcItem.type === 'rows' || bgcItem.type === 'cells')) {
                                if (bgcItem.type === 'rows' && bgcItem.hasOwnProperty('p') && bgcItem.p.length > 0) {
                                    const posTemp: any[] = []
                                    bgcItem.p.forEach((bgcItemPos: string | number) => {
                                        if (typeof bgcItemPos === 'string' && bgcItemPos.indexOf(':') >= 0) {
                                            let rowRangeArr: any[] = bgcItemPos.split(':')
                                            rowRangeArr = rowRangeArr.map(Number)
                                            let rowStart = Math.min(...rowRangeArr)
                                            let rowEnd = Math.max(...rowRangeArr)
                                            if (row! + 1 <= rowStart) {
                                                rowStart += 1
                                                rowEnd += 1
                                            } else if (row! + 1 > rowStart && row! + 1 <= rowEnd) {
                                                rowEnd += 1
                                            }
                                            if (rowEnd >= rowStart) {
                                                posTemp.push('' + rowStart + ':' + rowEnd)
                                            }
                                        } else if (typeof bgcItemPos === 'number') {
                                            if (row! + 1 <= bgcItemPos) {
                                                posTemp.push(bgcItemPos + 1)
                                            } else if (row! + 1 > bgcItemPos) {
                                                posTemp.push(bgcItemPos)
                                            }
                                        }
                                    })
                                    if (posTemp.length > 0) {
                                        bgcNew.push(Object.assign({}, bgcItem, {p: posTemp}))
                                    }
                                }
                                if (bgcItem.type === 'cells' && bgcItem.hasOwnProperty('p') && bgcItem.p.length > 0) {
                                    if (bgcItem.p.indexOf(':') >= 0) {
                                        let cellRangeArr = bgcItem.p.split(':')
                                        let cellPrev = cellRangeArr[0]
                                        let cellNext = cellRangeArr[1]
                                        let cellPrevColStr = cellPrev.replace(/[0-9]/g, '')
                                        let cellPrevRow = parseInt(cellPrev.replace(/[^0-9]/ig, ''))
                                        let cellNextColStr = cellNext.replace(/[0-9]/g, '')
                                        let cellNextRow = parseInt(cellNext.replace(/[^0-9]/ig, ''))
                                        if (row! + 1 <= Math.min(cellPrevRow, cellNextRow)) {
                                            cellPrevRow += 1
                                            cellNextRow += 1
                                        } else if ((row! + 1 > cellPrevRow && row! + 1 <= cellNextRow) || row! + 1 > cellNextRow && row! + 1 <= cellPrevRow) {
                                            if (cellNextRow > cellPrevRow) {
                                                cellNextRow += 1
                                            } else {
                                                cellPrevRow += 1
                                            }
                                        }
                                        bgcNew.push(Object.assign({}, bgcItem, {p: cellPrevColStr + cellPrevRow + ':' + cellNextColStr + cellNextRow}))
                                    } else {
                                        let cellColStr = bgcItem.p.replace(/[0-9]/g, '')
                                        let cellRow = parseInt(bgcItem.p.replace(/[^0-9]/ig, ''))
                                        if (row! + 1 <= cellRow) {
                                            cellRow += 1
                                            bgcNew.push(Object.assign({}, bgcItem, {p: cellColStr + cellRow}))
                                        } else if (row! + 1 > cellRow) {
                                            bgcNew.push(Object.assign({}, bgcItem, {p: cellColStr + cellRow}))
                                        }
                                    }
                                }
                            } else if (bgcItem.hasOwnProperty('type') && bgcItem.type === 'columns') {
                                bgcNew.push(Object.assign({}, bgcItem))
                            }
                        })
                        $vmaFormulaGrid.reactiveData.styles.bgc = bgcNew
                    }
                    if ($vmaFormulaGrid.reactiveData.styles && $vmaFormulaGrid.reactiveData.styles.fgc && $vmaFormulaGrid.reactiveData.styles.fgc.length > 0) {
                        const fgcNew: Record<string, any>[] = []
                        $vmaFormulaGrid.reactiveData.styles.fgc.forEach((fgcItem: any) => {
                            if (fgcItem.hasOwnProperty('type') && (fgcItem.type === 'rows' || fgcItem.type === 'cells')) {
                                if (fgcItem.type === 'rows' && fgcItem.hasOwnProperty('p') && fgcItem.p.length > 0) {
                                    const posTemp: any[] = []
                                    fgcItem.p.forEach((fgcItemPos: string | number) => {
                                        if (typeof fgcItemPos === 'string' && fgcItemPos.indexOf(':') >= 0) {
                                            let rowRangeArr: any[] = fgcItemPos.split(':')
                                            rowRangeArr = rowRangeArr.map(Number)
                                            let rowStart = Math.min(...rowRangeArr)
                                            let rowEnd = Math.max(...rowRangeArr)
                                            if (row! + 1 <= rowStart) {
                                                rowStart += 1
                                                rowEnd += 1
                                            } else if (row! + 1 > rowStart && row! + 1 <= rowEnd) {
                                                rowEnd += 1
                                            }
                                            if (rowEnd >= rowStart) {
                                                posTemp.push('' + rowStart + ':' + rowEnd)
                                            }
                                        } else if (typeof fgcItemPos === 'number') {
                                            if (row! + 1 <= fgcItemPos) {
                                                posTemp.push(fgcItemPos + 1)
                                            } else if (row! + 1 > fgcItemPos) {
                                                posTemp.push(fgcItemPos)
                                            }
                                        }
                                    })
                                    if (posTemp.length > 0) {
                                        fgcNew.push(Object.assign({}, fgcItem, {p: posTemp}))
                                    }
                                }
                                if (fgcItem.type === 'cells' && fgcItem.hasOwnProperty('p') && fgcItem.p.length > 0) {
                                    if (fgcItem.p.indexOf(':') >= 0) {
                                        let cellRangeArr = fgcItem.p.split(':')
                                        let cellPrev = cellRangeArr[0]
                                        let cellNext = cellRangeArr[1]
                                        let cellPrevColStr = cellPrev.replace(/[0-9]/g, '')
                                        let cellPrevRow = parseInt(cellPrev.replace(/[^0-9]/ig, ''))
                                        let cellNextColStr = cellNext.replace(/[0-9]/g, '')
                                        let cellNextRow = parseInt(cellNext.replace(/[^0-9]/ig, ''))
                                        if (row! + 1 <= Math.min(cellPrevRow, cellNextRow)) {
                                            cellPrevRow += 1
                                            cellNextRow += 1
                                        } else if ((row! + 1 > cellPrevRow && row! + 1 <= cellNextRow) || row! + 1 > cellNextRow && row! + 1 <= cellPrevRow) {
                                            if (cellNextRow > cellPrevRow) {
                                                cellNextRow += 1
                                            } else {
                                                cellPrevRow += 1
                                            }
                                        }
                                        fgcNew.push(Object.assign({}, fgcItem, {p: cellPrevColStr + cellPrevRow + ':' + cellNextColStr + cellNextRow}))
                                    } else {
                                        let cellColStr = fgcItem.p.replace(/[0-9]/g, '')
                                        let cellRow = parseInt(fgcItem.p.replace(/[^0-9]/ig, ''))
                                        if (row! + 1 <= cellRow) {
                                            cellRow += 1
                                            fgcNew.push(Object.assign({}, fgcItem, {p: cellColStr + cellRow}))
                                        } else if (row! + 1 > cellRow) {
                                            fgcNew.push(Object.assign({}, fgcItem, {p: cellColStr + cellRow}))
                                        }
                                    }
                                }
                            } else if (fgcItem.hasOwnProperty('type') && fgcItem.type === 'columns') {
                                fgcNew.push(Object.assign({}, fgcItem))
                            }
                        })
                        $vmaFormulaGrid.reactiveData.styles.fgc = fgcNew
                    }
                }

                // borders
                if ($vmaFormulaGrid.reactiveData.borders && $vmaFormulaGrid.reactiveData.borders.length > 0) {
                    const bordersNew: Record<string, any>[] = []
                    $vmaFormulaGrid.reactiveData.borders.forEach((borderItem: any) => {
                        if (borderItem.hasOwnProperty('type') && (borderItem.type === 'rows' || borderItem.type === 'cells')) {
                            if (borderItem.type === 'rows' && borderItem.hasOwnProperty('p') && borderItem.p.length > 0) {
                                const posTemp: any[] = []
                                borderItem.p.forEach((borderItemPos: string | number) => {
                                    if (typeof borderItemPos === 'string' && borderItemPos.indexOf(':') >= 0) {
                                        let rowRangeArr: any[] = borderItemPos.split(':')
                                        rowRangeArr = rowRangeArr.map(Number)
                                        let rowStart = Math.min(...rowRangeArr)
                                        let rowEnd = Math.max(...rowRangeArr)
                                        if (row! + 1 <= rowStart) {
                                            rowStart += 1
                                            rowEnd += 1
                                        } else if (row! + 1 > rowStart && row! + 1 <= rowEnd) {
                                            rowEnd += 1
                                        }
                                        if (rowEnd >= rowStart) {
                                            posTemp.push('' + rowStart + ':' + rowEnd)
                                        }
                                    } else if (typeof borderItemPos === 'number') {
                                        if (row! + 1 <= borderItemPos) {
                                            posTemp.push(borderItemPos + 1)
                                        } else if (row! + 1 > borderItemPos) {
                                            posTemp.push(borderItemPos)
                                        }
                                    }
                                })
                                if (posTemp.length > 0) {
                                    bordersNew.push(Object.assign({}, borderItem, {p: posTemp}))
                                }
                            }
                            if (borderItem.type === 'cells' && borderItem.hasOwnProperty('p') && borderItem.p.length > 0) {
                                if (borderItem.p.indexOf(':') >= 0) {
                                    let cellRangeArr = borderItem.p.split(':')
                                    let cellPrev = cellRangeArr[0]
                                    let cellNext = cellRangeArr[1]
                                    let cellPrevColStr = cellPrev.replace(/[0-9]/g, '')
                                    let cellPrevRow = parseInt(cellPrev.replace(/[^0-9]/ig, ''))
                                    let cellNextColStr = cellNext.replace(/[0-9]/g, '')
                                    let cellNextRow = parseInt(cellNext.replace(/[^0-9]/ig, ''))
                                    if (row! + 1 <= Math.min(cellPrevRow, cellNextRow)) {
                                        cellPrevRow += 1
                                        cellNextRow += 1
                                    } else if ((row! + 1 > cellPrevRow && row! + 1 <= cellNextRow) || row! + 1 > cellNextRow && row! + 1 <= cellPrevRow) {
                                        if (cellNextRow > cellPrevRow) {
                                            cellNextRow += 1
                                        } else {
                                            cellPrevRow += 1
                                        }
                                    }
                                    bordersNew.push(Object.assign({}, borderItem, {p: cellPrevColStr + cellPrevRow + ':' + cellNextColStr + cellNextRow}))
                                } else {
                                    let cellColStr = borderItem.p.replace(/[0-9]/g, '')
                                    let cellRow = parseInt(borderItem.p.replace(/[^0-9]/ig, ''))
                                    if (row! + 1 <= cellRow) {
                                        cellRow += 1
                                        bordersNew.push(Object.assign({}, borderItem, {p: cellColStr + cellRow}))
                                    } else if (row! + 1 > cellRow) {
                                        bordersNew.push(Object.assign({}, borderItem, {p: cellColStr + cellRow}))
                                    }
                                }
                            }
                        } else if (borderItem.hasOwnProperty('type') && borderItem.type === 'columns') {
                            bordersNew.push(Object.assign({}, borderItem))
                        }
                    })
                    $vmaFormulaGrid.reactiveData.borders = bordersNew
                }

                const mergesNew: Record<string, any> = {}
                Object.keys(gridReactiveData.merges).map((key) => {
                    const crArr = key.split(':')
                    const crStartArr = crArr[0].split('_')
                    const crEndArr = crArr[1].split('_')
                    if (Number(crStartArr[1]) > row!) {
                        crStartArr[1] = (Number(crStartArr[1]) + 1).toString()
                        crEndArr[1] = (Number(crEndArr[1]) + 1).toString()
                    } else if (Number(crStartArr[1]) <= row! && row! < Number(crEndArr[1])) {
                        crEndArr[1] = (Number(crEndArr[1]) + 1).toString()
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
                h(resolveComponent('VmaFormulaGridCompColorPicker') as ComponentOptions, {
                    ref: refGridColorPicker,
                    onChange: (color: any) => {
                        if (gridReactiveData.colorPickerStore.selected && gridReactiveData.colorPickerStore.selected.code === 'backgroundColor') {
                            if (color.mode && color.mode === 'transparent') {
                                $vmaFormulaGrid.setBackgroundColor('cells', 'none', null)
                            } else {
                                $vmaFormulaGrid.setBackgroundColor('cells', 'normal', color.color.toHexString())
                            }
                        }
                        if (gridReactiveData.colorPickerStore.selected && gridReactiveData.colorPickerStore.selected.code === 'fontColor') {
                            if (color.mode && color.mode === 'transparent') {
                                $vmaFormulaGrid.setFontColor('cells', 'none', null)
                            } else {
                                $vmaFormulaGrid.setFontColor('cells', 'normal', color.color.toHexString())
                            }
                        }
                    }
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
                const colorPicker = refGridColorPicker.value
                if (
                    ctxMenuStore.visible &&
                    ctxMenu &&
                    !(DomTools.getEventTargetNode(event, ctxMenu).flag || DomTools.getEventTargetNode(event, colorPicker).flag)
                ) {
                    $vmaFormulaGrid.closeMenu()
                }
            }
        }

        const handleGlobalMousedownEvent = (event: MouseEvent) => {
            if ($vmaFormulaGrid.closeMenu) {
                const { ctxMenuStore } = gridReactiveData
                const ctxMenu = refGridContextMenu.value
                const colorPicker = refGridColorPicker.value
                if (
                    ctxMenuStore.visible &&
                    ctxMenu &&
                    !(DomTools.getEventTargetNode(event, ctxMenu).flag || DomTools.getEventTargetNode(event, colorPicker).flag)
                ) {
                    $vmaFormulaGrid.closeMenu()
                }
            }
        }

        const handleGlobalKeydownEvent = (event: KeyboardEvent) => {
            if ($vmaFormulaGrid.closeMenu) {
                const { ctxMenuStore } = gridReactiveData
                const ctxMenu = refGridContextMenu.value
                const colorPicker = refGridColorPicker.value
                if (
                    ctxMenuStore.visible &&
                    ctxMenu &&
                    !(DomTools.getEventTargetNode(event, ctxMenu).flag || DomTools.getEventTargetNode(event, colorPicker).flag)
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
                if (props.virtualScrollX) {
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

                    let { startColIndex: offsetStartColIndex, endColIndex: offsetEndColIndex } = offsetItem

                    offsetStartColIndex = Math.min(offsetStartColIndex, calcXOverlapMerges(offsetStartColIndex, $vmaFormulaGrid.reactiveData.merges, 'min'))
                    offsetEndColIndex = Math.max(offsetEndColIndex, calcXOverlapMerges(offsetEndColIndex, $vmaFormulaGrid.reactiveData.merges, 'max'))

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
                } else {
                    gridReactiveData.xStart = 0
                    gridReactiveData.xEnd = gridReactiveData.colConfs.length
                    gridReactiveData.lastScrollXVisibleIndex = 0
                    updateScrollXYSpace()
                }
                resolve()
            })

        const calcScrollSizeY = (scrollBodyElem: HTMLDivElement): Promise<void> =>
            new Promise((resolve): void => {
                if (!scrollBodyElem) {
                    resolve()
                }
                if (props.virtualScrollY) {
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

                    let {startIndex: offsetStartIndex, endIndex: offsetEndIndex} = offsetItem

                    offsetStartIndex = Math.min(offsetStartIndex, calcYOverlapMerges(offsetStartIndex, $vmaFormulaGrid.reactiveData.merges, 'min'))
                    offsetEndIndex = Math.max(offsetEndIndex, calcYOverlapMerges(offsetEndIndex, $vmaFormulaGrid.reactiveData.merges, 'max'))

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
                } else {
                    gridReactiveData.yStart = 0
                    gridReactiveData.yEnd = gridReactiveData.rowConfs.length - 1
                    gridReactiveData.lastScrollYVisibleIndex = 0
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

            gridReactiveData.gridWidth = Math.min(gridReactiveData.gridWidth, gridDivClientWidth)
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
            $vmaFormulaGrid.calcCurrentCellEditorStyle()
            $vmaFormulaGrid.calcCurrentCellEditorDisplay()
            $vmaFormulaGrid.updateCurrentAreaStyle()
        }

        const reset = (): Promise<void> => {
            return new Promise(resolve => {
                gridReactiveData.xDim = 0
                gridReactiveData.yDim = 0
                gridReactiveData.xStart = -1
                gridReactiveData.xEnd = 0
                gridReactiveData.yStart = 0
                gridReactiveData.yEnd = 0
                gridReactiveData.scrollbarWidth = 0
                gridReactiveData.scrollbarHeight = 0
                gridReactiveData.gridWidth = 0
                gridReactiveData.gridHeight = 0
                gridReactiveData.gridHeaderWidth = 0
                gridReactiveData.gridHeaderHeight = 0
                gridReactiveData.gridBodyWidth = 0
                gridReactiveData.gridBodyHeight = 0
                gridReactiveData.gridLeftFixedHeaderWidth = 0
                gridReactiveData.isOverflowX = false
                gridReactiveData.isOverflowY = false
                gridReactiveData.colConfs = []
                gridReactiveData.rowConfs = []
                gridReactiveData.currentSheetData = []
                gridReactiveData.rowHeightsChanged = {}
                gridReactiveData.columnWidthsChanged = {}
                gridReactiveData.rowHidesChanged = {}
                gridReactiveData.columnHidesChanged = {}
                gridReactiveData.columns = {
                    firstList: [],
                    leftList: [],
                    otherList: [],
                }
                gridReactiveData.lastScrollLeft = 0
                gridReactiveData.lastScrollLeftTime = 0
                gridReactiveData.lastScrollXVisibleIndex = 0
                gridReactiveData.lastScrollTop = 0
                gridReactiveData.lastScrollTopTime = 0
                gridReactiveData.lastScrollYVisibleIndex = 0
                gridReactiveData.cells = {
                    eMap: {},
                    cMap: {},
                    ncMap: {},
                }
                gridReactiveData.merges = {}
                gridReactiveData.currentCell = null
                gridReactiveData.currentCellBorderStyle = {
                    transform: 'translateX(0) translateY(0)',
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0
                }
                gridReactiveData.currentCellEditorStyle = {
                    transform: 'translateX(0) translateY(0)',
                    display: 'none',
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0
                }
                gridReactiveData.currentCellEditorActive = false
                gridReactiveData.currentCellEditorContent = null
                gridReactiveData.currentAreaStatus = false
                gridReactiveData.currentArea = {
                    start: null,
                    end: null
                }
                gridReactiveData.currentAreaBorderStyle = {
                    transform: 'translateX(0) translateY(0)',
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0
                }
                refGridBodyTable.value.style.transform = 'translateX(0) translateY(0)'
                refGridBodyLeftFixedTable.value.style.transform = 'translateY(0)'
                refGridHeaderTable.value.style.transform = 'translateX(0)'
                refGridBodyTableWrapperDiv.value.scrollLeft = 0
                refGridBodyTableWrapperDiv.value.scrollTop = 0
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
                                gridReactiveData.yDim = props.data.arrayData.length
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

                                let mergeColRows = []
                                Object.keys(gridReactiveData.merges).forEach((key: string) => {
                                    let mergesIntersectCol = false
                                    let mergesIntersectRow = false
                                    let startCol = [Math.min(colStart, colEnd),Math.min(gridReactiveData.merges[key].colStart, gridReactiveData.merges[key].colEnd)]
                                    let endCol = [Math.max(colStart, colEnd),Math.max(gridReactiveData.merges[key].colStart, gridReactiveData.merges[key].colEnd)]
                                    if (Math.max(...startCol) <= Math.min(...endCol)) {
                                        mergesIntersectCol = true
                                    }
                                    let startRow = [Math.min(rowStart, rowEnd),Math.min(gridReactiveData.merges[key].rowStart, gridReactiveData.merges[key].rowEnd)]
                                    let endRow = [Math.max(rowStart, rowEnd),Math.max(gridReactiveData.merges[key].rowStart, gridReactiveData.merges[key].rowEnd)]
                                    if (Math.max(...startRow) <= Math.min(...endRow)) {
                                        mergesIntersectRow = true
                                    }
                                    if (mergesIntersectCol && mergesIntersectRow) {
                                        mergeColRows.push(gridReactiveData.merges[key])
                                    }
                                })
                                if (mergeColRows.length === 0) {
                                    gridReactiveData.merges[`${colStart}_${rowStart}:${colEnd}_${rowEnd}`] = {
                                        colStart: colStart,
                                        colEnd: colEnd,
                                        colSpan: colEnd - colStart + 1,
                                        rowStart: rowStart,
                                        rowEnd: rowEnd,
                                        rowSpan: rowEnd - rowStart + 1
                                    }
                                }
                            }
                        })
                    }

                    if (props.data.hasOwnProperty('conf') && props.data.conf.hasOwnProperty('styles')) {
                        if (props.data.conf.styles.hasOwnProperty('bgc')) {
                            gridReactiveData.styles.bgc = props.data.conf.styles.bgc.concat([])
                        }
                        if (props.data.conf.styles.hasOwnProperty('fgc')) {
                            gridReactiveData.styles.fgc = props.data.conf.styles.fgc.concat([])
                        }
                    }

                    if (props.data.hasOwnProperty('conf') && props.data.conf.hasOwnProperty('borders')) {
                        if (props.data.conf.borders.length > 0) {
                            gridReactiveData.borders = props.data.conf.borders.concat([])
                        }
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
                                        cellData = colIndex - 1 < 0 ? null : props.data.arrayData[rowIndex][colIndex - 1]
                                    }
                                }
                            }

                            const {rowSpan, colSpan} = getRowColSpanFromMerges(colIndex, rowIndex + 1, gridReactiveData.merges)
                            const {fg, bg} = calcCellStyles(colIndex - 1, rowIndex, $vmaFormulaGrid.reactiveData.styles)
                            const {bdl: bdlCurrent, bdt: bdtCurrent, bdr: bdrCurrent, bdb: bdbCurrent} = calcCellBorders(colIndex - 1, rowIndex, gridReactiveData.borders, gridReactiveData.colConfs.length, gridReactiveData.rowConfs.length)
                            const bgt = calcCellBgType(bg.length > 0, bdlCurrent, bdtCurrent, bdrCurrent, bdbCurrent)
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
                                bgt,
                                bg,
                                fg,
                                bdlCurrent,
                                bdtCurrent,
                                bdrCurrent,
                                bdbCurrent,
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