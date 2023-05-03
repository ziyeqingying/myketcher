import {
  Action,
  fromFragmentDeletion,
  fromItemsFuse,
  fromSgroupDeletion,
  ReStruct,
  setExpandSGroup,
  SGroup
} from 'ketcher-core'
import Editor from '../../Editor'
import { getGroupIdsFromItemMaps } from './getGroupIdsFromItems'

type MergeItems = {
  atoms: Map<number, number>
  bonds: Map<number, number>
  atomToFunctionalGroup?: Map<number, number>
}

export function dropAndMerge(
  editor: Editor,
  mergeItems: MergeItems,
  action?: Action,
  resizeCanvas?: boolean
): Action {
  const restruct = editor.render.ctab
  const isMerging = !!mergeItems
  let dropItemAction = new Action()

  if (isMerging) {
    const expandGroupsAction = getExpandGroupsInMergeAction(
      editor.render.ctab,
      mergeItems
    )
    dropItemAction = dropItemAction.mergeWith(expandGroupsAction)
    if (mergeItems.atomToFunctionalGroup) {
      const [newMergeItems, extractAttachmentAtomAction] =
        extractAttachmentAtom(mergeItems, editor)
      mergeItems = newMergeItems
      dropItemAction = dropItemAction.mergeWith(extractAttachmentAtomAction)
    }
    dropItemAction = fromItemsFuse(restruct, mergeItems).mergeWith(
      dropItemAction
    )
  }

  if (action) {
    dropItemAction = dropItemAction.mergeWith(action)
  }

  editor.hover(null)
  if (isMerging) editor.selection(null)

  if (dropItemAction?.operations.length > 0) {
    editor.update(dropItemAction, false, { resizeCanvas: !!resizeCanvas })
  }

  return dropItemAction
}

function getExpandGroupsInMergeAction(
  restruct: ReStruct,
  mergeItems: MergeItems
): Action {
  const action = new Action()
  const groupsInMerge = getGroupIdsFromItemMaps(restruct.molecule, mergeItems)
  if (groupsInMerge.length) {
    groupsInMerge.forEach((groupId) => {
      action.mergeWith(setExpandSGroup(restruct, groupId, { expanded: true }))
    })
  }

  return action
}

/**
 * @example
 * const mergeItems = {
 *   atomToFunctionalGroup: { 3 => 1 } // Drag atom-3 and drop on functional-group-1
 * }
 * // Given functional-group-1's attachment atom is atom-0
 * const [
 *   newMergeItems, // { atoms: { 3 => 0 } }
 *   action // action to remove non-attachment atoms and that S-Group
 * ] = extractAttachmentAtom(mergeItems)
 */
function extractAttachmentAtom(mergeItems: MergeItems, editor: Editor) {
  const struct = editor.struct()
  const reStruct = editor.render.ctab

  const newMergeItems = {
    atoms: new Map(mergeItems.atoms),
    bonds: new Map(mergeItems.bonds)
  }

  const action = new Action()

  mergeItems.atomToFunctionalGroup?.forEach((functionalGroupId, srcAtomId) => {
    const reSGroup = reStruct.sgroups.get(functionalGroupId)
    const reSGroupAtoms = SGroup.getAtoms(reStruct.molecule, reSGroup?.item)
    const [firstAtom] = reSGroupAtoms
    const atomNeighbours = reStruct.molecule.atomGetNeighbors(firstAtom)
    const isExtraNeighbour = atomNeighbours?.some(
      (atom) => !reSGroupAtoms.includes(atom.aid)
    )

    const targetAtomId = isExtraNeighbour
      ? struct.sgroups.get(functionalGroupId)?.getAttAtomId(struct)
      : firstAtom

    if (targetAtomId !== undefined) {
      const atomsToDelete = [
        ...SGroup.getAtoms(reStruct.molecule, reSGroup?.item)
      ].filter((atomId) => atomId !== targetAtomId)
      action.mergeWith(fromSgroupDeletion(reStruct, functionalGroupId))
      action.mergeWith(
        fromFragmentDeletion(reStruct, {
          atoms: atomsToDelete
        })
      )
      newMergeItems.atoms.set(srcAtomId, targetAtomId)
    }
  })

  return [newMergeItems, action] as const
}
