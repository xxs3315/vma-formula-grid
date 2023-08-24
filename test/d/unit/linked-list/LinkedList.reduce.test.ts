import { ll } from '../../../../src/utils'

describe('linkedList.reduce', () => {
  it('reduces a list to its count', () => {
    const l1 = new ll(1, 2, 3)
    const l2 = new ll(1)
    const count = l1.reduce((c) => c + 1, 0)
    const count2 = l2.reduce((c) => c + 1, 0)
    expect(count2).toBe(1)
    expect(count).toBe(3)
  })

  it('calls the reducer function with the correct arguments', () => {
    const l = new ll(1, 2)
    const mock = jest.fn((acc, curr, index, list) => {
      expect(acc).toBe(l.head!.data)
      expect(curr).toBe(l.tail!.data)
      expect(index).toBe(0)
      expect(list).toBe(l)
    })
    l.reduce(mock)
    expect(mock).toHaveBeenCalledTimes(1)
  })

  it('returns the start value if the list is empty', () => {
    const list = new ll()
    const value = list.reduce(jest.fn(), 'habakuk')
    expect(value).toBe('habakuk')
  })

  it('reduces in reverse order', () => {
    const list = new ll(1, 2, 3, 4, 5)
    const reduced = list.reduce(
      (l, data) => l.append(data),
      new ll(),
      true,
    )
    expect(reduced.toArray()).toStrictEqual([5, 4, 3, 2, 1])
  })

  it('throws when reducing an empty list without start value', () => {
    const list = new ll()
    expect(() => list.reduce(() => false)).toThrow(
      'Reduce of empty ll with no initial value',
    )
  })
})
