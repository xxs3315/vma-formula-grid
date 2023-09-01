import {
    ComponentOptions,
    createCommentVNode,
    defineComponent,
    h,
    inject,
    PropType,
    reactive,
    resolveComponent
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
} from "../../types";

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

        const GridCellComponent = resolveComponent('VmaFormulaGridCell') as ComponentOptions

        const gridHeaderReactiveData = reactive({})

        const {
            refGridHeaderTable,
            refGridHeaderTableWrapperDiv,
            refGridHeaderLeftFixedTable,
            refGridHeaderLeftFixedTableWrapperDiv,
            refGridHeaderTableColgroup,
            refGridHeaderLeftFixedTableColgroup,
            refGridHeaderLeftFixedXLineDiv,
            renderDefaultRowHeight
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
                                width: `${$vmaFormulaGrid.reactiveData.colConfs[index + 1].width}px`,
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
                    h(GridCellComponent, {
                        cat: 'grid-corner',
                        type: `${$vmaFormulaGrid.props.type}`,
                        row: 0,
                        col: -1,
                    })
                )
            }
            for (let index = $vmaFormulaGrid.reactiveData.xStart; index <= $vmaFormulaGrid.reactiveData.xEnd; index++) {
                if (index >= $vmaFormulaGrid.reactiveData.colConfs.length - 1) {
                    break
                }
                if (index === -1) {
                    cols.push(
                        h(GridCellComponent, {
                            cat: 'grid-corner',
                            type: `${$vmaFormulaGrid.props.type}`,
                            row: 0,
                            col: -1,
                        })
                    )
                } else {
                    const cf: any = $vmaFormulaGrid.reactiveData.colConfs[index + 1]
                    cols.push(
                        h(GridCellComponent, {
                            cat: 'column-indicator',
                            type: `${$vmaFormulaGrid.props.type}`,
                            row: 0,
                            col: cf.index,
                        })
                    )
                }
            }

            cols.concat(
                $vmaFormulaGrid.reactiveData.scrollbarWidth
                    ? [
                        h(GridCellComponent, {
                            cat: 'gutter-corner',
                            type: `${$vmaFormulaGrid.props.type}`,
                            row: 0,
                            col: $vmaFormulaGrid.reactiveData.colConfs.length,
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