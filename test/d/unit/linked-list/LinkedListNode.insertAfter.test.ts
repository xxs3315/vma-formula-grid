import { ll } from '../../../../src/utils'
import { lln } from '../../../../src/utils'

describe('linkedListNode.insertAfter', () => {
  it('inserts a node before this one', () => {
    const list = new ll(1, 2)
    list.tail!.insertAfter(3)
    expect(list.toArray()).toStrictEqual([1, 2, 3])
  })

  it('throws when list is null', () => {
    const node = new lln(1, null, null, null)
    expect(node.insertAfter(2)).toBeInstanceOf(ll)
  })
})
