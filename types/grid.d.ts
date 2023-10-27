import {ComponentPublicInstance, ComputedRef, Ref, RenderFunction, SetupContext} from "vue";
import {
    VmaFormulaGridCompContextMenuMethods,
    VmaFormulaGridCompContextMenuPrivateMethods
} from "./components/context-menu";

export interface VmaComponentInstance {
    uId: string
}

export type SizeType = 'large' | 'normal' | 'small' | 'mini'

export type ComponentType = 'default' | 'primary' | 'success' | 'warning' | 'danger'

export type ValueOf<T> = T extends any[] ? T[number] : T[keyof T]

export namespace VmaFormulaGridPropTypes {
    export type Data = Record<string, any>
    export type Type = ComponentType
    export type Size = SizeType
    export type CustomFunction = Record<string, unknown>
    export type MinDims = number[]
    export type DefaultRowHeight = number
    export type DefaultColumnWidth = number
    export type ColumnResizable = boolean
    export type RowResizable = boolean
    export type VirtualScrollX = boolean
    export type VirtualScrollY = boolean
}

export type VmaFormulaGridEmits = ['update:data', 'change']

export interface VmaFormulaGridRefs {
    refGridDiv: Ref<HTMLDivElement>

    refColumnResizeBarDiv: Ref<HTMLDivElement>
    refRowResizeBarDiv: Ref<HTMLDivElement>

    refGridHeaderTableWrapperDiv: Ref<HTMLDivElement>
    refGridBodyTableWrapperDiv: Ref<HTMLDivElement>
    refGridHeaderLeftFixedTableWrapperDiv: Ref<HTMLDivElement>
    refGridBodyLeftFixedTableWrapperDiv: Ref<HTMLDivElement>

    refGridHeaderTable: Ref<HTMLTableElement>
    refGridHeaderLeftFixedTable: Ref<HTMLTableElement>
    refGridBodyTable: Ref<HTMLTableElement>
    refGridBodyLeftFixedTable: Ref<HTMLTableElement>
    refGridBodyLeftFixedScrollWrapperDiv: Ref<HTMLDivElement>

    refGridBodyYLineDiv: Ref<HTMLDivElement>
    refGridBodyXLineDiv: Ref<HTMLDivElement>
    refGridBodyLeftFixedYLineDiv: Ref<HTMLDivElement>
    refGridBodyLeftFixedXLineDiv: Ref<HTMLDivElement>
    refGridHeaderLeftFixedXLineDiv: Ref<HTMLDivElement>

    refGridHeaderTableColgroup: Ref<HTMLTableColElement>
    refGridHeaderLeftFixedTableColgroup: Ref<HTMLTableColElement>
    refGridBodyTableColgroup: Ref<HTMLTableColElement>
    refGridBodyLeftFixedTableColgroup: Ref<HTMLTableColElement>

    renderDefaultColWidth: ComputedRef<number>
    renderDefaultRowHeight: ComputedRef<number>
    rowIndicatorElWidth: ComputedRef<number>

    refGridContextMenu: Ref<HTMLDivElement>
    refGridColorPicker: Ref<HTMLDivElement>

    refCurrentCellEditor: Ref<ComponentPublicInstance>

    refCurrentCellBorderTop: Ref<HTMLDivElement>
    refCurrentCellBorderRight: Ref<HTMLDivElement>
    refCurrentCellBorderBottom: Ref<HTMLDivElement>
    refCurrentCellBorderLeft: Ref<HTMLDivElement>
    refCurrentCellBorderCorner: Ref<HTMLDivElement>

    refCurrentAreaBorderTop: Ref<HTMLDivElement>
    refCurrentAreaBorderRight: Ref<HTMLDivElement>
    refCurrentAreaBorderBottom: Ref<HTMLDivElement>
    refCurrentAreaBorderLeft: Ref<HTMLDivElement>
    refCurrentAreaBorderCorner: Ref<HTMLDivElement>
}

export interface VmaFormulaGridReactiveData {
    xDim: number
    yDim: number

    xStart: number
    xEnd: number
    yStart: number
    yEnd: number

    scrollbarWidth: number
    scrollbarHeight: number

    gridWidth: number
    gridHeight: number

