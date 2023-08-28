import {
    ComponentOptions,
    createCommentVNode,
    defineComponent,
    h,
    inject,
    nextTick,
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
            renderDefaultColWidth,
            refGridHeaderTableWrapperDiv,
        } = $vmaFormulaGrid.getRefs()

        const renderVN = () => h('div', {
                ref: props.fixed === 'center' ? refGridBodyTableWrapperDiv : refGridBodyLeftFixedTableWrapperDiv,
                class: ['body-wrapper'],
                ...{
                    'onWheel.passive': wheelEvent,
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
                            // width: `${$vmaFormulaGrid.reactiveData.gridLeftFixedBodyWidth}px`,
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
                        cols.push(
                            h(GridCellComponent, {
                                cat: 'normal',
                                type: `${$vmaFormulaGrid.props.type}`,
                                row: rf.index,
                                col: cf.index,
                                'data-id': `${rf.index}_${cf.index}`,
                                // cf: $vmaFormulaGrid.reactiveData.currentSheetData[rf.index][cf.index - 1].cf,
                            })
                        )
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

        const wheelEvent = (wheelEvent: WheelEvent) => {
            if (props.fixed === 'center') {
                refGridBodyTableWrapperDiv.value.onscroll = scrollEvent
                refGridBodyLeftFixedScrollWrapperDiv.value.onscroll = null
            } else if (props.fixed === 'left') {
                refGridBodyTableWrapperDiv.value.onscroll = null
                refGridBodyLeftFixedScrollWrapperDiv.value.onscroll = scrollEvent
            }

            const { deltaX, deltaY } = wheelEvent
            const isWheelUp = deltaY < 0
            const isWheelLeft = deltaX < 0
            const scrollBodyElement = props.fixed === 'left' ? refGridBodyLeftFixedTableWrapperDiv.value : refGridBodyTableWrapperDiv.value

            let returnY = false
            if (deltaX === 0 && isWheelUp ? scrollBodyElement.scrollTop <= 0 : scrollBodyElement.scrollTop >= scrollBodyElement.scrollHeight - scrollBodyElement.clientHeight - 20 * renderDefaultRowHeight.value) {
                returnY = true
            }
            let returnX = false
            if (deltaY === 0 && isWheelLeft ? scrollBodyElement.scrollLeft <= 0 : scrollBodyElement.scrollLeft >= scrollBodyElement.scrollWidth - scrollBodyElement.clientWidth - 20 * renderDefaultColWidth.value) {
                returnX = true
            }

            if (returnX && returnY) {
                return
            }

            if (!returnX) {
                const { lastScrollLeft } = $vmaFormulaGrid.reactiveData
                const scrollLeft = scrollBodyElement.scrollLeft + deltaX
                const isRollX = scrollLeft !== lastScrollLeft
                if (isRollX) {
                    wheelEvent.preventDefault()
                    $vmaFormulaGrid.reactiveData.lastScrollLeft = scrollLeft
                    $vmaFormulaGrid.reactiveData.lastScrollLeftTime = Date.now()
                    handleWheelX(wheelEvent, deltaX, isWheelLeft)
                    $vmaFormulaGrid.triggerScrollXEvent(wheelEvent)
                }
            }

            if (!returnY) {
                const { lastScrollTop } = $vmaFormulaGrid.reactiveData
                const scrollTop = scrollBodyElement.scrollTop + deltaY
                const isRollY = scrollTop !== lastScrollTop
                if (isRollY) {
                    wheelEvent.preventDefault()
                    $vmaFormulaGrid.reactiveData.lastScrollTop = scrollTop
                    $vmaFormulaGrid.reactiveData.lastScrollTopTime = Date.now()
                    handleWheelY(wheelEvent, deltaY, isWheelUp)
                    $vmaFormulaGrid.triggerScrollYEvent(wheelEvent)
                }
            }
        }

        let wheelTime: any
        let wheelXSize = 0
        let wheelXInterval = 0
        let wheelXTotal = 0
        let isPrevWheelX = false
        let wheelYSize = 0
        let wheelYInterval = 0
        let wheelYTotal = 0
        let isPrevWheelY = false

        const handleWheelY = (_: WheelEvent, deltaY: number, isWheelUp: boolean) => {
            const remainSize = isPrevWheelY === isWheelUp ? Math.max(0, wheelYSize - wheelYTotal) : 0
            isPrevWheelY = isWheelUp
            wheelYSize = Math.abs(isWheelUp ? deltaY - remainSize : deltaY + remainSize)
            wheelYInterval = 0
            wheelYTotal = 0
            clearTimeout(wheelTime)
            const handleSmooth = () => {
                if (wheelYTotal < wheelYSize) {
                    wheelYInterval = Math.max(5, Math.floor(wheelYInterval * 1.5))
                    wheelYTotal += wheelYInterval
                    if (wheelYTotal > wheelYSize) {
                        wheelYInterval -= wheelYTotal - wheelYSize
                    }
                    const { scrollTop, clientHeight, scrollHeight } = refGridBodyTableWrapperDiv.value
                    const targetTop = scrollTop + wheelYInterval * (isWheelUp ? -1 : 1)
                    refGridBodyTableWrapperDiv.value.scrollTop = targetTop
                    refGridBodyLeftFixedTableWrapperDiv.value.scrollTop = targetTop
                    if (isWheelUp ? targetTop < scrollHeight - clientHeight : targetTop >= 0) {
                        wheelTime = setTimeout(handleSmooth, 200)
                    }
                    // emit
                }
            }
            handleSmooth()
        }

        const handleWheelX = (_: WheelEvent, deltaX: number, isWheelLeft: boolean) => {
            const remainSize = isPrevWheelX === isWheelLeft ? Math.max(0, wheelXSize - wheelXTotal) : 0
            isPrevWheelX = isWheelLeft
            wheelXSize = Math.abs(isWheelLeft ? deltaX - remainSize : deltaX + remainSize)
            wheelXInterval = 0
            wheelXTotal = 0
            clearTimeout(wheelTime)
            const handleSmooth = () => {
                if (wheelXTotal < wheelXSize) {
                    wheelXInterval = Math.max(5, Math.floor(wheelXInterval * 1.5))
                    wheelXTotal += wheelXInterval
                    if (wheelXTotal > wheelXSize) {
                        wheelXInterval -= wheelXTotal - wheelXSize
                    }
                    const { scrollLeft, clientWidth, scrollWidth } = refGridBodyTableWrapperDiv.value
                    const targetLeft = scrollLeft + wheelXInterval * (isWheelLeft ? -1 : 1)
                    refGridBodyTableWrapperDiv.value.scrollLeft = targetLeft
                    if (isWheelLeft ? targetLeft < scrollWidth - clientWidth : targetLeft >= 0) {
                        wheelTime = setTimeout(handleSmooth, 200)
                    }
                    // emit
                }
            }
            handleSmooth()
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