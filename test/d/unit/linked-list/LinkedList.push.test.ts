import { ll } from '../../../../src/utils'
import checkIntegrity from './list-integrity'

describe('linkedList.push', () => {
  it('pushes a new node to the end of the list', () => {
    const list = new ll(1, 2)
    list.push(3)
    checkIntegrity(list)
    expect(list.toArray()).toStrictEqual([1, 2, 3])
  })

  it('pushes many args', () => {
    const list = new ll(1, 2)
    const value = list.push(3, 4)
    expect(value).toBe(4)
    checkIntegrity(list)
    expect(list.toArray()).toStrictEqual([1, 2, 3, 4])
  })
})
