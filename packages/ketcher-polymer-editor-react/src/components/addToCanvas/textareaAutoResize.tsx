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

import { useCallback, useEffect, useRef } from 'react'
import styled from '@emotion/styled'

import { CONSTANTS } from './stylingHelpers'

const { lineHeight, inputFieldWidth, inputPadding } = CONSTANTS

// @TODO use theme
const commonStyles = `
  font-size: 14px;
  line-height: ${lineHeight}px;
  width: ${inputFieldWidth - inputPadding * 2}px;
  border: none;
  resize: none;
  padding: 0;
`

const FormulaTextField = styled('textarea')<{
  shouldHideOverflow: boolean
}>`
  ${commonStyles}

  // when in focus, parent div has border
  outline: none;

  ${({ shouldHideOverflow }) =>
    shouldHideOverflow
      ? `white-space: nowrap;
  overflow: hidden;`
      : null}
`

// invisible textarea to dynamically calculate height
const HiddenArea = styled('textarea')`
  ${commonStyles}

  // Making invisible, removing from content flow
  visibility: hidden;
  position: absolute;
  overflow: hidden;
  height: 0;
  top: 0;
  left: 0;
  transform: translateZ(0);
`

const Ellipsis = styled('span')<{ shouldDisplay: boolean }>`
  ${({ shouldDisplay }) =>
    shouldDisplay
      ? `display: inline-block;
      position: absolute;
      right: 0px;
      line-height: ${lineHeight}px;
      padding-left: 3px;
      padding-right: ${inputPadding}px;
      background-color: white;
      box-shadow: -3px 0px 5px 2px white;`
      : `display: none`}
`

type Props = {
  inputValue: string
  inputHandler: (value: string) => void
  isFocused: boolean
  isMultiLine: boolean
  isCollapsed: boolean
  setMultiLine: (value: boolean) => void
  maxRows: number
}

export const TextareaAutoResize = ({
  inputValue,
  inputHandler,
  isFocused,
  isMultiLine,
  isCollapsed,
  setMultiLine,
  maxRows = 8
}: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hiddenRef = useRef<HTMLTextAreaElement>(null)
  console.log('Render')

  const updateHeight = useCallback(() => {
    const textarea = textareaRef.current
    const hiddenTextarea = hiddenRef.current

    if (!textarea || !hiddenTextarea) {
      return
    }
    hiddenTextarea.value = ' '
    const oneLineHeight = hiddenTextarea.scrollHeight

    hiddenTextarea.value = inputValue
    const scrollHeight = hiddenTextarea.scrollHeight
    hiddenTextarea.value = ' '

    const newHeight = Math.min(Number(maxRows) * oneLineHeight, scrollHeight)

    // Informing parent if content needs more than 1 line
    const hasSeveralRows = scrollHeight / oneLineHeight > 1
    setMultiLine(hasSeveralRows)

    textarea.style.height = `${newHeight}px`
  }, [maxRows, inputValue, setMultiLine])

  useEffect(() => {
    updateHeight()
  }, [updateHeight])

  useEffect(() => {
    const textarea = textareaRef.current
    if (isFocused && textarea) {
      textarea.focus()
    }
  }, [isFocused])

  const onChangeHandler = (event) => {
    inputHandler(event.target.value)
  }
  return (
    <>
      <FormulaTextField
        ref={textareaRef}
        value={inputValue}
        onChange={onChangeHandler}
        shouldHideOverflow={isMultiLine && isCollapsed}
      />
      <Ellipsis shouldDisplay={isMultiLine && isCollapsed}>...</Ellipsis>
      <HiddenArea aria-hidden="true" ref={hiddenRef} />
    </>
  )
}
