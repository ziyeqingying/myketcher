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

import { FormatterFactory } from 'ketcher-core'
import { Ketcher } from '../../ketcher'

async function copyImageToClipboard() {
  const state = global.currentState
  const editor = state.editor
  const server = state.server
  const options = state.options
  const struct = editor.structSelected()

  const factory = new FormatterFactory(server)
  const service = factory.create('mol', options)
  const structStr = await service.getStructureFromStructAsync(struct)
  const ketcher = new Ketcher(editor, server, {}, factory)
  const image = await ketcher.generateImageAsync(structStr, {
    outputFormat: 'png'
  })

  try {
    const item = new ClipboardItem({ [image.type]: image }) // eslint-disable-line no-undef
    await navigator.clipboard.write([item])
  } catch (err) {
    alert('This feature is not available in your browser')
  }
}

export default copyImageToClipboard
