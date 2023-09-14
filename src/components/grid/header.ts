import {
    ComponentOptions,
    createCommentVNode,
    defineComponent,
    h,
    inject,
    PropType,
    reactive,
    resolveComponent,
    nextTick
} from "vue";
import {Guid} from "../../utils/guid.ts";
import {
    VmaFormulaGridConstructor,
    VmaFormulaGridMethods,
    VmaFormulaGridPrivateMethods,
    VmaFormulaGridHeaderConstructor,
    VmaFormulaGridHeaderMethods,
    VmaFormulaGridHeaderPrivateMethods,
    VmaFormulaGridHeaderPropTypes
} from "../../../types";
import {DomTools} from "../../utils/doms.ts";
import {getColumnSymbol, getRenderDefaultColWidth, getXSpaceFromColumnWidths} from "../../utils";

export default defineComponent({
    name: 'VmaFormulaGridHeader',
    props: {
        fixed: {
            type: String as PropType<VmaFormulaGridHeaderPropTypes.Fixed>,
            default: 'center',
        },
    },
    setup(props, context) {

        const $vmaFormulaGrid = inject('$vmaFormulaGrid', {} as VmaFormulaGridConstructor & VmaFormulaGridMethods & VmaFormulaGridPrivateMethods);

        const GridCompIconComponent = resolveComponent('VmaFormulaGridCompIcon') as ComponentOptions

        const gridHeaderReactiveData = reactive({})

        const {
            refGridHeaderTable,
            refGridHeaderTableWrapperDiv,
            refGridHeaderLeftFixedTable,
            refGridHeaderLeftFixedTableWrapperDiv,
            refGridHeaderTableColgroup,
            refGridHeaderLeftFixedTableColgroup,
            refGridHeaderLeftFixedXLineDiv,
            refColumnResizeBarDiv,
            renderDefaultRowHeight,
            renderDefaultColWidth
        } = $vmaFormulaGrid.getRefs()

        const renderHeaderColgroup = () => {
            const cols: any = []
            if ($vmaFormulaGrid.reactiveData.colConfs.length > 0) {
                if ($vmaFormulaGrid.reactiveData.xStart !== -1) {
                    cols.push(
                        h('col', {
                            idx: -1,
                            style: {
                                width: `${$vmaFormulaGrid.reactiveData.colConfs[0].width}px`,
                            },
                        })
                    )
                }
                for (let index = $vmaFormulaGrid.reactiveData.xStart; index <= $vmaFormulaGrid.reactiveData.xEnd; index++) {
                    if (index >= $vmaFormulaGrid.reactiveData.colConfs.length - 1) {
                        break
                    }
                    cols.push(
                        h('col', {
                            idx: index,
                            style: {
                                width: $vmaFormulaGrid.reactiveData.colConfs[index + 1].visible ? (typeof $vmaFormulaGrid.reactiveData.colConfs[index + 1].width === 'string' ? `${renderDefaultColWidth.value}px` : `${$vmaFormulaGrid.reactiveData.colConfs[index + 1].width}px`) : '0px',
                            },
                        })
                    )
                }
            }
            return cols
        }

        const renderHeaderRows = () => {
            const tr = []

            const cols: any = []
            if ($vmaFormulaGrid.reactiveData.xStart !== -1) {
                cols.push(
                    // h(GridCellComponent, {
                    //     cat: 'grid-corner',
                    //     type: `${$vmaFormulaGrid.props.type}`,
                    //     row: 0,
                    //     col: -1,
                    // })
                    h('th', {
                        'data-cat': 'grid-corner',
                        'data-type': `${$vmaFormulaGrid.props.type}`,
                        'data-row': 0,
                        'data-col': -1,
                        class: [
                            'grid-corner',
                            `${$vmaFormulaGrid.props.type}`
                        ]
                    })
                )
            }
            for (let index = $vmaFormulaGrid.reactiveData.xStart; index <= $vmaFormulaGrid.reactiveData.xEnd; index++) {
                if (index >= $vmaFormulaGrid.reactiveData.colConfs.length - 1) {
                    break
                }
                if (index === -1) {
                    cols.push(
                        h('th', {
                            'data-cat': 'grid-corner',
                            'data-type': `${$vmaFormulaGrid.props.type}`,
                            'data-row': 0,
                            'data-col': -1,
                            class: [
                                'grid-corner',
                                `${$vmaFormulaGrid.props.type}`
                            ]
                        })
                    )
                } else {
                    if (props.fixed === 'center') {
                        const cf: any = $vmaFormulaGrid.reactiveData.colConfs[index + 1]
                        cols.push(
                            h('th', {
                                'data-cat': 'column-indicator',
                                'data-type': `${$vmaFormulaGrid.props.type}`,
                                'data-row': 0,
                                'data-col': cf.index,
                                class: [
                                    'column-indicator',
                                    `${$vmaFormulaGrid.props.type}`
                                ]
                            }, [
                                h(
                                    'div',
                                    {
                                        class: ['cell', `${$vmaFormulaGrid.props.type}`],
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        },
                                    },
                                    getColumnSymbol(cf.index + 1)
                                ),
                                $vmaFormulaGrid.props.columnResizable
                                    ? h('div', {
                                        class: ['column-resize-handler', `${$vmaFormulaGrid.props.type}`],
                                        onMousedown: (event: MouseEvent) => {
                                            resizeColumnMousedown(event)
                                            event.stopPropagation()
                                        },
                                    })
                                    : createCommentVNode(),
                                $vmaFormulaGrid.reactiveData.columnHidesChanged &&
                                Object.keys($vmaFormulaGrid.reactiveData.columnHidesChanged).length > 0 &&
                                $vmaFormulaGrid.reactiveData.columnHidesChanged.hasOwnProperty(`${cf.index}`) ?
                                h(
                                    'div',
                                    {
                                        // style: {
                                        //     display:
                                        //         $vmaFormulaGrid.reactiveData.columnHidesChanged &&
                                        //         Object.keys($vmaFormulaGrid.reactiveData.columnHidesChanged).length > 0 &&
                                        //         $vmaFormulaGrid.reactiveData.columnHidesChanged.hasOwnProperty(`${cf.index}`)
                                        //             ? 'block'
                                        //             : 'none',
                                        // },
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
                                ) : createCommentVNode(),
                                $vmaFormulaGrid.reactiveData.columnHidesChanged &&
                                Object.keys($vmaFormulaGrid.reactiveData.columnHidesChanged).length > 0 &&
                                $vmaFormulaGrid.reactiveData.columnHidesChanged.hasOwnProperty(`${cf.index + 1 + 1}`) ?
                                h(
                                    'div',
                                    {
                                        // style: {
                                        //     display:
                                        //         $vmaFormulaGrid.reactiveData.columnHidesChanged &&
                                        //         Object.keys($vmaFormulaGrid.reactiveData.columnHidesChanged).length > 0 &&
                                        //         $vmaFormulaGrid.reactiveData.columnHidesChanged.hasOwnProperty(`${cf.index + 1 + 1}`)
                                        //             ? 'block'
                                        //             : 'none',
                                        // },
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
                                ) : createCommentVNode(),
                            ])
                        )
                    }
                }
            }

            cols.concat(
                $vmaFormulaGrid.reactiveData.scrollbarWidth
                    ? [
                        h('th', {
                            'data-cat': 'gutter-corner',
                            'data-type': `${$vmaFormulaGrid.props.type}`,
                            'data-row': 0,
                            'data-col': $vmaFormulaGrid.reactiveData.colConfs.length,
                            class: [
                                'gutter-corner',
                                `${$vmaFormulaGrid.props.type}`
                            ]
                        }),
                    ]
                    : createCommentVNode()
            )

            tr.push(
                h(
                    'tr',
                    {
                        style: {
                            height: `${renderDefaultRowHeight.value}px`,
                        },
                    },
                    cols
                )
            )

            /*const headerRowCounts = getHeaderRowCounts($vmaFormulaGrid.reactiveData.sheetHeaderData)

            if (headerRowCounts > 1) {
                const result = []
                result.push(tr)
                for (let i = 0; i < headerRowCounts - 1; i++) {
                    const trCopy = Array.from(tr)
                    result.push(trCopy)
                }
                return result
            }*/

            return tr
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

        const renderVN = () => h('div', {
            ref: props.fixed === 'center' ? refGridHeaderTableWrapperDiv : refGridHeaderLeftFixedTableWrapperDiv,
            class: ['header-wrapper', `${$vmaFormulaGrid.props.type}`],
        }, [
            h('div', {
                ref: refGridHeaderLeftFixedXLineDiv,
                style: {
                    float: 'left',
                    height: `1px`,
                    marginTop: `-1px`,
                },
            }),
            h('table', {
                ref: props.fixed === 'center' ? refGridHeaderTable : refGridHeaderLeftFixedTable,
                class: ['header', `${$vmaFormulaGrid.props.type}`],
            }, [
                h('colgroup', {
                        ref: props.fixed === 'center' ? refGridHeaderTableColgroup : refGridHeaderLeftFixedTableColgroup
                    },
                    renderHeaderColgroup().concat(
                        $vmaFormulaGrid.reactiveData.scrollbarWidth
                            ? [
                                h('col', {
                                    idx: $vmaFormulaGrid.reactiveData.colConfs.length - 1,
                                    style: {
                                        width: `${$vmaFormulaGrid.reactiveData.scrollbarWidth}px`,
                                    },
                                }),
                            ]
                            : [createCommentVNode()]
                    )),
                h('thead', {
                    class: [`${$vmaFormulaGrid.props.type}`],
                }, renderHeaderRows())
            ])
        ])

        const $vmaFormulaGridHeader = {
            uId: Guid.create().toString(),
            props,
            context,
            reactiveData: gridHeaderReactiveData,
            renderVN: renderVN,
        } as unknown as VmaFormulaGridHeaderConstructor & VmaFormulaGridHeaderMethods & VmaFormulaGridHeaderPrivateMethods

        return $vmaFormulaGridHeader
    },
    render() {
        return this.renderVN()
    },
})