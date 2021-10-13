import * as utils from '../utils'

import { ReStruct, singleBond } from './data'

import { fromBondAddition } from '../bond'

const [action, begin, end] = fromBondAddition(
  ReStruct as any,
  singleBond as any,
  1,
  undefined
)

describe('Bond Addition', () => {
  it('function atomForNewBond was called when end undefined', () => {
    const spy = jest.spyOn(utils, 'atomForNewBond')
    fromBondAddition(ReStruct as any, singleBond as any, 3, undefined)
    expect(spy).toHaveBeenCalled()
  })
  it('function atomGetAttr was called', () => {
    const spy = jest.spyOn(utils, 'atomGetAttr')
    fromBondAddition(ReStruct as any, singleBond as any, 5, 1)
    expect(spy).toHaveBeenCalled()
  })
  it('should contain operation CalcImplicitH', () => {
    const CalcImplicitH = action.operations.find(
      operation => operation.type === 'Calculate implicit hydrogen'
    )
    expect(CalcImplicitH).toBeDefined()
  })
  it('should contain operation Add fragment stereo flag', () => {
    const addFragment = action.operations.find(
      operation => operation.type === 'Add fragment stereo flag'
    )
    expect(addFragment).toBeDefined()
  })
  it('bond begin should be defined', () => {
    expect(begin).toBeDefined()
  })
  it('bond end should be defined', () => {
    expect(end).toBeDefined()
  })
})
