import { ll } from '../../../../src/utils'
import checkIntegrity from './list-integrity'

describe('linkedList.pop', () => {
  it('correctly pops', () => {
    const l = new ll(1, 2, 3)
    const value = l.pop()
    expect(value).toBe(3)
    expect(l.tail!.data).toBe(2)
    checkIntegrity(l)
    // Pop 2
    l.pop()
    checkIntegrity(l)
    // Pop 1
    l.pop()
    checkIntegrity(l)
    // Pop empty
    const empty = l.pop()
    checkIntegrity(l)
    expect(empty).toBeUndefined()
  })
})
