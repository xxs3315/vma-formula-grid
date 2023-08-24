import { ll } from '../../../../src/utils'
import checkIntegrity from './list-integrity'

describe('linkedList.merge', () => {
  it('merges two lists', () => {
    const listA = new ll(1, 2, 3)
    const listB = new ll(4, 5, 6)
    listA.merge(listB)
    checkIntegrity(listA)
    checkIntegrity(listB)
    expect(listA).toHaveLength(listB.length)
  })

  it('merges when one of the lists is empty', () => {
    const listA = new ll()
    const listB = new ll(1, 2, 3)
    listA.merge(listB)
    checkIntegrity(listA)
    checkIntegrity(listB)
    expect(listA).toHaveLength(listB.length)
    const listC = new ll()
    listA.merge(listC)
    checkIntegrity(listA)
    checkIntegrity(listC)
    expect(listA).toHaveLength(listC.length)
  })
})
