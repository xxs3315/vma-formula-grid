import { ll } from '../../../../src/utils'
import checkIntegrity from './list-integrity'

describe('linkedList.ts', () => {
  it('instantiates a correct empty List', () => {
    const l = new ll()
    checkIntegrity(l)
  })

  it('initialises with any number of arguments', () => {
    const l = new ll(1, 2, 3)
    checkIntegrity(l)
    expect(l.head!.data).toBe(1)
    expect(l.tail!.data).toBe(3)
  })

  it('converts to an array', () => {
    const l = new ll(1, 2, 3)
    const a = l.toArray()
    expect(a).toStrictEqual([1, 2, 3])
  })

  it('converts an empty list to an array', () => {
    const l = new ll()
    const a = l.toArray()
    expect(a).toStrictEqual([])
  })

  it('converts to string', () => {
    const list = new ll<any>(true, 2, 'three')
    const defaultSeparator = list.toString()
    const customSeparator = list.toString(' <=> ')
    checkIntegrity(list)
    expect(defaultSeparator).toBe('true 2 three')
    expect(customSeparator).toBe('true <=> 2 <=> three')
  })
})
