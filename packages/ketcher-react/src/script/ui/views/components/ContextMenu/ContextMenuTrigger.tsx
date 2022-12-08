/****************************************************************************
 * Copyright 2022 EPAM Systems
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

import { FunctionalGroup } from 'ketcher-core'
import { useCallback } from 'react'
import { useContextMenu } from 'react-contexify'
import { useAppContext } from 'src/hooks'
import Editor from 'src/script/editor'
import { ContextMenuItemProps, CONTEXT_MENU_ID } from './ContextMenu'

const ContextMenuTrigger: React.FC = ({ children }) => {
  const { getKetcherInstance } = useAppContext()
  const { show, hideAll } = useContextMenu<ContextMenuItemProps>({
    id: CONTEXT_MENU_ID
  })

  const handleDisplay = useCallback(
    (event) => {
      const editor = getKetcherInstance().editor as Editor
      const ci = editor.findItem(event, ['bonds'])

      if (!ci) {
        hideAll()
        return
      }

      // Resolve conflict with existing functional group context menu
      // (Need refactor after refactoring functional group context menu @Yulei)
      // Resolving begins
      const struct = editor.struct()
      const functionalGroupId = FunctionalGroup.findFunctionalGroupByBond(
        struct,
        struct.functionalGroups,
        ci.id
      )
      const hasRelatedSGroup = struct.functionalGroups.some(
        (item) => item.relatedSGroupId === functionalGroupId
      )

      if (functionalGroupId !== null && hasRelatedSGroup) {
        hideAll()
        return
      }

      const selection = editor.selection()
      if (selection && selection.atoms) {
        const hasSelectedFunctionalGroup = selection.atoms.some((atomId) => {
          const functionalGroupId = FunctionalGroup.findFunctionalGroupByAtom(
            struct.functionalGroups,
            atomId
          )
          const hasRelatedSGroupId = struct.functionalGroups.some(
            (item) => item.relatedSGroupId === functionalGroupId
          )
          return functionalGroupId !== null && hasRelatedSGroupId
        })
        if (hasSelectedFunctionalGroup) return
      }
      // Resolving ends

      const isRightClickingSelection: number | undefined = selection?.[
        ci.map
      ]?.findIndex((selectedItemId) => selectedItemId === ci.id)

      if (
        isRightClickingSelection !== undefined &&
        isRightClickingSelection !== -1
      ) {
        // Show menu items for batch updates
        show({
          event,
          props: {
            selected: true,
            ci
          }
        })
      } else if (ci.map === 'bonds') {
        // Show menu items for single update
        if (selection) {
          editor.render.ctab.setSelection(null)
        }
        show({
          event,
          props: { selected: false, ci }
        })
      }
    },
    [getKetcherInstance, hideAll, show]
  )

  return (
    <div style={{ height: '100%' }} onContextMenu={handleDisplay}>
      {children}
    </div>
  )
}

export default ContextMenuTrigger
