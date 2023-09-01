import {
    VmaFormulaGridCompContextMenuMethods,
    VmaFormulaGridCompContextMenuPrivateMethods,
    VmaFormulaGridGlobalHooksHandlers
} from "../../types";
import {nextTick} from "vue";
import {DomTools} from "../../utils/doms.ts";

const gridCtxMenuHook: VmaFormulaGridGlobalHooksHandlers.HookOptions = {
    setupGrid(grid): void | { [p: string]: any } {
        const { uId, reactiveData } = grid
        const { refGridContextMenu, refGridDiv } = grid.getRefs()

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
                return nextTick()
            }
        }

        ctxMenuPrivateMethods = {
            ctxMenuLinkEvent(event: any, menu: any): void {},
            ctxMenuMouseoutEvent(event: any, option: any): void {},
            ctxMenuMouseoverEvent(event: any, option: any, child?: any): void {},
            handleContextmenuEvent: (event: any): void => {
                const refGridDivElem = refGridDiv.value

                const columnTargetNode = DomTools.getEventTargetNode(
                    event,
                    refGridDivElem,
                    `column-indicator`,
                    (target: any) => {
                        const elem = target.parentNode.parentNode.parentNode.parentNode
                        return elem !== document && elem.getAttribute('uid') === uId
                    },
                )

                const rowTargetNode = DomTools.getEventTargetNode(
                    event,
                    refGridDivElem,
                    `row-indicator`,
                    (target: any) => {
                        const elem =
                            target.parentNode.parentNode.parentNode.parentNode.parentNode
                        return elem !== document && elem.getAttribute('uid') === uId
                    },
                )
                
                const cornerTargetNode = DomTools.getEventTargetNode(
                    event,
                    refGridDivElem,
                    `grid-corner`,
                    (target: any) => {
                        const elem = target.parentNode.parentNode.parentNode.parentNode
                        return elem !== document && elem.getAttribute('uid') === uId
                    },
                )

                const cellTargetNode = DomTools.getEventTargetNode(
                    event,
                    refGridDivElem,
                    `normal`,
                    (target: any) => {
                        const elem: any = target.parentNode.parentNode.parentNode.parentNode
                        return elem !== document && elem.getAttribute('uid') === uId
                    },
                )

                console.log(columnTargetNode)

                if (
                    columnTargetNode.flag /* && vmaCalcGrid.props.gridContextHeaderMenu */
                ) {
                    openCtxMenu(event, 'column-indicator', {
                        row: columnTargetNode.targetElem.getAttribute('row'),
                        col: columnTargetNode.targetElem.getAttribute('col'),
                    })
                }
            },
        }

        const openCtxMenu = (
            event: any,
            type: 'column-indicator' | 'row-indicator' | 'grid-corner' | 'cell',
            param: any,
        ) => {

        }

        return {...ctxMenuMethods, ...ctxMenuPrivateMethods}
    }
}

export default gridCtxMenuHook