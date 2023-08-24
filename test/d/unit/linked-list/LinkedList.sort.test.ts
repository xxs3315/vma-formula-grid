import { ll } from '../../../../src/utils'
import checkIntegrity from './list-integrity'

describe('linkedList.sort', () => {
  it('sorts a linked list using quicksort', () => {
    const n = [2, 1, 8, 9, 0, 4, 3, 6, 7, 5]
    const list = ll.from(n).sort((a, b) => a < b)
    const shortList = new ll(2, 1).sort((a, b) => a < b)
    const reverseSorted = ll.from(n).sort((a, b) => a > b)
    const objList = new ll({ v: 2 }, { v: 3 }, { v: 1 }, { v: 2 })
    objList.sort((a, b) => a.v < b.v)
    checkIntegrity(list)
    checkIntegrity(reverseSorted)
    checkIntegrity(objList)
    checkIntegrity(shortList)
    expect(shortList.toArray()).toEqual([1, 2])
    expect(list.toArray()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    expect(reverseSorted.toArray()).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0])
    expect(objList.toArray()).toEqual([{ v: 1 }, { v: 2 }, { v: 2 }, { v: 3 }])
  })

  it('returns if the list is empty or just 1 element', () => {
    const list = new ll()
    const list1 = new ll(1)
    list.sort((a, b) => a < b)
    list1.sort((a, b) => a < b)
    checkIntegrity(list)
    checkIntegrity(list1)
  })
})
