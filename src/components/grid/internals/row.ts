export class Row {
    index: number
    height?: number | string
    visible?: boolean


    constructor(index: number, height: number | string, visible: boolean) {
        this.index = index;
        this.height = height;
        this.visible = visible;
    }
}