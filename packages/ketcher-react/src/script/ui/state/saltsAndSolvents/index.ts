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

import { AnyAction } from 'redux'
import { appUpdate } from '../options'
import {
  SaltsAndSolventsProvider,
  FunctionalGroupsProvider,
  SdfItem,
  SdfSerializer,
  Struct
} from 'ketcher-core'
import { prefetchStatic } from '../templates/init-lib'
import { RenderStruct } from '../../utils'

interface SaltsAndSolventsState {
  lib: []
  mode: string
}

const initialState: SaltsAndSolventsState = {
  lib: [],
  mode: 'fg'
}

const saltsAndSolventsReducer = (
  state = initialState,
  { type, payload }: AnyAction
) => {
  switch (type) {
    case 'SALTS_AND_SOLVENTS_INIT':
      return { ...state, ...payload }

    default:
      return state
  }
}

const initSaltsAndSolvents = (lib: SdfItem[]) => ({
  type: 'SALTS_AND_SOLVENTS_INIT',
  payload: { lib }
})

// This prerender adds part of structures to cache
const prerenderPartOfStructures = (saltsAndSolvents: Struct[], settings) => {
  const part = saltsAndSolvents.slice(0, 50)
  part.forEach((struct) => {
    const div = document.createElement('div')
    div.style.width = '100px'
    div.style.height = '100px'
    div.style.display = 'none'
    document.body.appendChild(div)
    RenderStruct.render(div, struct, { ...settings, autoScaleMargin: 15 })
    div.remove()
  })
}

export function initSaltsAndSolventsTemplates(baseUrl: string) {
  return async (dispatch, getState) => {
    const fileName = 'salts-and-solvents.sdf'
    const { settings } = getState().options
    const url = `${baseUrl}/templates/${fileName}`
    const saltsAndSolventsProvider = SaltsAndSolventsProvider.getInstance()
    const functionalGroupsProvider = FunctionalGroupsProvider.getInstance()
    const sdfSerializer = new SdfSerializer()
    const text = await prefetchStatic(url)
    const templates = sdfSerializer.deserialize(text)
    const saltsAndSolvents = templates.reduce(
      (acc: Struct[], { struct, props }) => {
        struct.abbreviation = String(props.abbreviation)
        acc.push(struct)
        return acc
      },
      []
    )
    prerenderPartOfStructures(saltsAndSolvents, settings)
    saltsAndSolventsProvider.setSaltsAndSolventsList(saltsAndSolvents)
    functionalGroupsProvider.addToFunctionalGroupsList(saltsAndSolvents)
    dispatch(initSaltsAndSolvents(templates))
    dispatch(appUpdate({ saltsAndSolvents: true }))
  }
}

export default saltsAndSolventsReducer
