import {
    ComponentOptions,
    createCommentVNode,
    defineComponent,
    h,
    inject,
    nextTick, onBeforeUnmount,
    onMounted,
    PropType,
    reactive,
    resolveComponent
} from "vue";
import {
    VmaFormulaGridBodyConstructor,
    VmaFormulaGridBodyMethods,
    VmaFormulaGridBodyPrivateMethods,
    VmaFormulaGridBodyPropTypes,
    VmaFormulaGridConstructor,
    VmaFormulaGridMethods,
    VmaFormulaGridPrivateMethods
} from "../../types";
import {Guid} from "../../utils/guid.ts";
import { checkCellInMerges } from "../../utils";

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

        onMounted(() => {
            nextTick(() => {
                if (props.fixed === 'left') {
                    refGridBodyTableWrapperDiv.value.onscroll = null
                    refGridBodyLeftFixedScrollWrapperDiv.value.onscroll = scrollEvent
                } else if (props.fixed === 'center') {
                    refGridBodyTableWrapperDiv.value.onscroll = scrollEvent
                    refGridBodyLeftFixedScrollWrapperDiv.value.onscroll = null
                }
            })
        })

        onBeforeUnmount(() => {
            if (refGridBodyTableWrapperDiv && refGridBodyTableWrapperDiv.value) {
                refGridBodyTableWrapperDiv.value.onscroll = null
            }
            if (refGridBodyLeftFixedScrollWrapperDiv && refGridBodyLeftFixedScrollWrapperDiv.value) {
                refGridBodyLeftFixedScrollWrapperDiv.value.onscroll = null
            }
        })

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
            refGridHeaderTableWrapperDiv,
        } = $vmaFormulaGrid.getRefs()

        const renderVN = () => h('div', {
                ref: props.fixed === 'center' ? refGridBodyTableWrapperDiv : refGridBodyLeftFixedTableWrapperDiv,
                class: ['body-wrapper'],
                ...{
                    'onWheel': wheelEvent,
                },
            },
            props.fixed === 'center' ?
                [
                    h('div', {
                        ref: refGridBodyXLineDiv,
                        style: {
                            float: 'left',
                            height: `1px`,
                            marginTop: `-1px`,
                        },
                    }),
                    h('div', {
                        ref: refGridBodyYLineDiv,
                        style: {
                            float: 'left',
                            width: `1px`,
                            marginLeft: `-1px`,
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
                            height: `${$vmaFormulaGrid.reactiveData.gridBodyHeight - $vmaFormulaGrid.reactiveData.scrollbarHeight}px`,
                        },
                    }, [
                        h('div', {
                            ref: refGridBodyLeftFixedYLineDiv,
                            style: {
                                float: 'left',
                                width: `1px`,
                                marginLeft: `-1px`,
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
                if ($vmaFormulaGrid.reactiveData.xStart !== -1) {
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
                    if (indexCol >= $vmaFormulaGrid.reactiveData.colConfs.length - 1) {
                        break
                    }
                    if (indexCol === -1) {
                        cols.push(
                            h(GridCellComponent, {
                                cat: 'row-indicator',
                                type: `${$vmaFormulaGrid.props.type}`,
                                row: rf.index,
                                col: -1,
                                'data-id': `${rf.index}_-1`,
                            })
                        )
                    } else {
                        const cf: any = $vmaFormulaGrid.reactiveData.colConfs[indexCol + 1]
                        if (!checkCellInMerges(cf.index + 1, rf.index + 1, $vmaFormulaGrid.reactiveData.merges)) {
                            cols.push(
                                h(GridCellComponent, {
                                    cat: 'normal',
                                    type: `${$vmaFormulaGrid.props.type}`,
                                    row: rf.index,
                                    col: cf.index,
                                    'data-id': `${rf.index}_${cf.index}`,
                                })
                            )
                        }
                    }
                }

                trs.push(
                    h(
                        'tr',
                        {
                            'data-row': index,
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
            if ($vmaFormulaGrid.reactiveData.xStart !== -1) {
                cols.push(
                    h('col', {
                        idx: -1,
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
                    })
                )
            }
            return cols
        }

        const scrollEvent = (event: Event) => {
            if (props.fixed === 'center') {
                refGridHeaderTableWrapperDiv.value.scrollLeft = refGridBodyTableWrapperDiv.value.scrollLeft
                refGridBodyLeftFixedScrollWrapperDiv.value.scrollTop = refGridBodyTableWrapperDiv.value.scrollTop
            } else if (props.fixed === 'left') {
                refGridBodyTableWrapperDiv.value.scrollTop = refGridBodyLeftFixedScrollWrapperDiv.value.scrollTop
            }
            $vmaFormulaGrid.triggerScrollXEvent(event)
            $vmaFormulaGrid.triggerScrollYEvent(event)
        }

        const wheelEvent = (_: WheelEvent) => {
            if (props.fixed === 'center') {
                refGridBodyTableWrapperDiv.value.onscroll = scrollEvent
                refGridBodyLeftFixedScrollWrapperDiv.value.onscroll = null
            } else if (props.fixed === 'left') {
                refGridBodyTableWrapperDiv.value.onscroll = null
                refGridBodyLeftFixedScrollWrapperDiv.value.onscroll = scrollEvent
            }
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