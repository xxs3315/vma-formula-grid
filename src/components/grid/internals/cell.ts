export class Cell {
    row: number;
    col: number;
    rowSpan?: number;
    colSpan?: number;
    fd?: any; // 计算依赖
    se?: any; // 计算错误 null为无错误
    v: any;
    mv: any;
    ss?: boolean; // 计算状态，已计算：true；未计算：false
    st?: number; // 计算时间戳
    bgt?: string; //背景类型
    bg?: any; // 背景色
    fg?: any; // 前景色
    bdl?: any; // 左边框
    bdt?: any; // 上边框
    bdr?: any; // 右边框
    bdb?: any; // 下边框
    b?: boolean; // 粗体
    i?: boolean; // 斜体
    u?: boolean; // 下划线
    ff?: any; // font-family
    fs?: any; // font-size
    g?: string; // 格式类型
    gf?: string; // 格式字符串

    constructor(
        row: number,
        col: number,
        rowSpan: number,
        colSpan: number,
        v: any,
        mv: any,
        fd: any,
        se: any,
        ss: boolean,
        st: number,
        bgt: string,
        bg: any,
        fg: any,
        bdl: any,
        bdt: any,
        bdr: any,
        bdb: any,
        b: boolean,
        i: boolean,
        u: boolean,
        ff: any,
        fs: any,
        g: string,
        gf: string,
    ) {
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
        this.bdl = bdl;
        this.bdt = bdt;
        this.bdr = bdr;
        this.bdb = bdb;
        this.b = b;
        this.i = i;
        this.u = u;
        this.ff = ff;
        this.fs = fs;
        this.g = g;
        this.gf = gf;
    }
}
