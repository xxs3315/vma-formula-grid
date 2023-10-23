import {
    VmaFormulaGridCompContextMenuMethods,
    VmaFormulaGridCompContextMenuPrivateMethods,
    VmaFormulaGridGlobalHooksHandlers
} from "../../../types";
import {nextTick} from "vue";
import {DomTools, getAbsolutePos} from "../../utils/doms.ts";

const gridCtxMenuHook: VmaFormulaGridGlobalHooksHandlers.HookOptions = {
    setupGrid(grid): void | { [p: string]: any } {
        const { uId, reactiveData } = grid
        const { refGridContextMenu, refGridColorPicker, refGridDiv } = grid.getRefs()

        let ctxMenuMethods = {} as VmaFormulaGridCompContextMenuMethods
        let ctxMenuPrivateMethods = {} as VmaFormulaGridCompContextMenuPrivateMethods

        ctxMenuMethods = {
            closeMenu: () => {
                Object.assign(reactiveData.ctxMenuStore, {
                    visible: false,
                    selected: null,
                    selectChild: null,
                    showChild: false,
                    list: [],
                })
                Object.assign(reactiveData.colorPickerStore, {
                    selected: null,
                    visible: false,
                    selectValue: null,
                })
                return nextTick()
            }
        }

        ctxMenuPrivateMethods = {
            ctxMenuLinkEvent(_: any, menu: any): void {
                if (menu && !menu.disabled) {
                    if (menu.code === 'insertColumn') {
                        grid.insertColumn(
                            Number(menu.param.col),
                        )
                    }
                    if (menu.code === 'insertRow') {
                        grid.insertRow(
                            Number(menu.param.row),
                        )
                    }
                    if (menu.code === 'hideColumn') {
                        grid.hideColumn(
                            Number(menu.param.col),
                        )
                    }
                    if (menu.code === 'hideRow') {
                        grid.hideRow(
                            Number(menu.param.row),
                        )
                    }
                    if (menu.code === 'deleteColumn') {
                        grid.deleteColumn(
                            Number(menu.param.col),
                        )
                    }
                    if (menu.code === 'deleteRow') {
                        grid.deleteRow(
                            Number(menu.param.row),
                        )
                    }
                    if (menu.code === 'borderLeft') {
                        grid.setCellBorder('cells', 'l')
                    }
                    if (menu.code === 'borderTop') {
                        grid.setCellBorder('cells', 't')
                    }
                    if (menu.code === 'borderRight') {
                        grid.setCellBorder('cells', 'r')
                    }
                    if (menu.code === 'borderBottom') {
                        grid.setCellBorder('cells', 'b')
                    }
                    if (menu.code === 'borderInner') {
                        grid.setCellBorder('cells', 'inner')
                    }
                    if (menu.code === 'borderOuter') {
                        grid.setCellBorder('cells', 'outer')
                    }
                    if (menu.code === 'borderFull') {
                        grid.setCellBorder('cells', 'full')
                    }
                    if (menu.code === 'borderNone') {
                        grid.setCellBorder('cells', 'none')
                    }
                    if (menu.code === 'backgroundColor') {
                        grid.setBackgroundColor('cells')
                    }
                }
                if (ctxMenuMethods.closeMenu) {
                    ctxMenuMethods.closeMenu()
                }
            },
            ctxMenuMouseoutEvent(_: any, option: any): void {
                const { ctxMenuStore } = reactiveData
                if (!option.children) {
                    ctxMenuStore.selected = null
                }
                ctxMenuStore.selectChild = null
            },
            ctxMenuMouseoverEvent(event: any, option: any, child?: any): void {
                const menuElem = event.currentTarget
                if (option.type && option.type === 'colorPicker') {
                    const { ctxMenuStore } = reactiveData
                    event.preventDefault()
                    event.stopPropagation()

                    ctxMenuStore.selected = option
                    ctxMenuStore.selectChild = null

                    const { scrollTop, scrollLeft } = DomTools.getDomNode()
                    const {
                        boundingTop,
                        boundingLeft,
                    } = getAbsolutePos(menuElem)
                    const posTop = boundingTop
                    const posLeft = boundingLeft + menuElem.offsetWidth
                    const top = posTop + scrollTop - 4
                    const left = posLeft + scrollLeft + 4
                    Object.assign(reactiveData.colorPickerStore, {
                        visible: true,
                        selected: option,
                        selectValue: null,
                        style: {
                            top: `${top}px`,
                            left: `${left}px`,
                        },
                    })
                    nextTick(() => {
                        const { scrollTop, scrollLeft, visibleHeight, visibleWidth } =
                            DomTools.getDomNode()
                        const { boundingTop: menuBoundingTop, boundingLeft: menuBoundingLeft } = getAbsolutePos(menuElem)
                        const top = menuBoundingTop + scrollTop
                        const left = menuBoundingLeft + scrollLeft
                        const colorPickerElem = refGridColorPicker.value
                        const clientHeight = colorPickerElem.clientHeight
                        const clientWidth = colorPickerElem.clientWidth
                        const { boundingTop, boundingLeft } = getAbsolutePos(colorPickerElem)
                        const offsetTop = boundingTop + clientHeight - visibleHeight
                        const offsetLeft = boundingLeft + clientWidth - visibleWidth
                        if (offsetTop > -10) {
                            reactiveData.colorPickerStore.style.top = `${Math.max(
                                scrollTop + 2,
                                top - clientHeight - 2,
                            )}px`
                        }
                        if (offsetLeft > -10) {
                            reactiveData.colorPickerStore.style.left = `${Math.max(
                                scrollLeft + 2,
                                left - clientWidth - 2,
                            )}px`
                        }
                    })
                } else {
                    const { ctxMenuStore, colorPickerStore } = reactiveData
                    event.preventDefault()
                    event.stopPropagation()
                    ctxMenuStore.selected = option
                    ctxMenuStore.selectChild = child
                    colorPickerStore.visible = false
                    if (!child) {
                        ctxMenuStore.showChild =
                            option && option.children && option.children.length > 0
                        if (ctxMenuStore.showChild) {
                            nextTick(() => {
                                const childWrapperElem = menuElem.nextElementSibling
                                if (childWrapperElem) {
                                    const {
                                        boundingTop,
                                        boundingLeft,
                                        visibleHeight,
                                        visibleWidth,
                                    } = getAbsolutePos(menuElem)
                                    const posTop = boundingTop + menuElem.offsetHeight
                                    const posLeft = boundingLeft + menuElem.offsetWidth
                                    let left = ''
                                    let right = ''
                                    // 是否超出右侧
                                    if (posLeft + childWrapperElem.offsetWidth > visibleWidth - 10) {
                                        left = 'auto'
                                        right = `${menuElem.offsetWidth}px`
                                    }
                                    // 是否超出底部
                                    let top = ''
                                    let bottom = ''
                                    if (posTop + childWrapperElem.offsetHeight > visibleHeight - 10) {
                                        top = 'auto'
                                        bottom = '0'
                                    }
                                    childWrapperElem.style.left = left
                                    childWrapperElem.style.right = right
                                    childWrapperElem.style.top = top
                                    childWrapperElem.style.bottom = bottom
                                }
                            })
                        }
                    }
                }
            },
            handleContextmenuEvent: (event: any): void => {
                const refGridDivElem = refGridDiv.value

                const columnTargetNode = DomTools.getEventTargetNode(
                    event,
                    refGridDivElem,
                    `column-indicator`,
                    (target: any) => {
                        const elem = target.parentNode.parentNode.parentNode.parentNode
                        return elem !== document && elem.getAttribute('data-uid') === uId
                    },
                )

                const rowTargetNode = DomTools.getEventTargetNode(
                    event,
                    refGridDivElem,
                    `row-indicator`,
                    (target: any) => {
                        const elem =
                            target.parentNode.parentNode.parentNode.parentNode.parentNode
                        return elem !== document && elem.getAttribute('data-uid') === uId
                    },
                )

                const cellTargetNode = DomTools.getEventTargetNode(
                    event,
                    refGridDivElem,
                    `normal`,
                    (target: any) => {
                        const elem: any = target.parentNode.parentNode.parentNode.parentNode
                        return elem !== document && elem.getAttribute('data-uid') === uId
                    },
                )

                //
                // const cornerTargetNode = DomTools.getEventTargetNode(
                //     event,
                //     refGridDivElem,
                //     `grid-corner`,
                //     (target: any) => {
                //         const elem = target.parentNode.parentNode.parentNode.parentNode
                //         return elem !== document && elem.getAttribute('data-uid') === uId
                //     },
                // )
                //
                // const cellTargetNode = DomTools.getEventTargetNode(
                //     event,
                //     refGridDivElem,
                //     `normal`,
                //     (target: any) => {
                //         const elem: any = target.parentNode.parentNode.parentNode.parentNode
                //         return elem !== document && elem.getAttribute('data-uid') === uId
                //     },
                // )

                if (columnTargetNode.flag) {
                    openCtxMenu(event, 'column-indicator', {
                        row: columnTargetNode.targetElem.getAttribute('data-row'),
                        col: columnTargetNode.targetElem.getAttribute('data-col'),
                    })
                }

                if (rowTargetNode.flag) {
                    openCtxMenu(event, 'row-indicator', {
                        row: rowTargetNode.targetElem.getAttribute('data-row'),
                        col: rowTargetNode.targetElem.getAttribute('data-col'),
                    })
                }

                if (cellTargetNode.flag) {
                    openCtxMenu(event, 'cell', null)
                }
            },
        }

        const openCtxMenu = (
            event: any,
            type: 'column-indicator' | 'row-indicator' | 'grid-corner' | 'cell',
            param: any,
        ) => {
            const list = []
            if (type === 'column-indicator') {
                let options = []
                options.push({name: '插入', code: 'insertColumn', disabled: false, visible: true, param,})
                list.push(options)
                // options = []
                // options.push({ name: '固定', code: 'fixedColumn', disabled: false, visible: true, param, })
                // list.push(options)
                options = []
                options.push({name: '隐藏', code: 'hideColumn', disabled: false, visible: true, param,})
                list.push(options)
                options = []
                options.push({name: '删除', code: 'deleteColumn', disabled: false, visible: true, param,})
                list.push(options)
            }
            if (type === 'row-indicator') {
                let options = []
                options.push({name: '插入', code: 'insertRow', disabled: false, visible: true, param,})
                list.push(options)
                // options = []
                // options.push({ name: '固定', code: 'fixedRow', disabled: false, visible: true, param, })
                // list.push(options)
                options = []
                options.push({name: '隐藏', code: 'hideRow', disabled: false, visible: true, param,})
                list.push(options)
                options = []
                options.push({name: '删除', code: 'deleteRow', disabled: false, visible: true, param,})
                list.push(options)
            }
            if (type === 'cell') {
                let options = []
                let subOptions: any = []
                subOptions.push({name: '无框线', code: 'borderNone', disabled: false, visible: true, param,})
                subOptions.push({name: '所有框线', code: 'borderFull', disabled: false, visible: true, param,})
                subOptions.push({name: '外侧框线', code: 'borderOuter', disabled: false, visible: true, param,})
                subOptions.push({name: '内部框线', code: 'borderInner', disabled: false, visible: true, param,})
                subOptions.push({name: '下框线', code: 'borderBottom', disabled: false, visible: true, param,})
                subOptions.push({name: '上框线', code: 'borderTop', disabled: false, visible: true, param,})
                subOptions.push({name: '左框线', code: 'borderLeft', disabled: false, visible: true, param,})
                subOptions.push({name: '右框线', code: 'borderRight', disabled: false, visible: true, param,})
                options.push({name: '边框', prefixIcon: 'info', code: 'cellBorder', disabled: false, visible: true, children: subOptions, param,})
                list.push(options)
                options = []
                subOptions = []
                options.push({name: '字体颜色', prefixIcon: 'info', code: 'fontColor', disabled: false, visible: true, children: subOptions, param, type: 'colorPicker'})
                list.push(options)
                options = []
                subOptions = []
                options.push({name: '填充颜色', prefixIcon: 'info', code: 'backgroundColor', disabled: false, visible: true, children: subOptions, param, type: 'colorPicker'})
                list.push(options)
            }

            event.preventDefault()

            const { scrollTop, scrollLeft } = DomTools.getDomNode()
            const top = event.clientY + scrollTop
            const left = event.clientX + scrollLeft
            Object.assign(reactiveData.ctxMenuStore, {
                visible: true,
                selected: null,
                list,
                selectChild: null,
                showChild: false,
                style: {
                    top: `${top}px`,
                    left: `${left}px`,
                },
            })
            nextTick(() => {
                const { scrollTop, scrollLeft, visibleHeight, visibleWidth } =
                    DomTools.getDomNode()
                const top = event.clientY + scrollTop
                const left = event.clientX + scrollLeft
                const ctxElem = refGridContextMenu.value
                const clientHeight = ctxElem.clientHeight
                const clientWidth = ctxElem.clientWidth
                const { boundingTop, boundingLeft } = getAbsolutePos(ctxElem)
                const offsetTop = boundingTop + clientHeight - visibleHeight
                const offsetLeft = boundingLeft + clientWidth - visibleWidth
                if (offsetTop > -10) {
                    reactiveData.ctxMenuStore.style.top = `${Math.max(
                        scrollTop + 2,
                        top - clientHeight - 2,
                    )}px`
                }
                if (offsetLeft > -10) {
                    reactiveData.ctxMenuStore.style.left = `${Math.max(
                        scrollLeft + 2,
                        left - clientWidth - 2,
                    )}px`
                }
            })
        }

        return {...ctxMenuMethods, ...ctxMenuPrivateMethods}
    }
}

export default gridCtxMenuHook