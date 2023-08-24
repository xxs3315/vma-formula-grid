import { ll } from '../../../../src/utils'
import checkIntegrity from './list-integrity'

describe('linkedList.prepend', () => {
  it('prepends a node to a list of length 1', () => {
    const l = new ll(2)
    l.prepend(1)
    checkIntegrity(l)
    expect(l.head!.data).toBe(1)
    expect(l.tail!.data).toBe(2)
  })

  it('prepends to an empty list', () => {
    const list = new ll()
    list.prepend(1)
    expect(list.toArray()).toStrictEqual([1])
  })

  it('prepends any number of arguments', () => {
    const list = new ll(3, 4)
    const value = list.prepend(0, 1, 2)
    checkIntegrity(list)
    expect(list.toArray()).toStrictEqual([0, 1, 2, 3, 4])
    expect(value).toBe(list)
  })
})
