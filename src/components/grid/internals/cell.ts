export class Cell {
    row: number
    col: number
    rowSpan?: number
    colSpan?: number
    fd?: any // 计算依赖
    se?: any // 计算错误 null为无错误
    v: any
    mv: any
    ss?: boolean // 计算状态，已计算：true；未计算：false
    st?: number // 计算时间戳
    bgt?: string
    bg?: any
    fg?: any

    constructor(row: number, col: number, rowSpan: number, colSpan: number, v: any, mv: any, fd: any, se: any, ss: boolean, st: number,
                bgt: string, bg: any, fg: any) {
        this.row = row;
        this.col = col;
        this.rowSpan = rowSpan;
        this.colSpan = colSpan;
        this.v = v;
        this.mv = mv;
        this.fd = fd;
        this.se = se;
        this.ss = ss;
        this.st = st;
        this.bgt = bgt;
        this.bg = bg;
        this.fg = fg;
    }
}