import { ll } from '../../../../src/utils'

describe('linkedListNode.value', () => {
  it('returns the data on the value property', () => {
    const list = new ll(1)
    expect(list.head!.value).toBe(1)
    expect(list.head!.value).toBe(list.head!.data)
  })
})