    gridHeaderWidth: number
    gridHeaderHeight: number

    gridBodyWidth: number
    gridBodyHeight: number

    gridLeftFixedHeaderWidth: number

    isOverflowX: boolean
    isOverflowY: boolean

    frozenColumnCount: number
    frozenRowCount: number

    colConfs: any[]
    rowConfs: any[]

    currentSheetData: any[][]

    currentSheetDataMap: Record<string, any>

    rowHeightsChanged: Record<string, number>
    columnWidthsChanged: Record<string, number>

    rowHidesChanged: Record<string, number>
    columnHidesChanged: Record<string, number>

    columns: {
        firstList: any[]
        leftList: any[]
        otherList: any[]
    }

    lastScrollLeft: number
    lastScrollLeftTime: number
    lastScrollXVisibleIndex: number
    lastScrollTop: number
    lastScrollTopTime: number
    lastScrollYVisibleIndex: number

    cells: {
        eMap: Record<string, any>
        cMap: Record<string, any>
        ncMap: Record<string, any>
    }

    merges: Record<string, any>

    ctxMenuStore: {
        selected: any
        visible: boolean
        showChild: boolean
        selectChild: any
        list: any[][]
        style: any
        [key: string]: any
    }

    colorPickerStore: {
        selected: any
        visible: boolean
        selectValue: any
        style: any
        [key: string]: any
    }

    currentCell: any
    currentCellBorderStyle: Record<string, any>
    currentCellEditorStyle: Record<string, any>
    currentCellEditorActive: boolean
    currentCellEditorContent: any

    currentAreaStatus: boolean
    currentArea: {
        start: any
        end: any
    }
    currentAreaBorderStyle: Record<string, any>
    currentAreaSri: number
    currentAreaEri: number
    currentAreaSci: number
    currentAreaEci: number
    currentAreaW: number
    currentAreaH: number
    currentAreaStartRowIndex: number
    currentAreaStartColIndex: number

    styles: {
        bgc: any[],
        fgc: any[],
        b: any[],
        i: any[],
        u: any[],
    }

    borders: any[]
}

export interface VmaFormulaGridProps {
    data?: VmaFormulaGridPropTypes.Data
    type?: VmaFormulaGridPropTypes.Type
    size?: VmaFormulaGridPropTypes.Size
    minDims?: VmaFormulaGridPropTypes.MinDims
    defaultRowHeight?: VmaFormulaGridPropTypes.DefaultRowHeight
    defaultColumnWidth?: VmaFormulaGridPropTypes.DefaultColumnWidth
    columnResizable: VmaFormulaGridPropTypes.ColumnResizable
    rowResizable: VmaFormulaGridPropTypes.RowResizable
    virtualScrollX: VmaFormulaGridPropTypes.VirtualScrollX
    virtualScrollY: VmaFormulaGridPropTypes.VirtualScrollY
}

export type VmaFormulaGridOptions = VmaFormulaGridProps

export interface VmaFormulaGridMethods {
    calc(): void
    recalculate(refresh: boolean): Promise<any>
    getCurrentGridData(): void
}

export interface VmaFormulaGridPrivateMethods {
    getParentElem(): Element | null
    triggerScrollXEvent(event: Event): void
    triggerScrollYEvent(event: Event): void
    updateRowVisible(type: string, rowStart: number, rowEnd: number): void
    updateColVisible(type: string, colStart: number, colEnd: number): void
    insertColumn(col: number): void
    insertRow(row: number): void
    hideColumn(col: number): void
    hideRow(row: number): void
    deleteColumn(col: number): void
    deleteRow(row: number): void
    setCellBorder(type: 'cells' | 'rows' | 'columns', target: 'l' | 't' | 'r' | 'b' | 'none' | 'full' | 'outer' | 'inner'): void
    setBackgroundColor(type: 'cells' | 'rows' | 'columns', mode: 'none' | 'normal', color: any): void
    setFontColor(type: 'cells' | 'rows' | 'columns', mode: 'none' | 'normal', color: any): void
    setFontStyle(type: 'cells' | 'rows' | 'columns', mode: 'fontBold' | 'fontItalic' | 'fontUnderline' | 'fontSizeUp' | 'fontSizeDown', v: boolean): void
    calcCurrentCellEditorStyle(): void
    calcCurrentCellEditorDisplay(): void
    reCalcCurrentAreaPos(): void
    updateCurrentAreaStyle(): void
    updateCellStyle(): void
    mergeCells(): void
    unmergeCells(): void
}

