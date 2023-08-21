import {ComponentOptions, createCommentVNode, defineComponent, resolveComponent} from "vue";
import {h, inject, PropType, reactive} from "vue";
import {
    VmaFormulaGridConstructor,
    VmaFormulaGridBodyConstructor,
    VmaFormulaGridBodyMethods,
    VmaFormulaGridBodyPrivateMethods,
    VmaFormulaGridBodyPropTypes,
    VmaFormulaGridMethods,
    VmaFormulaGridPrivateMethods
} from "./types/grid";
import {Guid} from "./utils/guid.ts";

export default defineComponent({
    name: 'VmaFormulaGridBody',
    props: {
        fixed: {
            type: String as PropType<VmaFormulaGridBodyPropTypes.Fixed>,
            default: 'center',
        },
    },
    setup(props, context) {

        const $vmaFormulaGrid = inject('$vmaFormulaGrid', {} as VmaFormulaGridConstructor & VmaFormulaGridMethods & VmaFormulaGridPrivateMethods);

        const GridCellComponent = resolveComponent('VmaFormulaGridCell') as ComponentOptions

        const gridBodyReactiveData = reactive({})

        const {
            refGridBodyTable,
            refGridBodyTableWrapperDiv,
            refGridBodyLeftFixedTable,
            refGridBodyLeftFixedTableWrapperDiv,
            refGridBodyXLineDiv,
            refGridBodyYLineDiv,
            refGridBodyLeftFixedXLineDiv,
            refGridBodyLeftFixedYLineDiv,
            refGridBodyLeftFixedScrollWrapperDiv,
            refGridBodyTableColgroup,
            refGridBodyLeftFixedTableColgroup,
            renderDefaultRowHeight,
        } = $vmaFormulaGrid.getRefs()

        const renderVN = () => h('div', {
                ref: props.fixed === 'center' ? refGridBodyTableWrapperDiv : refGridBodyLeftFixedTableWrapperDiv,
                class: ['body-wrapper'],
            },
            props.fixed === 'center' ?
                [
                    h('div', {
                        ref: refGridBodyXLineDiv,
                        style: {
                            float: 'left',
                            width: 0,
                        },
                    }),
                    h('div', {
                        ref: refGridBodyYLineDiv,
                        style: {
                            float: 'left',
                            height: `1px`,
                            marginTop: `-1px`,
                        },
                    }),
                    h(
                        'table',
                        {
                            ref: refGridBodyTable,
                            class: ['body'],
                        },
                        [
                            h(
                                'colgroup',
                                {
                                    ref: refGridBodyTableColgroup,
                                },
                                renderBodyColgroup()
                            ),
                            h('tbody', {}, renderBodyRows()),
                        ]
                    ),
                ] : (props.fixed === 'left' ?
                    h('div', {
                        ref: refGridBodyLeftFixedScrollWrapperDiv,
                        class: ['fixed-wrapper'],
                        style: {
                            // width: `${$vmaFormulaGrid.reactiveData.gridLeftFixedBodyWidth}px`,
                            height: `${$vmaFormulaGrid.reactiveData.gridBodyHeight - $vmaFormulaGrid.reactiveData.scrollbarHeight}px`,
                        },
                    }, [
                        h('div', {
                            ref: refGridBodyLeftFixedYLineDiv,
                            style: {
                                float: 'left',
                                width: 0,
                            },
                        }),
                        h('div', {
                            ref: refGridBodyLeftFixedXLineDiv,
                            style: {
                                float: 'left',
                                height: `1px`,
                                marginTop: `-1px`,
                            },
                        }),
                        h(
                            'table',
                            {
                                ref: refGridBodyLeftFixedTable,
                                class: ['body'],
                            },
                            [
                                h(
                                    'colgroup',
                                    {
                                        ref: refGridBodyLeftFixedTableColgroup,
                                    },
                                    renderBodyColgroup()
                                ),
                                h('tbody', {}, renderBodyRows()),
                            ]
                        ),
                    ])
                    : createCommentVNode())
        )

        const renderBodyRows = () => {
            const trs: any = []
            for (let index = $vmaFormulaGrid.reactiveData.yStart; index <= $vmaFormulaGrid.reactiveData.yEnd; index++) {
                if (index > $vmaFormulaGrid.reactiveData.rowConfs.length - 1) {
                    break
                }
                const rf: any = $vmaFormulaGrid.reactiveData.rowConfs[index]

                const cols: any = []
                if ($vmaFormulaGrid.reactiveData.xStart === -1) {
                    cols.push(
                        h(GridCellComponent, {
                            cat: 'row-indicator',
                            type: `${$vmaFormulaGrid.props.type}`,
                            row: rf.index,
                            col: -1,
                        })
                    )
                }
                for (let indexCol = $vmaFormulaGrid.reactiveData.xStart; indexCol <= $vmaFormulaGrid.reactiveData.xEnd; indexCol++) {
                    if (indexCol > $vmaFormulaGrid.reactiveData.colConfs.length - 1) {
                        break
                    }
                    if (indexCol === 0) {
                        cols.push(
                            h(GridCellComponent, {
                                cat: 'row-indicator',
                                type: `${$vmaFormulaGrid.props.type}`,
                                row: rf.index,
                                col: 0,
                                id: `${rf.index}_0`,
                            })
                        )
                    } else {
                        const cf: any = $vmaFormulaGrid.reactiveData.colConfs[indexCol + 1]
                        cols.push(
                            h(GridCellComponent, {
                                cat: 'normal',
                                type: `${$vmaFormulaGrid.props.type}`,
                                row: rf.index,
                                col: cf.index,
                                id: `${rf.index}_${cf.index}`,
                                // cf: $vmaFormulaGrid.reactiveData.currentSheetData[rf.index][cf.index - 1].cf,
                            })
                        )
                    }
                }

                trs.push(
                    h(
                        'tr',
                        {
                            row: index,
                            style: {
                                height: rf.visible ? (typeof rf.height === 'string' ? `${renderDefaultRowHeight.value}px` : `${rf.height}px`) : 0,
                            },
                        },
                        cols
                    )
                )
            }
            return trs
        }

        const renderBodyColgroup = () => {
            const cols: any = []
            if ($vmaFormulaGrid.reactiveData.xStart !== 0) {
                cols.push(
                    h('col', {
                        idx: 0,
                    })
                )
            }
            for (let index = $vmaFormulaGrid.reactiveData.xStart; index <= $vmaFormulaGrid.reactiveData.xEnd; index++) {
                if (index > $vmaFormulaGrid.reactiveData.colConfs.length - 1) {
                    break
                }
                cols.push(
                    h('col', {
                        idx: index,
                    })
                )
            }
            return cols
        }

        const $vmaFormulaGridBody = {
            uId: Guid.create().toString(),
            props,
            context,
            reactiveData: gridBodyReactiveData,
            renderVN: renderVN,
        } as unknown as VmaFormulaGridBodyConstructor & VmaFormulaGridBodyMethods & VmaFormulaGridBodyPrivateMethods

        return $vmaFormulaGridBody
    },
    render() {
        return this.renderVN()
    },
})