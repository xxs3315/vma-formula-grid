import { ll } from '../../../../src/utils'

describe('linkedList.append', () => {
  it('pushes a new node to the end of the list', () => {
    const list = new ll(1, 2)
    const val = list.append(3)
    expect(val).toBe(list)
    expect(list.toArray()).toStrictEqual([1, 2, 3])
  })

  it('pushes many args', () => {
    const list = new ll(1, 2)
    const value = list.append(3, 4)
    expect(value).toBe(list)
    expect(list.toArray()).toStrictEqual([1, 2, 3, 4])
  })
})
