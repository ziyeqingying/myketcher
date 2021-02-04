import reducer from '.'
import { INDIGO_VERIFICATION } from './request.types'

describe('requests reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      indigoVerification: false
    })
  })

  it('should handle INDIGO_VERIFICATION', () => {
    expect(
      reducer(undefined, {
        type: INDIGO_VERIFICATION,
        data: true
      })
    ).toEqual({
      indigoVerification: true
    })

    expect(
      reducer(
        {
          indigoVerification: true
        },
        {
          type: INDIGO_VERIFICATION,
          data: false
        }
      )
    ).toEqual({
      indigoVerification: false
    })
  })
})
