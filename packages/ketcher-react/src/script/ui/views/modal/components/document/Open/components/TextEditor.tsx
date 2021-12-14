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

import ClipArea from '../../../../../../component/cliparea/cliparea'

export type TextEditorProps = {
  structStr: string
  inputHandler: (str: string) => void
  fragment: boolean
  fragmentHandler: (check: boolean) => void
}

export const TextEditor = ({
  structStr,
  inputHandler,
  fragment,
  fragmentHandler
}: TextEditorProps) => {
  return (
    <>
      <textarea
        value={structStr}
        onChange={(event) => inputHandler(event.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={fragment}
          onChange={(event) => fragmentHandler(event.target.checked)}
        />
        Load as a fragment and copy to the Clipboard
      </label>
      <ClipArea
        focused={() => true}
        onCopy={() => ({ 'text/plain': structStr })}
      />{' '}
    </>
  )
}
