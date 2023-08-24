import { ll } from '../../../../src/utils'

describe('linkedList.find', () => {
  it('returns the data of the first node that satisfies the test function', () => {
    const list = new ll(1, 2, 3, 4, 5)
    const index = list.findIndex((data) => data === 5)
    expect(index).toBe(4)
  })

  it('returns -1 if the data is not present', () => {
    const list = new ll(1, 2, 3, 4, 5)
    const index = list.findIndex((data) => data === 6)
    expect(index).toBe(-1)
  })
})
