import { VmaFormulaGridCompContextMenuMethods, VmaFormulaGridCompContextMenuPrivateMethods, VmaFormulaGridGlobalHooksHandlers } from '../../../types';
import { nextTick } from 'vue';
import { DomTools, getAbsolutePos } from '../../utils/doms.ts';
import { checkCellInMerges, getDefaultFontSize } from '../../utils';

const gridCtxMenuHook: VmaFormulaGridGlobalHooksHandlers.HookOptions = {
    setupGrid(grid): void | { [p: string]: any } {
        const { uId, reactiveData } = grid;
        const { refGridContextMenu, refGridColorPicker, refGridDiv } = grid.getRefs();

        let ctxMenuMethods = {} as VmaFormulaGridCompContextMenuMethods;
        let ctxMenuPrivateMethods = {} as VmaFormulaGridCompContextMenuPrivateMethods;

        ctxMenuMethods = {
            closeMenu: () => {
                Object.assign(reactiveData.ctxMenuStore, {
                    visible: false,
                    selected: null,
                    selectChild: null,
                    showChild: false,
                    list: [],
                });
                Object.assign(reactiveData.colorPickerStore, {
                    selected: null,
                    visible: false,
                    selectValue: null,
                });
                return nextTick();
            },
        };

        ctxMenuPrivateMethods = {
            ctxMenuLinkEvent(_: any, menu: any): void {
                if (menu && !menu.disabled) {
                    if (menu.code === 'insertColumn') {
                        grid.insertColumn(Number(menu.param.col));
                    }
                    if (menu.code === 'insertRow') {
                        grid.insertRow(Number(menu.param.row));
                    }
                    if (menu.code === 'hideColumn') {
                        grid.hideColumn(Number(menu.param.col));
                    }
                    if (menu.code === 'hideRow') {
                        grid.hideRow(Number(menu.param.row));
                    }
                    if (menu.code === 'deleteColumn') {
                        grid.deleteColumn(Number(menu.param.col));
                    }
                    if (menu.code === 'deleteRow') {
                        grid.deleteRow(Number(menu.param.row));
                    }
                    if (menu.code === 'borderLeft') {
                        grid.setCellBorder('cells', 'l');
                    }
                    if (menu.code === 'borderTop') {
                        grid.setCellBorder('cells', 't');
                    }
                    if (menu.code === 'borderRight') {
                        grid.setCellBorder('cells', 'r');
                    }
                    if (menu.code === 'borderBottom') {
                        grid.setCellBorder('cells', 'b');
                    }
                    if (menu.code === 'borderInner') {
                        grid.setCellBorder('cells', 'inner');
                    }
                    if (menu.code === 'borderOuter') {
                        grid.setCellBorder('cells', 'outer');
                    }
                    if (menu.code === 'borderFull') {
                        grid.setCellBorder('cells', 'full');
                    }
                    if (menu.code === 'borderNone') {
                        grid.setCellBorder('cells', 'none');
                    }
                    if (menu.code === 'mergeCells') {
                        grid.mergeCells();
                    }
                    if (menu.code === 'unmergeCells') {
                        grid.unmergeCells();
                    }
                    if (menu.code === 'fontBold') {
                        let initValue = false;
                        for (let col = reactiveData.currentAreaSci; col <= reactiveData.currentAreaEci; col++) {
                            for (let row = reactiveData.currentAreaSri; row <= reactiveData.currentAreaEri; row++) {
                                if (reactiveData.currentSheetData[row][col + 1].b && !checkCellInMerges(col + 1, row + 1, reactiveData.merges)) {
                                    initValue = true;
                                    break;
                                }
                            }
                        }
                        grid.setFontStyle('cells', 'fontBold', initValue);
                    }
                    if (menu.code === 'fontItalic') {
                        let initValue = false;
                        for (let col = reactiveData.currentAreaSci; col <= reactiveData.currentAreaEci; col++) {
                            for (let row = reactiveData.currentAreaSri; row <= reactiveData.currentAreaEri; row++) {
                                if (reactiveData.currentSheetData[row][col + 1].i && !checkCellInMerges(col + 1, row + 1, reactiveData.merges)) {
                                    initValue = true;
                                    break;
                                }
                            }
                        }
                        grid.setFontStyle('cells', 'fontItalic', initValue);
                    }
                    if (menu.code === 'fontUnderline') {
                        let initValue = false;
                        for (let col = reactiveData.currentAreaSci; col <= reactiveData.currentAreaEci; col++) {
                            for (let row = reactiveData.currentAreaSri; row <= reactiveData.currentAreaEri; row++) {
                                if (reactiveData.currentSheetData[row][col + 1].u && !checkCellInMerges(col + 1, row + 1, reactiveData.merges)) {
                                    initValue = true;
                                    break;
                                }
                            }
                        }
                        grid.setFontStyle('cells', 'fontUnderline', initValue);
                    }
                    if (menu.code === 'formatGeneral') {
                        grid.setCellFormat('cells', 'formatGeneral', null);
                    }
                    if (menu.code === 'formatNumberGeneral') {
                        grid.setCellFormat('cells', 'formatNumberGeneral', null);
                    }
                    if (menu.code === 'formatNumberPercent') {
                        grid.setCellFormat('cells', 'formatNumberPercent', null);
                    }
                    if (menu.code === 'formatNumberScience') {
                        grid.setCellFormat('cells', 'formatNumberScience', null);
                    }
                    if (menu.code === 'formatNumberFraction') {
                        grid.setCellFormat('cells', 'formatNumberFraction', null);
                    }
                    if (menu.code === 'formatNumberThousands') {
                        grid.setCellFormat('cells', 'formatNumberThousands', null);
                    }
                    if (menu.code === 'formatTime') {
                        grid.setCellFormat('cells', 'formatTime', null);
                    }
                    if (menu.code === 'formatShortDate') {
                        grid.setCellFormat('cells', 'formatShortDate', null);
                    }
                    if (menu.code === 'formatLongDate') {
                        grid.setCellFormat('cells', 'formatLongDate', null);
                    }
                    if (menu.code === 'formatCurrencyCNY') {
                        grid.setCellFormat('cells', 'formatCurrencyCNY', null);
                    }
                    if (menu.code === 'formatCurrencyUSD') {
                        grid.setCellFormat('cells', 'formatCurrencyUSD', null);
                    }
                    if (menu.code === 'formatCurrencyEuro') {
                        grid.setCellFormat('cells', 'formatCurrencyEuro', null);
                    }
                }
                if (ctxMenuMethods.closeMenu) {
                    ctxMenuMethods.closeMenu();
                }
            },
            ctxMenuMouseoutEvent(_: any, option: any): void {
                const { ctxMenuStore } = reactiveData;
                if (!option.children) {
                    ctxMenuStore.selected = null;
                }
                ctxMenuStore.selectChild = null;
            },
            ctxMenuMouseoverEvent(event: any, option: any, child?: any): void {
                const menuElem = event.currentTarget;
                if (option.type && option.type === 'colorPicker') {
                    const { ctxMenuStore } = reactiveData;
                    event.preventDefault();
                    event.stopPropagation();

                    ctxMenuStore.selected = option;
                    ctxMenuStore.selectChild = null;

                    const { scrollTop, scrollLeft } = DomTools.getDomNode();
                    const { boundingTop, boundingLeft } = getAbsolutePos(menuElem);
                    const posTop = boundingTop;
                    const posLeft = boundingLeft + menuElem.offsetWidth;
                    const top = posTop + scrollTop - 4;
                    const left = posLeft + scrollLeft + 4;
                    Object.assign(reactiveData.colorPickerStore, {
                        visible: true,
                        selected: option,
                        selectValue: null,
                        style: {
                            top: `${top}px`,
                            left: `${left}px`,
                        },
                    });
                    nextTick(() => {
                        const { scrollTop, scrollLeft, visibleHeight, visibleWidth } = DomTools.getDomNode();
                        const { boundingTop: menuBoundingTop, boundingLeft: menuBoundingLeft } = getAbsolutePos(menuElem);
                        const top = menuBoundingTop + scrollTop;
                        const left = menuBoundingLeft + scrollLeft;
                        const colorPickerElem = refGridColorPicker.value;
                        const clientHeight = colorPickerElem.clientHeight;
                        const clientWidth = colorPickerElem.clientWidth;
                        const { boundingTop, boundingLeft } = getAbsolutePos(colorPickerElem);
                        const offsetTop = boundingTop + clientHeight - visibleHeight;
                        const offsetLeft = boundingLeft + clientWidth - visibleWidth;
                        if (offsetTop > -10) {
                            reactiveData.colorPickerStore.style.top = `${Math.max(scrollTop + 2, top - clientHeight - 2)}px`;
                        }
                        if (offsetLeft > -10) {
                            reactiveData.colorPickerStore.style.left = `${Math.max(scrollLeft + 2, left - clientWidth - 2)}px`;
                        }
                    });
                } else {
                    const { ctxMenuStore, colorPickerStore } = reactiveData;
                    event.preventDefault();
                    event.stopPropagation();
                    ctxMenuStore.selected = option;
                    ctxMenuStore.selectChild = child;
                    colorPickerStore.visible = false;
                    if (!child) {
                        ctxMenuStore.showChild = option && option.children && option.children.length > 0;
                        if (ctxMenuStore.showChild) {
                            nextTick(() => {
                                const childWrapperElem = menuElem.nextElementSibling;
                                if (childWrapperElem) {
                                    const { boundingTop, boundingLeft, visibleHeight, visibleWidth } = getAbsolutePos(menuElem);
                                    const posTop = boundingTop + menuElem.offsetHeight;
                                    const posLeft = boundingLeft + menuElem.offsetWidth;
                                    let left = '';
                                    let right = '';
                                    // 是否超出右侧
                                    if (posLeft + childWrapperElem.offsetWidth > visibleWidth - 10) {
                                        left = 'auto';
                                        right = `${menuElem.offsetWidth}px`;
                                    }
                                    // 是否超出底部
                                    let top = '';
                                    let bottom = '';
                                    if (posTop + childWrapperElem.offsetHeight > visibleHeight - 10) {
                                        top = 'auto';
                                        bottom = '0';
                                    }
                                    childWrapperElem.style.left = left;
                                    childWrapperElem.style.right = right;
                                    childWrapperElem.style.top = top;
                                    childWrapperElem.style.bottom = bottom;
                                }
                            });
                        }
                    }
                }
            },
            handleContextmenuEvent: (event: any): void => {
                const refGridDivElem = refGridDiv.value;

                const columnTargetNode = DomTools.getEventTargetNode(event, refGridDivElem, `column-indicator`, (target: any) => {
                    const elem = target.parentNode.parentNode.parentNode.parentNode;
                    return elem !== document && elem.getAttribute('data-uid') === uId;
                });

                const rowTargetNode = DomTools.getEventTargetNode(event, refGridDivElem, `row-indicator`, (target: any) => {
                    const elem = target.parentNode.parentNode.parentNode.parentNode.parentNode;
                    return elem !== document && elem.getAttribute('data-uid') === uId;
                });

                const cellTargetNode = DomTools.getEventTargetNode(event, refGridDivElem, `normal`, (target: any) => {
                    const elem: any = target.parentNode.parentNode.parentNode.parentNode;
                    return elem !== document && elem.getAttribute('data-uid') === uId;
                });

                if (columnTargetNode.flag) {
                    openCtxMenu(event, 'column-indicator', {
                        row: columnTargetNode.targetElem.getAttribute('data-row'),
                        col: columnTargetNode.targetElem.getAttribute('data-col'),
                    });
                }

                if (rowTargetNode.flag) {
                    openCtxMenu(event, 'row-indicator', {
                        row: rowTargetNode.targetElem.getAttribute('data-row'),
                        col: rowTargetNode.targetElem.getAttribute('data-col'),
                    });
                }

                if (cellTargetNode.flag) {
                    openCtxMenu(event, 'cell', null);
                }
            },
        };

        const openCtxMenu = (event: any, type: 'column-indicator' | 'row-indicator' | 'grid-corner' | 'cell', param: any) => {
            const list = [];
            if (type === 'column-indicator') {
                let options = [];
                options.push({
                    name: grid.lang().insertColumn,
                    code: 'insertColumn',
                    disabled: false,
                    visible: true,
                    param,
                });
                list.push(options);
                // options = []
                // options.push({ name: '固定', code: 'fixedColumn', disabled: false, visible: true, param, })
                // list.push(options)
                options = [];
                options.push({
                    name: grid.lang().hideColumn,
                    code: 'hideColumn',
                    disabled: false,
                    visible: true,
                    param,
                });
                list.push(options);
                options = [];
                options.push({
                    name: grid.lang().deleteColumn,
                    code: 'deleteColumn',
                    disabled: false,
                    visible: true,
                    param,
                });
                list.push(options);
            }
            if (type === 'row-indicator') {
                let options = [];
                options.push({
                    name: grid.lang().insertRow,
                    code: 'insertRow',
                    disabled: false,
                    visible: true,
                    param,
                });
                list.push(options);
                // options = []
                // options.push({ name: '固定', code: 'fixedRow', disabled: false, visible: true, param, })
                // list.push(options)
                options = [];
                options.push({
                    name: grid.lang().hideRow,
                    code: 'hideRow',
                    disabled: false,
                    visible: true,
                    param,
                });
                list.push(options);
                options = [];
                options.push({
                    name: grid.lang().deleteRow,
                    code: 'deleteRow',
                    disabled: false,
                    visible: true,
                    param,
                });
                list.push(options);
            }
            if (type === 'cell') {
                let options = [];
                let subOptions: any = [];
                subOptions.push({
                    name: grid.lang().borderNone,
                    code: 'borderNone',
                    disabled: false,
                    visible: true,
                    param,
                });
                subOptions.push({
                    name: grid.lang().borderFull,
                    code: 'borderFull',
                    disabled: false,
                    visible: true,
                    param,
                });
                subOptions.push({
                    name: grid.lang().borderOuter,
                    code: 'borderOuter',
                    disabled: false,
                    visible: true,
                    param,
                });
                subOptions.push({
                    name: grid.lang().borderInner,
                    code: 'borderInner',
                    disabled: false,
                    visible: true,
                    param,
                });
                subOptions.push({
                    name: grid.lang().borderBottom,
                    code: 'borderBottom',
                    disabled: false,
                    visible: true,
                    param,
                });
                subOptions.push({
                    name: grid.lang().borderTop,
                    code: 'borderTop',
                    disabled: false,
                    visible: true,
                    param,
                });
                subOptions.push({
                    name: grid.lang().borderLeft,
                    code: 'borderLeft',
                    disabled: false,
                    visible: true,
                    param,
                });
                subOptions.push({
                    name: grid.lang().borderRight,
                    code: 'borderRight',
                    disabled: false,
                    visible: true,
                    param,
                });
                options.push({
                    name: grid.lang().cellBorder,
                    prefixIcon: 'info',
                    code: 'cellBorder',
                    disabled: false,
                    visible: true,
                    children: subOptions,
                    param,
                });
                list.push(options);
                options = [];
                subOptions = [];
                options.push({
                    name: grid.lang().fontColor,
                    prefixIcon: 'info',
                    code: 'fontColor',
                    disabled: false,
                    visible: true,
                    children: subOptions,
                    param,
                    type: 'colorPicker',
                });
                list.push(options);
                options = [];
                subOptions = [];
                options.push({
                    name: grid.lang().backgroundColor,
                    prefixIcon: 'info',
                    code: 'backgroundColor',
                    disabled: false,
                    visible: true,
                    children: subOptions,
                    param,
                    type: 'colorPicker',
                });
                list.push(options);
                options = [];
                subOptions = [];
                options.push({
                    name: grid.lang().mergeCells,
                    prefixIcon: 'info',
                    code: 'mergeCells',
                    disabled: false,
                    visible: true,
                    children: subOptions,
                    param,
                });
                list.push(options);
                options = [];
                subOptions = [];
                options.push({
                    name: grid.lang().unmergeCells,
                    prefixIcon: 'info',
                    code: 'unmergeCells',
                    disabled: false,
                    visible: true,
                    children: subOptions,
                    param,
                });
                list.push(options);
                options = [];
                subOptions = [];
                subOptions.push({
                    name: grid.lang().fontBold,
                    code: 'fontBold',
                    disabled: false,
                    visible: true,
                    param,
                });
                subOptions.push({
                    name: grid.lang().fontItalic,
                    code: 'fontItalic',
                    disabled: false,
                    visible: true,
                    param,
                });
                subOptions.push({
                    name: grid.lang().fontUnderline,
                    code: 'fontUnderline',
                    disabled: false,
                    visible: true,
                    param,
                });
                subOptions.push({
                    name: grid.lang().fontSelect,
                    code: 'fontSelect',
                    disabled: false,
                    visible: true,
                    param,
                    type: 'fontSelect',
                });
                subOptions.push({
                    name: grid.lang().fontSizeSelect,
                    code: 'fontSizeSelect',
                    disabled: false,
                    visible: true,
                    param,
                    type: 'fontSizeSelect',
                });
                options.push({
                    name: grid.lang().fontStyle,
                    prefixIcon: 'info',
                    code: 'fontStyle',
                    disabled: false,
                    visible: true,
                    children: subOptions,
                    param,
                });
                list.push(options);
                options = [];
                subOptions = [];
                options.push({
                    name: grid.lang().formatGeneral,
                    prefixIcon: 'info',
                    code: 'formatGeneral',
                    disabled: false,
                    visible: true,
                    children: subOptions,
                    param,
                });
                list.push(options);
                // options = [];
                // subOptions = [];
                // TODO
                // options.push({
                //     name: '增加小数位',
                //     prefixIcon: 'info',
                //     code: 'formatNumberDecimalPlacesIncrease',
                //     disabled: false,
                //     visible: true,
                //     children: subOptions,
                //     param,
                // });
                // list.push(options);
                // options = [];
                // subOptions = [];
                // TODO
                // options.push({
                //     name: '减少小数位',
                //     prefixIcon: 'info',
                //     code: 'formatNumberDecimalPlacesDecrease',
                //     disabled: false,
                //     visible: true,
                //     children: subOptions,
                //     param,
                // });
                // list.push(options);
                options = [];
                subOptions = [];
                subOptions.push({
                    name: grid.lang().formatNumberGeneral,
                    code: 'formatNumberGeneral',
                    disabled: false,
                    visible: true,
                    param,
                });
                subOptions.push({
                    name: grid.lang().formatNumberPercent,
                    code: 'formatNumberPercent',
                    disabled: false,
                    visible: true,
                    param,
                });
                subOptions.push({
                    name: grid.lang().formatNumberScience,
                    code: 'formatNumberScience',
                    disabled: false,
                    visible: true,
                    param,
                });
                subOptions.push({
                    name: grid.lang().formatNumberFraction,
                    code: 'formatNumberFraction',
                    disabled: false,
                    visible: true,
                    param,
                });
                subOptions.push({
                    name: grid.lang().formatNumberThousands,
                    code: 'formatNumberThousands',
                    disabled: false,
                    visible: true,
                    param,
                });
                options.push({
                    name: grid.lang().formatNumber,
                    prefixIcon: 'info',
                    code: 'formatNumber',
                    disabled: false,
                    visible: true,
                    children: subOptions,
                    param,
                });
                list.push(options);
                options = [];
                subOptions = [];
                subOptions.push({
                    name: grid.lang().formatTime,
                    code: 'formatTime',
                    disabled: false,
                    visible: true,
                    param,
                });
                subOptions.push({
                    name: grid.lang().formatShortDate,
                    code: 'formatShortDate',
                    disabled: false,
                    visible: true,
                    param,
                });
                subOptions.push({
                    name: grid.lang().formatLongDate,
                    code: 'formatLongDate',
                    disabled: false,
                    visible: true,
                    param,
                });
                options.push({
                    name: grid.lang().formatNumberDateTime,
                    prefixIcon: 'info',
                    code: 'formatNumberDateTime',
                    disabled: false,
                    visible: true,
                    children: subOptions,
                    param,
                });
                list.push(options);
                options = [];
                subOptions = [];
                subOptions.push({
                    name: grid.lang().formatCurrencyCNY,
                    code: 'formatCurrencyCNY',
                    disabled: false,
                    visible: true,
                    param,
                });
                subOptions.push({
                    name: grid.lang().formatCurrencyUSD,
                    code: 'formatCurrencyUSD',
                    disabled: false,
                    visible: true,
                    param,
                });
                subOptions.push({
                    name: grid.lang().formatCurrencyEuro,
                    code: 'formatCurrencyEuro',
                    disabled: false,
                    visible: true,
                    param,
                });
                subOptions.push({
                    name: grid.lang().formatNumberCurrencyOthers,
                    code: 'formatNumberCurrencyOthers',
                    disabled: false,
                    visible: true,
                    param,
                    type: 'formatNumberCurrencyOthersSelect',
                });
                options.push({
                    name: grid.lang().formatNumberCurrency,
                    prefixIcon: 'info',
                    code: 'formatNumberCurrency',
                    disabled: false,
                    visible: true,
                    children: subOptions,
                    param,
                });
                list.push(options);
            }

            event.preventDefault();

            const { scrollTop, scrollLeft } = DomTools.getDomNode();
            const top = event.clientY + scrollTop;
            const left = event.clientX + scrollLeft;
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
            });
            nextTick(() => {
                const { scrollTop, scrollLeft, visibleHeight, visibleWidth } = DomTools.getDomNode();
                const top = event.clientY + scrollTop;
                const left = event.clientX + scrollLeft;
                const ctxElem = refGridContextMenu.value;
                const clientHeight = ctxElem.clientHeight;
                const clientWidth = ctxElem.clientWidth;
                const { boundingTop, boundingLeft } = getAbsolutePos(ctxElem);
                const offsetTop = boundingTop + clientHeight - visibleHeight;
                const offsetLeft = boundingLeft + clientWidth - visibleWidth;
                if (offsetTop > -10) {
                    reactiveData.ctxMenuStore.style.top = `${Math.max(scrollTop + 2, top - clientHeight - 2)}px`;
                }
                if (offsetLeft > -10) {
                    reactiveData.ctxMenuStore.style.left = `${Math.max(scrollLeft + 2, left - clientWidth - 2)}px`;
                }
            });
        };

        return { ...ctxMenuMethods, ...ctxMenuPrivateMethods };
    },
};

export default gridCtxMenuHook;
