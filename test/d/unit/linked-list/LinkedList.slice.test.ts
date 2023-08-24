import { ll } from '../../../../src/utils'
import checkIntegrity from './list-integrity'

describe('linkedList.slice', () => {
  it('slices the list', () => {
    const list = new ll(1, 2, 3, 4, 5)
    const slice = list.slice(2)
    checkIntegrity(slice)
    checkIntegrity(list)
    expect(slice.toArray()).toStrictEqual([3, 4, 5])
  })

  it('slices with end argument', () => {
    const list = new ll(1, 2, 3, 4, 5)
    const slice = list.slice(1, 3)
    checkIntegrity(slice)
    checkIntegrity(list)
    expect(slice.toArray()).toStrictEqual([2, 3])
  })

  it('does not touch the original list', () => {
    const list = new ll(1, 2, 3, 4, 5)
    const slice = list.slice(2)
    expect(slice.toArray()).toStrictEqual([3, 4, 5])
    expect(list.toArray()).toStrictEqual([1, 2, 3, 4, 5])
    expect(slice.tail).not.toBe(list.tail)
  })

  it('returns an empty slice', () => {
    const list = new ll(1, 2, 3)
    const slice = list.slice(2, 2)
    expect(slice).toHaveLength(0)
    expect(slice.toArray()).toStrictEqual([])
    checkIntegrity(slice)
    checkIntegrity(list)
  })

  it('returns empty if start is out of bounds', () => {
    const list = new ll(1, 2, 3)
    const slice = list.slice(3)
    expect(slice).toHaveLength(0)
    expect(slice.toArray()).toStrictEqual([])
    checkIntegrity(slice)
    checkIntegrity(list)
  })

  it('returns empty if the sliced list is empty', () => {
    const list = new ll()
    const slice = list.slice(1)
    expect(slice).toHaveLength(0)
    expect(slice.toArray()).toStrictEqual([])
    checkIntegrity(list)
    checkIntegrity(slice)
  })
})