export interface VmaFormulaGridConstructor extends VmaComponentInstance, VmaFormulaGridMethods, VmaFormulaGridPrivateMethods {
    props: VmaFormulaGridOptions
    context: SetupContext<VmaFormulaGridEmits>
    reactiveData: VmaFormulaGridReactiveData
    renderVN: RenderFunction

    getRefs(): VmaFormulaGridRefs
}

declare module './grid' {
    interface VmaFormulaGridMethods extends VmaFormulaGridCompContextMenuMethods {}
    interface VmaFormulaGridPrivateMethods extends VmaFormulaGridCompContextMenuPrivateMethods {}
}

export * from './hooks'

export type VmaFormulaGridHeaderFixedType = 'center' | 'left' | 'right'

export namespace VmaFormulaGridHeaderPropTypes {
    export type Fixed = VmaFormulaGridHeaderFixedType
}

export interface VmaFormulaGridHeaderProps {
    fixed?: VmaFormulaGridHeaderPropTypes.Fixed
}

export interface VmaFormulaGridHeaderMethods {
}

export interface VmaFormulaGridHeaderPrivateMethods {
}

export type VmaFormulaGridHeaderOptions = VmaFormulaGridHeaderProps

export interface VmaFormulaGridHeaderConstructor extends VmaComponentInstance, VmaFormulaGridHeaderMethods, VmaFormulaGridHeaderPrivateMethods {
    props: VmaFormulaGridHeaderOptions
    context: SetupContext<VmaFormulaGridHeaderEmits>
    reactiveData: VmaFormulaGridHeaderReactiveData
    renderVN: RenderFunction

    getRefs(): VmaFormulaGridHeaderRefs
}

export type VmaFormulaGridBodyFixedType =
    | 'center'
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'left-top'

export namespace VmaFormulaGridBodyPropTypes {
    export type Fixed = VmaFormulaGridBodyFixedType
}

export interface VmaFormulaGridBodyProps {
    fixed?: VmaFormulaGridBodyPropTypes.Fixed
}

export interface VmaFormulaGridBodyMethods {
}

export interface VmaFormulaGridBodyPrivateMethods {
}

export type VmaFormulaGridBodyOptions = VmaFormulaGridBodyProps

export interface VmaFormulaGridBodyConstructor extends VmaComponentInstance, VmaFormulaGridBodyMethods, VmaFormulaGridBodyPrivateMethods {
    props: VmaFormulaGridBodyOptions
    context: SetupContext<VmaFormulaGridBodyEmits>
    reactiveData: VmaFormulaGridBodyReactiveData
    renderVN: RenderFunction

    getRefs(): VmaFormulaGridBodyRefs
}

// export type VmaFormulaGridCellType = 'normal' | 'column-indicator' | 'row-indicator' | 'grid-corner'
//
// export namespace VmaFormulaGridCellPropTypes {
//     export type Cat = VmaFormulaGridCellType
//     export type Type = ComponentType
// }
//
// export interface VmaFormulaGridCellProps {
//     cat?: VmaFormulaGridCellPropTypes.Cat
//     type?: VmaFormulaGridCellPropTypes.Type
// }
//
// export interface VmaFormulaGridCellMethods {
// }
//
// export interface VmaFormulaGridCellPrivateMethods {
// }
//
// export type VmaFormulaGridCellOptions = VmaFormulaGridCellProps
//
// export interface VmaFormulaGridCellConstructor extends VmaComponentInstance, VmaFormulaGridCellMethods, VmaFormulaGridCellPrivateMethods {
//     props: VmaFormulaGridCellOptions
//     context: SetupContext<VmaFormulaGridCellEmits>
//     reactiveData: VmaFormulaGridCellReactiveData
//     renderVN: RenderFunction
//
//     getRefs(): VmaFormulaGridCellRefs
// }

export interface DragEventOptions {
    drag?: (event: Event) => void;
    start?: (event: Event) => void;
    end?: (event: Event) => void;
}