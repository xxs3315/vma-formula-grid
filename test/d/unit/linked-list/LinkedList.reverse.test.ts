import { ll } from '../../../../src/utils'
import checkIntegrity from './list-integrity'

describe('linkedList.reverse', () => {
  it('reverses a simple list', () => {
    const list = new ll(1, 2, 3, 4)
    list.reverse()
    expect(list.head!.data).toBe(4)
    expect(list.tail!.data).toBe(1)
    expect(list.toArray()).toStrictEqual([4, 3, 2, 1])
    expect(list.reduce((i) => i + 1, 0)).toBe(4)
    checkIntegrity(list)
  })

  it('reverses an empty list', () => {
    const list = new ll()
    list.reverse()
    checkIntegrity(list)
  })

  it('reverses a list of one', () => {
    const list = new ll(1)
    list.reverse()
    expect(list.head!.data).toBe(1)
    checkIntegrity(list)
  })
})
