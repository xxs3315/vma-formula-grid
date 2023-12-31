import FormulaError from '../../formulas/error'
import {Address} from '../../formulas/helpers'
import Collection from '../type/collection'

const MAX_ROW = 1048576
const MAX_COLUMN = 16384

class Utils {
  private context: any

  constructor(context: any) {
    this.context = context
  }

  columnNameToNumber = (columnName: any) => Address.columnNameToNumber(columnName)

  /**
   * Parse the cell address only.
   * @param {string} cellAddress
   * @return {{ref: {col: number, address: string, row: number}}}
   */
  parseCellAddress(cellAddress: any) {
    const res = cellAddress.match(/([$]?)([A-Za-z]{1,3})([$]?)([1-9][0-9]*)/)
    // console.log('parseCellAddress', cellAddress);
    return {
      ref: {
        col: this.columnNameToNumber(res[2]),
        row: +res[4]
      }
    }
  }

  parseRow = (row: any) => {
    const rowNum = +row
    if (!Number.isInteger(rowNum)) throw Error('Row number must be integer.')
    return {
      ref: {
        col: undefined,
        row: +row
      }
    }
  }

  parseCol(col: any) {
    return {
      ref: {
        col: this.columnNameToNumber(col),
        row: undefined
      }
    }
  }

  /**
   * Apply + or - unary prefix.
   * @param {Array.<string>} prefixes
   * @param {*} value
   * @return {*}
   */
  applyPrefix(prefixes: any, value: any) {
    console.log(prefixes)
    this.extractRefValue(value)
    return 0
  }

  applyPostfix(value: any, postfix: any) {
    console.log(postfix)
    this.extractRefValue(value)
    return 0
  }

  applyInfix(value1: any, infix: any, value2: any) {
    console.log(infix)
    this.extractRefValue(value1)
    this.extractRefValue(value2)
    return 0
  }

  applyIntersect(refs: any) {
    // console.log('applyIntersect', refs);
    if (this.isFormulaError(refs[0])) return refs[0]
    if (!refs[0].ref) throw Error(`Expecting a reference, but got ${refs[0]}.`)
    // a intersection will keep track of references, value won't be retrieved here.
    let maxRow: any
    let maxCol: any
    let minRow: any
    let minCol: any
    let res // index start from 1
    // first time setup
    const ref = refs.shift().ref
    const sheet = ref.sheet
    if (!ref.from) {
      // check whole row/col reference
      if (ref.row === undefined || ref.col === undefined) {
        throw Error('Cannot intersect the whole row or column.')
      }

      // cell ref
      maxRow = minRow = ref.row
      maxCol = minCol = ref.col
    } else {
      // range ref
      // update
      maxRow = Math.max(ref.from.row, ref.to.row)
      minRow = Math.min(ref.from.row, ref.to.row)
      maxCol = Math.max(ref.from.col, ref.to.col)
      minCol = Math.min(ref.from.col, ref.to.col)
    }

    let err
    refs.forEach((ref: any) => {
      if (this.isFormulaError(ref)) return ref
      ref = ref.ref
      if (!ref) throw Error(`Expecting a reference, but got ${ref}.`)
      if (!ref.from) {
        if (ref.row === undefined || ref.col === undefined) {
          throw Error('Cannot intersect the whole row or column.')
        }
        // cell ref
        if (ref.row > maxRow || ref.row < minRow || ref.col > maxCol || ref.col < minCol || sheet !== ref.sheet) {
          err = FormulaError.NULL
        }
        maxRow = minRow = ref.row
        maxCol = minCol = ref.col
      } else {
        // range ref
        const refMaxRow = Math.max(ref.from.row, ref.to.row)
        const refMinRow = Math.min(ref.from.row, ref.to.row)
        const refMaxCol = Math.max(ref.from.col, ref.to.col)
        const refMinCol = Math.min(ref.from.col, ref.to.col)
        if (refMinRow > maxRow || refMaxRow < minRow || refMinCol > maxCol || refMaxCol < minCol || sheet !== ref.sheet) {
          err = FormulaError.NULL
        }
        // update
        maxRow = Math.min(maxRow, refMaxRow)
        minRow = Math.max(minRow, refMinRow)
        maxCol = Math.min(maxCol, refMaxCol)
        minCol = Math.max(minCol, refMinCol)
      }
    })
    if (err) return err
    // check if the ref can be reduced to cell reference
    if (maxRow === minRow && maxCol === minCol) {
      res = {
        ref: {
          sheet,
          row: maxRow,
          col: maxCol
        }
      }
    } else {
      res = {
        ref: {
          sheet,
          from: { row: minRow, col: minCol },
          to: { row: maxRow, col: maxCol }
        }
      }
    }

    if (!res.ref.sheet) delete res.ref.sheet
    return res
  }

  applyUnion(refs: any) {
    const collection = new Collection()
    for (let i = 0; i < refs.length; i++) {
      if (this.isFormulaError(refs[i])) return refs[i]
      collection.add(this.extractRefValue(refs[i]).val, refs[i])
    }

    // console.log('applyUnion', unions);
    return collection
  }

  /**
     * Apply multiple references, e.g. A1:B3:C8:A:1:.....
     * @param refs
     // * @return {{ref: {from: {col: number, row: number}, to: {col: number, row: number}}}}
     */
  applyRange(refs: any) {
    let res
    let maxRow = -1
    let maxCol = -1
    let minRow = MAX_ROW + 1
    let minCol = MAX_COLUMN + 1
    refs.forEach((ref: any) => {
      if (this.isFormulaError(ref)) return ref
      // row ref is saved as number, parse the number to row ref here
      if (typeof ref === 'number') {
        ref = this.parseRow(ref)
      }
      ref = ref.ref
      // check whole row/col reference
      if (ref.row === undefined) {
        minRow = 1
        maxRow = MAX_ROW
      }
      if (ref.col === undefined) {
        minCol = 1
        maxCol = MAX_COLUMN
      }

      if (ref.row > maxRow) maxRow = ref.row
      if (ref.row < minRow) minRow = ref.row
      if (ref.col > maxCol) maxCol = ref.col
      if (ref.col < minCol) minCol = ref.col
    })
    if (maxRow === minRow && maxCol === minCol) {
      res = {
        ref: {
          row: maxRow,
          col: maxCol
        }
      }
    } else {
      res = {
        ref: {
          from: { row: minRow, col: minCol },
          to: { row: maxRow, col: maxCol }
        }
      }
    }
    return res
  }

  /**
   * Throw away the refs, and retrieve the value.
   * @return {{val: *, isArray: boolean}}
   */
  extractRefValue(obj: any) {
    const isArray = Array.isArray(obj)
    if (obj.ref) {
      // can be number or array
      return { val: this.context.retrieveRef(obj), isArray }
    }
    return { val: obj, isArray }
  }

  /**
   *
   * @param array
   * @return {Array}
   */
  toArray = (array: any) =>
    // TODO: check if array is valid
    // console.log('toArray', array);
    array

  /**
   * @param {string} number
   * @return {number}
   */
  toNumber = (number: any) => Number(number)

  /**
   * @param {string} string
   * @return {string}
   */
  toString = (string: any) => string.substring(1, string.length - 1).replace(/""/g, '"')

  /**
   * @param {string} bool
   * @return {boolean}
   */
  toBoolean = (bool: any) => bool === 'TRUE'

  /**
   * Parse an error.
   * @param {string} error
   * @return {FormulaError}
   */
  toError = (error: any) => new FormulaError(error.toUpperCase())

  isFormulaError = (obj: any) => obj instanceof FormulaError
}

export default Utils
