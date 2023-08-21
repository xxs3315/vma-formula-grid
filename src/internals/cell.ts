export class Cell {
    row: number
    col: number
    rowSpan?: number
    colSpan?: number
    v: any
    mv: any

    constructor(row: number, col: number, rowSpan: number, colSpan: number, v: any, mv: any) {
        this.row = row;
        this.col = col;
        this.rowSpan = rowSpan;
        this.colSpan = colSpan;
        this.v = v;
        this.mv = mv;
    }
}