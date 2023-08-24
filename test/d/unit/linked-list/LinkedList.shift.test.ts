import { ll } from '../../../../src/utils'
import checkIntegrity from './list-integrity'

describe('linkedList.shift', () => {
  it('correctly shifts', () => {
    const l = new ll(1, 2, 3)
    const value = l.shift()
    expect(value).toBe(1)
    checkIntegrity(l)
    expect(l.head!.data).toBe(2)
    // shift 2
    l.shift()
    checkIntegrity(l)
    // shift 1
    l.shift()
    checkIntegrity(l)
    // shift empty
    const empty = l.shift()
    checkIntegrity(l)
    expect(empty).toBeUndefined()
  })
})
