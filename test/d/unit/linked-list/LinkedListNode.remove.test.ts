import { ll } from '../../../../src/utils'
import { lln } from '../../../../src/utils'

describe('linkedListNode.remove', () => {
  it('removes the head correctly', () => {
    const list = new ll(1, 2, 3)
    list.head!.remove()
    expect(list).toHaveLength(2)
    expect(list.head!.data).toBe(2)
    expect(list.head!.prev).toBeNull()
    expect(list.toArray()).toStrictEqual([2, 3])
  })

  it('throws when list is null', () => {
    const node = new lln(1, null, null, null)
    expect(() => node.remove()).toThrow('Node does not belong to any list')
  })
})
