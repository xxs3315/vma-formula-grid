import { ll } from '../../../../src/utils'
import checkIntegrity from './list-integrity'

describe('linkedList.clear', () => {
  it('clears the list', () => {
    const list = new ll(1, 2, 3)
    list.clear()
    checkIntegrity(list)
  })
})
