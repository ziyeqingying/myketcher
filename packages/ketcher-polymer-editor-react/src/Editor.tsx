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

import { useEffect, useRef } from 'react'
import { css } from '@emotion/react'
import clsx from 'clsx'
import { AppContainer } from 'components/App'
import { COLORS } from './styles/variables'

interface EditorProps {
  onInit?: () => void
}

function Editor(props: EditorProps) {
  const rootElRef = useRef<HTMLDivElement>(null)
  const { onInit } = props

  useEffect(() => {
    onInit?.()
  }, [onInit])

  const styleRoot = css({
    height: '100%',
    width: '100%',
    position: 'relative',
    minWidth: 640,
    minHeight: 400,
    backgroundColor: COLORS.background.canvas,
    padding: '14px 11px 0 11px',
    boxSizing: 'border-box'
  })

  return (
    <div
      ref={rootElRef}
      className={clsx('Ketcher-polymer-editor-root')}
      css={styleRoot}
    >
      <AppContainer />
    </div>
  )
}

export { Editor }
