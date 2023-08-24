import { ll } from '../../../../src/utils'
import { lln } from '../../../../src/utils'

export default function (list: ll) {
  expect(list).toBeDefined()
  expect(list).toBeInstanceOf(ll)

  if (list.length > 0) {
    expect(list.head).toBeDefined()
    expect(list.head).toBeInstanceOf(lln)
    expect(list.tail).toBeDefined()
    expect(list.tail).toBeInstanceOf(lln)
    expect(list.head!.prev).toBeNull()
    expect(list.tail!.next).toBeNull()

    if (list.length > 1) {
      expect(list.head!.next).not.toBeNull()
      expect(list.tail!.prev).not.toBeNull()
    } else {
      expect(list.head).toBe(list.tail)
      expect(list.head!.next).toBeNull()
      expect(list.tail!.prev).toBeNull()
    }

    // Check length
    const count = list.reduce((i) => i + 1, 0)
    const countReverse = list.reduce((i) => i + 1, 0, true)
    expect(count).toBe(list.length)
    expect(countReverse).toBe(list.length)
  } else {
    expect(list.head).toBeNull()
    expect(list.tail).toBeNull()
    expect(list).toHaveLength(0)
  }
}
