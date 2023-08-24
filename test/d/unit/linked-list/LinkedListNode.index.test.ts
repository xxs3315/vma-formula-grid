import { ll } from '../../../../src/utils'
import { lln } from '../../../../src/utils'

describe('linkedListNode.index', () => {
  it('gets the correct index', () => {
    const list = new ll(1, 2, 3)
    expect(list.tail!.index).toBe(2)
  })

  it('returns undefined when no list is defined on the node', () => {
    const node = new lln(1, null, null, null)
    expect(node.index).toBeUndefined()
  })
})
