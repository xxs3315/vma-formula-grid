import { ll } from '../../../../src/utils'

describe('linkedList.find', () => {
  it('returns the data of the first node that satisfies the test function', () => {
    const list = new ll(1, 2, 3, 4, 5)
    const value = list.find((data) => data === 3)
    expect(value).toBe(3)
  })

  it('returns undefined if the value is not present', () => {
    const list = new ll(1, 2, 3, 4, 5)
    const value = list.find((data) => data === 6)
    expect(value).toBeUndefined()
  })
})
