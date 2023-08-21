import {getColumnCount, getColumnSymbol} from "../../../src/utils";

describe('grid.getColumnSymbol', () => {
    it('get column symbol from count', () => {
        const columnCountArr = [1, 20, 66, 4578]
        const columnSymbolArr = ['A', 'T', 'BN', 'FTB']

        columnCountArr.forEach((value, index) => {
            expect(getColumnSymbol(value)).toStrictEqual(columnSymbolArr[index])
        })
    })
})

describe('grid.getColumnCount', () => {
    it('get column count from symbol', () => {
        const columnCountArr = [1, 20, 66, 4578]
        const columnSymbolArr = ['A', 'T', 'BN', 'FTB']

        columnSymbolArr.forEach((value, index) => {
            expect(getColumnCount(value)).toStrictEqual(columnCountArr[index])
        })
    })
})