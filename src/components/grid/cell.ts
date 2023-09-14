import {
    ComponentOptions,
    createCommentVNode,
    defineComponent,
    h,
    inject,
    nextTick,
    PropType,
    reactive,
    resolveComponent, useCssVars
} from "vue";
import {
    VmaFormulaGridCellConstructor,
    VmaFormulaGridCellMethods,
    VmaFormulaGridCellPrivateMethods,
    VmaFormulaGridCellPropTypes,
    VmaFormulaGridConstructor,
    VmaFormulaGridMethods,
    VmaFormulaGridPrivateMethods
} from "../../../types";
import {
    calcCellBgCustom,
    getColumnSymbol, getCurrentAreaHeight, getCurrentAreaWidth,
    getRenderDefaultColWidth,
    getRenderDefaultRowHeight,
    getXSpaceFromColumnWidths,
    getYSpaceFromRowHeights
} from "../../utils";
import {Guid} from "../../utils/guid.ts";
import {DomTools} from "../../utils/doms.ts";

export default defineComponent({
    name: 'VmaFormulaGridCell',
    props: {
        cat: {
            type: String as PropType<VmaFormulaGridCellPropTypes.Cat>,
            default: 'normal',
        },
        type: {
            type: String as PropType<VmaFormulaGridCellPropTypes.Type>,
            default: 'default',
        },
        row: {
            type: Number,
            required: true,
            default: 1,
        },
        col: {
            type: Number,
            required: true,
            default: 1,
        },
        rowSpan: {
            type: Number,
            default: 1,
        },
        colSpan: {
            type: Number,
            default: 1,
        }
    },
    setup(props, context) {
        const $vmaFormulaGrid = inject('$vmaFormulaGrid', {} as VmaFormulaGridConstructor & VmaFormulaGridMethods & VmaFormulaGridPrivateMethods);

        const GridCompIconComponent = resolveComponent('VmaFormulaGridCompIcon') as ComponentOptions

        useCssVars(() =>
            props.cat === 'normal' && props.col >= 0
                ? {
                    cellBgType: currentSheetData[props.row!][props.col! + 1].bgt,
                    cellBgCustom: currentSheetData[props.row!][props.col! + 1].bg,
                }
                : { cellBgType: '', cellBgCustom: '' },
        )

        const gridCellReactiveData = reactive({})

        const {
            refGridBodyTable,
            refGridHeaderTableWrapperDiv,
            refGridBodyLeftFixedTableWrapperDiv,
            refColumnResizeBarDiv,
            refRowResizeBarDiv,
            renderDefaultColWidth,
            renderDefaultRowHeight,
            refCurrentCellEditor
        } = $vmaFormulaGrid.getRefs()

        const {currentSheetData} = $vmaFormulaGrid.reactiveData

        const renderCellContentWithFormat = () => {
            const c = currentSheetData[props.row][props.col + 1]
            // TODO 加入数据格式处理
            return c.mv
        }

        const getCellContent = () => {
            const c = currentSheetData[props.row][props.col + 1]
            if (c && c.v) {
                return renderCellContentWithFormat()
            }
            return null
        }

        const renderCellContent = () => {
            let text = ''
            if (props.cat === 'column-indicator') {
                text = getColumnSymbol(props.col.valueOf() + 1)
            }
            if (props.cat === 'row-indicator') {
                text = (props.row + 1).toString()
            }
            if (props.cat === 'normal') {
                text = getCellContent()
            }
            return h(
                'span',
                {
                    class: ['cell-content'],
                },
                text
            )
        }

        const renderCell = () => {
            if (props.cat === 'row-indicator') {
                return [
                    h(
                        'div',
                        {
                            class: ['cell', `${props.type}`],
                            style: {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            },
                        },
                        renderCellContent()
                    ),
                    $vmaFormulaGrid.props.rowResizable
                        ? h('div', {
                            class: ['row-resize-handler', `${props.type}`],
                            onMousedown: (event: MouseEvent) => {
                                resizeRowMousedown(event)
                                event.stopPropagation()
                            },
                        })
                        : createCommentVNode(),
                    h(
                        'div',
                        {
                            style: {
                                display:
                                    $vmaFormulaGrid.reactiveData.rowHidesChanged &&
                                    Object.keys($vmaFormulaGrid.reactiveData.rowHidesChanged).length > 0 &&
                                    $vmaFormulaGrid.reactiveData.rowHidesChanged.hasOwnProperty(`${props.row}`)
                                        ? 'block'
                                        : 'none',
                            },
                            class: ['row-hide-info-upward'],
                            onClick: (event: MouseEvent) => {
                                const elem = event.target as HTMLDivElement
                                const targetElem: any = elem.parentElement!.parentElement!
                                $vmaFormulaGrid.updateRowVisible(
                                    'showUpRows',
                                    targetElem.attributes['data-row'].value,
                                    targetElem.attributes['data-row'].value
                                )
                            },
                        },
                        h(GridCompIconComponent, {
                            name: 'ellipsis-v',
                            size: $vmaFormulaGrid.props.size,
                            scaleX: 0.7,
                            scaleY: 0.7
                        })
                    ),
                    h(
                        'div',
                        {
                            style: {
                                display:
                                    $vmaFormulaGrid.reactiveData.rowHidesChanged &&
                                    Object.keys($vmaFormulaGrid.reactiveData.rowHidesChanged).length > 0 &&
                                    $vmaFormulaGrid.reactiveData.rowHidesChanged.hasOwnProperty(`${props.row + 1 + 1}`)
                                        ? 'block'
                                        : 'none',
                            },
                            class: ['row-hide-info-downward'],
                            onClick: (event: MouseEvent) => {
                                const elem = event.target as HTMLDivElement
                                const targetElem: any = elem.parentElement!.parentElement!
                                $vmaFormulaGrid.updateRowVisible(
                                    'showDownRows',
                                    targetElem.attributes['data-row'].value,
                                    targetElem.attributes['data-row'].value
                                )
                            },
                        },
                        h(GridCompIconComponent, {
                            name: 'ellipsis-v',
                            size: $vmaFormulaGrid.props.size,
                            scaleX: 0.7,
                            scaleY: 0.7
                        })
                    ),
                ]
            }
            if (props.cat === 'column-indicator') {
                return [
                    h(
                        'div',
                        {
                            class: ['cell', `${props.type}`],
                            style: {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            },
                        },
                        renderCellContent()
                    ),
                    $vmaFormulaGrid.props.columnResizable
                        ? h('div', {
                            class: ['column-resize-handler', `${props.type}`],
                            onMousedown: (event: MouseEvent) => {
                                resizeColumnMousedown(event)
                                event.stopPropagation()
                            },
                        })
                        : createCommentVNode(),
                    h(
                        'div',
                        {
                            style: {
                                display:
                                    $vmaFormulaGrid.reactiveData.columnHidesChanged &&
                                    Object.keys($vmaFormulaGrid.reactiveData.columnHidesChanged).length > 0 &&
                                    $vmaFormulaGrid.reactiveData.columnHidesChanged.hasOwnProperty(`${props.col}`)
                                        ? 'block'
                                        : 'none',
                            },
                            class: ['column-hide-info-frontward'],
                            onClick: (event: MouseEvent) => {
                                const elem = event.target as HTMLDivElement
                                const targetElem: any = elem.parentElement!.parentElement!
                                $vmaFormulaGrid.updateColVisible(
                                    'showForwardCols',
                                    targetElem.attributes['data-col'].value,
                                    targetElem.attributes['data-col'].value
                                )
                            },
                        },
                        h(GridCompIconComponent, {
                            name: 'ellipsis-h',
                            size: $vmaFormulaGrid.props.size,
                            scaleX: 0.7,
                            scaleY: 0.7
                        })
                    ),
                    h(
                        'div',
                        {
                            style: {
                                display:
                                    $vmaFormulaGrid.reactiveData.columnHidesChanged &&
                                    Object.keys($vmaFormulaGrid.reactiveData.columnHidesChanged).length > 0 &&
                                    $vmaFormulaGrid.reactiveData.columnHidesChanged.hasOwnProperty(`${props.col + 1 + 1}`)
                                        ? 'block'
                                        : 'none',
                            },
                            class: ['column-hide-info-backward'],
                            onClick: (event: MouseEvent) => {
                                const elem = event.target as HTMLDivElement
                                const targetElem: any = elem.parentElement!.parentElement!
                                $vmaFormulaGrid.updateColVisible(
                                    'showBackwardCols',
                                    targetElem.attributes['data-col'].value,
                                    targetElem.attributes['data-col'].value
                                )
                            },
                        },
                        h(GridCompIconComponent, {
                            name: 'ellipsis-h',
                            size: $vmaFormulaGrid.props.size,
                            scaleX: 0.7,
                            scaleY: 0.7
                        })
                    ),
                ]
            }
            if (props.cat === 'grid-corner') {
                return [h('div', {class: ['cell', `${props.type}`]}, h('div', {class: ['corner']}))]
            }
            return h('div', {
                    class: ['cell', `${props.type}`],
                    style: {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',

                    },
                },
                renderCellContent())
        }

        const renderVN = () => {
            const c = currentSheetData[props.row][props.col + 1]
            return h(
                props.cat === 'normal' || props.cat === 'row-indicator' ? 'td' : 'th',
                {
                    rowspan: props.cat === 'normal' || props.cat === 'row-indicator' ? c.rowSpan : 1,
                    colspan: props.cat === 'normal' || props.cat === 'row-indicator' ? c.colSpan : 1,
                    'data-row': props.row,
                    'data-col': props.col,
                    class: [
                        props.cat,
                        `${props.type}`,
                        `cell-bg-${c.bgt}`,
                        {'column-indicator-active':
                                props.cat === 'column-indicator'
                                && $vmaFormulaGrid.reactiveData.currentArea.start !== null
                                && $vmaFormulaGrid.reactiveData.currentArea.end !== null
                                && (
                                    Math.min($vmaFormulaGrid.reactiveData.currentArea.start.col, $vmaFormulaGrid.reactiveData.currentArea.end.col) <= props.col
                                    && props.col <= Math.max($vmaFormulaGrid.reactiveData.currentArea.start.col, $vmaFormulaGrid.reactiveData.currentArea.end.col)
                                )
                        },
                        {'row-indicator-active':
                                props.cat === 'row-indicator'
                                && $vmaFormulaGrid.reactiveData.currentArea.start !== null
                                && $vmaFormulaGrid.reactiveData.currentArea.end !== null
                                && (
                                    Math.min($vmaFormulaGrid.reactiveData.currentArea.start.row, $vmaFormulaGrid.reactiveData.currentArea.end.row) <= props.row
                                    && props.row <= Math.max($vmaFormulaGrid.reactiveData.currentArea.start.row, $vmaFormulaGrid.reactiveData.currentArea.end.row)
                                )
                        },
                    ],
                    style: {
                        overflow: 'hidden',
                        height: c.rowSpan! > 1 ? '100%' : 'inherit',
                        width: c.colSpan! > 1 ? '100%' : 'inherit',
                    },
                    onMouseup: (_: MouseEvent) => {
                        $vmaFormulaGrid.reactiveData.currentAreaStatus = false
                        $vmaFormulaGrid.updateCurrentAreaStyle()
                    },
                    onMousedown: (event: MouseEvent) => {
                        if (props.cat === 'normal' && props.col >= 0) {
                            $vmaFormulaGrid.reactiveData.currentCellEditorActive = false
                            $vmaFormulaGrid.reactiveData.currentCell =
                                currentSheetData[props.row!][props.col! + 1]
                            $vmaFormulaGrid.reactiveData.currentCellEditorContent =
                                currentSheetData[props.row!][props.col! + 1].v

                            $vmaFormulaGrid.reactiveData.currentAreaStatus = true
                            $vmaFormulaGrid.reactiveData.currentArea = {
                                start: currentSheetData[props.row!][props.col! + 1],
                                end: currentSheetData[props.row!][props.col! + 1]
                            }
                            nextTick(() => {
                                resizeCurrentSelectArea(event)
                            })
                        }
                    },
                    onDblclick: (_: MouseEvent) => {
                        if (props.cat === 'normal' && props.col >= 0) {
                            $vmaFormulaGrid.reactiveData.currentCellEditorActive = true
                            nextTick(() => {
                                refCurrentCellEditor.value.$el
                                    .querySelectorAll(`textarea`)
                                    .forEach((elem: HTMLTextAreaElement) => {
                                        elem.focus()
                                    })
                            })
                        }
                    }
                },
                renderCell()
            )
        }

        const mousemoveHandler = (event: MouseEvent) => {
            const eventTargetNode: any = DomTools.getEventTargetNode(
                event,
                refGridBodyTable,
                `normal`,
                (target: any) =>
                    target.attributes.hasOwnProperty('data-row') &&
                    target.attributes.hasOwnProperty('data-col')
            )
            if (eventTargetNode && eventTargetNode.flag) {
                const targetElem: any = eventTargetNode.targetElem
                $vmaFormulaGrid.reactiveData.currentArea.end = currentSheetData[Number(targetElem.attributes['data-row'].value)][Number(targetElem.attributes['data-col'].value) + 1]
                $vmaFormulaGrid.updateCurrentAreaStyle()
            }
        }

        const resizeCurrentSelectArea = (event: MouseEvent) => {
            const domMousemove = document.onmousemove
            const domMouseup = document.onmouseup

            const updateEvent = (event: MouseEvent) => {
                event.stopPropagation()
                event.preventDefault()
                mousemoveHandler(event)
            }

            document.onmousemove = updateEvent

            document.onmouseup = (event: MouseEvent) => {
                document.onmousemove = domMousemove
                document.onmouseup = domMouseup
                const eventTargetNode: any = DomTools.getEventTargetNode(
                    event,
                    refGridBodyTable,
                    `normal`,
                    (target: any) =>
                        target.attributes.hasOwnProperty('data-row') &&
                        target.attributes.hasOwnProperty('data-col')
                )
                if (eventTargetNode && eventTargetNode.flag) {
                    const targetElem: any = eventTargetNode.targetElem
                    $vmaFormulaGrid.reactiveData.currentArea.end = currentSheetData[Number(targetElem.attributes['data-row'].value)][Number(targetElem.attributes['data-col'].value) + 1]
                    $vmaFormulaGrid.updateCurrentAreaStyle()
                }
            }
        }

        const resizeColumnMousedown = (event: MouseEvent) => {
            const {clientX: dragClientX} = event
            const domMousemove = document.onmousemove
            const domMouseup = document.onmouseup
            const dragBtnElem = event.target as HTMLDivElement
            const wrapperElem = refGridHeaderTableWrapperDiv.value
            const pos = DomTools.getOffsetPos(dragBtnElem, wrapperElem)
            const dragBtnWidth = dragBtnElem.clientWidth
            const columnWidth = getRenderDefaultColWidth($vmaFormulaGrid.props.defaultColumnWidth, $vmaFormulaGrid.props.size!)
            const leftSpaceWidth = getXSpaceFromColumnWidths(
                $vmaFormulaGrid.reactiveData.xStart,
                renderDefaultColWidth.value,
                $vmaFormulaGrid.reactiveData.columnWidthsChanged,
                $vmaFormulaGrid.reactiveData.columnHidesChanged
            )
            const dragBtnOffsetWidth = dragBtnWidth
            const dragPosLeft = pos.left + Math.floor(dragBtnOffsetWidth) + leftSpaceWidth
            const cell = dragBtnElem.parentNode as HTMLTableCellElement
            const dragMinLeft = Math.max(pos.left - cell.clientWidth + dragBtnOffsetWidth, 0)
            let dragLeft = 0
            const resizeBarElem = refColumnResizeBarDiv.value
            resizeBarElem.style.left = `${pos.left + dragBtnOffsetWidth + leftSpaceWidth}px`
            resizeBarElem.style.display = 'block'

            // 处理拖动事件
            const updateEvent = (event: MouseEvent) => {
                event.stopPropagation()
                event.preventDefault()
                const offsetX = event.clientX - dragClientX
                const left = dragPosLeft + offsetX
                dragLeft = Math.max(left, dragMinLeft)
                resizeBarElem.style.left = `${dragLeft}px`
            }

            document.onmousemove = updateEvent

            document.onmouseup = () => {
                document.onmousemove = domMousemove
                document.onmouseup = domMouseup
                resizeBarElem.style.display = 'none'
                if (dragBtnElem.parentElement!.getAttribute('data-col')) {
                    const columnConfig = $vmaFormulaGrid.reactiveData.colConfs.find(item => item.index === parseInt(dragBtnElem.parentElement!.getAttribute('data-col')!, 10))
                    if (columnConfig) {
                        columnConfig.width = Math.max(dragBtnElem.parentElement!.clientWidth + dragLeft - dragPosLeft, 6)
                        $vmaFormulaGrid.reactiveData.columnWidthsChanged[`${columnConfig.index + 1}`] = columnConfig.width
                        $vmaFormulaGrid.reactiveData.gridWidth += columnConfig.width - columnWidth
                    }
                }

                dragBtnElem.parentElement!.style.width = `${Math.max(dragBtnElem.parentElement!.clientWidth + dragLeft - dragPosLeft, 6)}px`
                $vmaFormulaGrid.recalculate(true).then(() => {
                    nextTick(() => {
                        $vmaFormulaGrid.calcCurrentCellEditorStyle()
                        $vmaFormulaGrid.calcCurrentCellEditorDisplay()
                        $vmaFormulaGrid.updateCurrentAreaStyle()
                    })
                })
            }
        }

        const resizeRowMousedown = (event: MouseEvent) => {
            const {clientY: dragClientY} = event
            const domMousemove = document.onmousemove
            const domMouseup = document.onmouseup
            const dragBtnElem = event.target as HTMLDivElement
            const wrapperElem = refGridBodyLeftFixedTableWrapperDiv.value
            const pos = DomTools.getOffsetPos(dragBtnElem, wrapperElem)
            const dragBtnHeight = dragBtnElem.clientHeight
            const rowHeight = getRenderDefaultRowHeight($vmaFormulaGrid.props.defaultRowHeight, $vmaFormulaGrid.props.size!)
            const topSpaceHeight = getYSpaceFromRowHeights(
                $vmaFormulaGrid.reactiveData.yStart,
                renderDefaultRowHeight.value,
                $vmaFormulaGrid.reactiveData.rowHeightsChanged,
                $vmaFormulaGrid.reactiveData.rowHidesChanged
            )
            const dragBtnOffsetHeight = dragBtnHeight
            const dragPosTop = pos.top + Math.floor(dragBtnOffsetHeight) + topSpaceHeight
            const cell = dragBtnElem.parentNode as HTMLTableCellElement
            const dragMinTop = Math.max(pos.top - cell.clientHeight + dragBtnOffsetHeight, 0)
            let dragTop = 0
            const resizeBarElem = refRowResizeBarDiv.value
            resizeBarElem.style.top = `${pos.top + refGridHeaderTableWrapperDiv.value.clientHeight + dragBtnOffsetHeight + topSpaceHeight}px`
            resizeBarElem.style.display = 'block'

            // 处理拖动事件
            const updateEvent = (event: MouseEvent) => {
                event.stopPropagation()
                event.preventDefault()
                const offsetY = event.clientY - dragClientY
                const top = dragPosTop + offsetY
                dragTop = Math.max(top, dragMinTop)
                resizeBarElem.style.top = `${dragTop + refGridHeaderTableWrapperDiv.value.clientHeight}px`
            }

            document.onmousemove = updateEvent

            document.onmouseup = () => {
                document.onmousemove = domMousemove
                document.onmouseup = domMouseup
                resizeBarElem.style.display = 'none'
                if (dragBtnElem.parentElement!.getAttribute('data-row')) {
                    const rowConfig = $vmaFormulaGrid.reactiveData.rowConfs.find(item => item.index === parseInt(dragBtnElem.parentElement!.getAttribute('data-row')!, 10))
                    if (rowConfig) {
                        rowConfig.height = Math.max(dragBtnElem.parentElement!.clientHeight + dragTop - dragPosTop, 6)
                        $vmaFormulaGrid.reactiveData.rowHeightsChanged[`${rowConfig.index + 1}`] = rowConfig.height
                        $vmaFormulaGrid.reactiveData.gridHeight += rowConfig.height - rowHeight
                    }
                }

                dragBtnElem.parentElement!.parentElement!.style.height = `${Math.max(dragBtnElem.parentElement!.clientHeight + dragTop - dragPosTop, 6)}px`
                $vmaFormulaGrid.recalculate(true).then(() => {
                    nextTick(() => {
                        $vmaFormulaGrid.calcCurrentCellEditorStyle()
                        $vmaFormulaGrid.calcCurrentCellEditorDisplay()
                        $vmaFormulaGrid.updateCurrentAreaStyle()
                    })
                })
            }
        }

        const $vmaFormulaGridCell = {
            uId: Guid.create().toString(),
            props,
            context,
            reactiveData: gridCellReactiveData,
            renderVN: renderVN,
        } as unknown as VmaFormulaGridCellConstructor & VmaFormulaGridCellMethods & VmaFormulaGridCellPrivateMethods

        console.log($vmaFormulaGridCell.uId)

        return $vmaFormulaGridCell
    },
    render() {
        return this.renderVN()
    },
})