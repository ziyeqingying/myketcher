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

import { TextAdd, TextDelete } from '../operations'
import Action from '../shared/action'

export function fromTextAddition(restruct, elem) {
  const action = new Action()
  const { id, label, position } = elem

  action.addOp(new TextAdd(id, label, position))
  return action.perform(restruct)
}

export function fromTextDeletion(restruct, elem) {
  const action = new Action()
  const { id } = elem

  action.addOp(new TextDelete(id))

  return action.perform(restruct)
}
