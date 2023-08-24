import { ll } from '../../../../src/utils'
import { lln } from '../../../../src/utils'

describe('linkedListNode.insertBefore', () => {
  it('inserts a node before this one', () => {
    const list = new ll(2, 3)
    list.head!.insertBefore(1)
    expect(list.toArray()).toStrictEqual([1, 2, 3])
  })

  it('throws if list is not set', () => {
    const node = new lln(1, null, null, null)
    expect(node.insertBefore(0)).toBeInstanceOf(ll)
  })
})
