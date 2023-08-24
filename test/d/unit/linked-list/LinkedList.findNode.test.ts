import { ll } from '../../../../src/utils'

describe('linkedList.find', () => {
  it('returns the data of the first node that satisfies the test function', () => {
    const list = new ll(1, 2, 3, 4, 5)
    const node = list.findNode((data) => data === 1)
    expect(node!.data).toBe(1)
    expect(list.head).toBe(node)
  })

  it('returns undefined if the value is not present', () => {
    const list = new ll(1, 2, 3, 4, 5)
    const value = list.findNode((data) => data === 6)
    expect(value).toBeUndefined()
  })
})
