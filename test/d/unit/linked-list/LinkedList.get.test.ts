import { ll } from '../../../../src/utils'

describe('linkedList.get', () => {
  it('returns correct data at index 2', () => {
    const list = new ll(1, 2, 3)
    const value = list.get(2)
    expect(value).toBe(3)
  })

  it('returns undefined if index is out of bounds', () => {
    const list = new ll(1, 2, 3)
    const value = list.get(4)
    expect(value).toBeUndefined()
  })
})
