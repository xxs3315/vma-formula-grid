export class Column {
    index: number;
    width?: number | string;
    visible?: boolean;

    constructor(index: number, width: number | string, visible: boolean) {
        this.index = index;
        this.width = width;
        this.visible = visible;
    }
}
