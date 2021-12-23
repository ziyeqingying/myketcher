/****************************************************************************
 * Copyright 2021 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ***************************************************************************/

import React, { useEffect } from 'react'
import { css } from '@emotion/react'

import { useAppDispatch, useAppSelector } from 'state'
import { selectEditorIsReady, fetchInitData } from 'state/common'
import { MonomerLibrary } from 'components/monomerLibrary'
import { COLORS, FONTS } from '../../styles/variables'

export const fetchData = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve('some data'), 1000)
  })

export const App = (): React.ReactElement => {
  const dispatch = useAppDispatch()
  const isReady = useAppSelector(selectEditorIsReady)

  useEffect(() => {
    dispatch(fetchInitData())
  }, [dispatch])

  const styleContainer = css({
    height: '100%',
    width: '100%',
    position: 'relative'
  })

  const styleLogo = css({
    fontFamily: FONTS.family.montserrat,
    fontSize: FONTS.size.medium,
    fontWeight: FONTS.weight['600'],
    color: COLORS.text.gray,
    position: 'absolute',
    bottom: '18px',
    left: '13px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    '> span:first-of-type, > span:last-of-type': {
      fontWeight: FONTS.weight['300'],
      fontSize: FONTS.size.xsmall,
      textTransform: 'uppercase'
    },

    '> span:last-of-type': {
      fontWeight: FONTS.weight['400']
    },

    '> span:nth-of-type(2)': {
      color: COLORS.text.black,

      '&:first-letter': {
        color: COLORS.text.gray
      }
    }
  })

  if (!isReady) {
    return <div>App is not ready</div>
  }

  return (
    <div css={styleContainer}>
      <MonomerLibrary />

      <div css={styleLogo}>
        <span>Polymer Editor</span>
        <span>Ketcher</span>
        <span>EPAM</span>
      </div>
    </div>
  )
}
