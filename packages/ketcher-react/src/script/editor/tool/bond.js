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

import {
  Bond,
  Vec2,
  bondChangingAction,
  fromBondAddition,
  fromBondsAttrs,
  FunctionalGroup
} from 'ketcher-core'

import utils from '../shared/utils'

function BondTool(editor, blockedEntities, bondProps) {
  if (!(this instanceof BondTool)) {
    if (!editor.selection() || !editor.selection().bonds)
      return new BondTool(editor, blockedEntities, bondProps)

    const action = fromBondsAttrs(
      editor.render.ctab,
      editor.selection().bonds,
      bondProps
    )
    editor.update(action)
    editor.selection(null)
    return null
  }

  this.blockedEntities = blockedEntities
  this.editor = editor
  this.atomProps = { label: 'C' }
  this.bondProps = bondProps
  this.struct = editor.render.ctab
  this.sgroups = editor.render.ctab.sgroups
  this.molecule = editor.render.ctab.molecule
  this.functionalGroups = this.molecule.functionalGroups
}

BondTool.prototype.mousedown = function (event) {
  if (this.dragCtx) return
  const ci = this.editor.findItem(event, ['atoms', 'bonds'])
  const atomResult = []
  const bondResult = []
  const result = []
  if (ci && this.functionalGroups && ci.map === 'atoms') {
    const atomId = FunctionalGroup.atomsInFunctionalGroup(
      this.functionalGroups,
      ci.id
    )
    const atomFromStruct = atomId !== null && this.struct.atoms.get(atomId).a
    if (
      atomId &&
      !FunctionalGroup.isBondInContractedFunctionalGroup(
        atomFromStruct,
        this.sgroups,
        this.functionalGroups,
        true
      )
    )
      atomResult.push(atomId)
  }
  if (ci && this.functionalGroups && ci.map === 'bonds') {
    const bondId = FunctionalGroup.bondsInFunctionalGroup(
      this.molecule,
      this.functionalGroups,
      ci.id
    )
    const bondFromStruct = bondId !== null && this.struct.bonds.get(bondId).b
    if (
      bondId &&
      !FunctionalGroup.isBondInContractedFunctionalGroup(
        bondFromStruct,
        this.sgroups,
        this.functionalGroups,
        true
      )
    )
      bondResult.push(bondId)
  }
  if (atomResult.length > 0) {
    for (let id of atomResult) {
      const fgId = FunctionalGroup.findFunctionalGroupByAtom(
        this.functionalGroups,
        id
      )
      if (fgId !== null && !result.includes(fgId)) {
        result.push(fgId)
      }
    }
    this.editor.event.removeFG.dispatch({ fgIds: result })
    return
  } else if (bondResult.length > 0) {
    for (let id of bondResult) {
      const fgId = FunctionalGroup.findFunctionalGroupByBond(
        this.molecule,
        this.functionalGroups,
        id
      )
      if (fgId !== null && !result.includes(fgId)) {
        result.push(fgId)
      }
    }
    this.editor.event.removeFG.dispatch({ fgIds: result })
    return
  }
  const rnd = this.editor.render
  this.editor.hover(null)
  this.editor.selection(null)
  this.dragCtx = {
    xy0: rnd.page2obj(event),
    item: this.editor.findItem(event, ['atoms', 'bonds'])
  }
  if (!this.dragCtx.item)
    // ci.type == 'Canvas'
    delete this.dragCtx.item
  return true
}

BondTool.prototype.mousemove = function (event) {
  // eslint-disable-line max-statements
  const editor = this.editor
  const rnd = editor.render
  if ('dragCtx' in this) {
    const dragCtx = this.dragCtx

    const pos = rnd.page2obj(event)
    let angle = utils.calcAngle(dragCtx.xy0, pos)
    if (!event.ctrlKey) angle = utils.fracAngle(angle)

    const degrees = utils.degrees(angle)
    this.editor.event.message.dispatch({ info: degrees + 'º' })

    if (!('item' in dragCtx) || dragCtx.item.map === 'atoms') {
      if ('action' in dragCtx) dragCtx.action.perform(rnd.ctab)
      let i1
      let i2
      let p1
      let p2
      if ('item' in dragCtx && dragCtx.item.map === 'atoms') {
        // first mousedown event intersect with any atom
        i1 = dragCtx.item.id
        i2 = editor.findItem(event, ['atoms'], dragCtx.item)
      } else {
        // first mousedown event intersect with any canvas
        i1 = this.atomProps
        p1 = dragCtx.xy0
        i2 = editor.findItem(event, ['atoms'])
        const atomResult = []
        const result = []
        if (i2 && i2.map === 'atoms' && this.functionalGroups && this.dragCtx) {
          const atomId = FunctionalGroup.atomsInFunctionalGroup(
            this.functionalGroups,
            i2.id
          )
          const atomFromStruct =
            atomId !== null && this.struct.atoms.get(atomId).a
          if (
            atomFromStruct &&
            !FunctionalGroup.isAtomInContractedFinctionalGroup(
              atomFromStruct,
              this.sgroups,
              this.functionalGroups,
              true
            )
          )
            atomResult.push(atomId)
        }
        if (atomResult.length > 0) {
          for (let id of atomResult) {
            const fgId = FunctionalGroup.findFunctionalGroupByAtom(
              this.functionalGroups,
              id
            )
            fgId !== null && !result.includes(fgId) && result.push(fgId)
          }
        }
        if (result.length > 0) {
          this.editor.event.removeFG.dispatch({ fgIds: result })
          delete this.dragCtx
          return
        }
      }
      let dist = Number.MAX_VALUE
      if (i2 && i2.map === 'atoms') {
        // after mousedown events is appered, cursor is moved and then cursor intersects any atoms
        i2 = i2.id
      } else {
        i2 = this.atomProps
        const xy1 = rnd.page2obj(event)
        dist = Vec2.dist(dragCtx.xy0, xy1)
        if (p1) {
          // rotation only, leght of bond = 1;
          p2 = utils.calcNewAtomPos(p1, xy1, event.ctrlKey)
        } else {
          // first mousedown event intersect with any atom and
          // rotation only, leght of bond = 1;
          const atom = rnd.ctab.molecule.atoms.get(i1)
          p1 = utils.calcNewAtomPos(atom.pp.get_xy0(), xy1, event.ctrlKey)
        }
      }
      // don't rotate the bond if the distance between the start and end point is too small
      if (dist > 0.3)
        dragCtx.action = fromBondAddition(
          rnd.ctab,
          this.bondProps,
          i1,
          i2,
          p1,
          p2
        )[0]
      else delete dragCtx.action
      this.editor.update(dragCtx.action, true)
      return true
    }
  }
  this.editor.hover(this.editor.findItem(event, ['atoms', 'bonds']))
  return true
}

BondTool.prototype.mouseup = function (event) {
  // eslint-disable-line max-statements
  if ('dragCtx' in this) {
    var dragCtx = this.dragCtx
    var rnd = this.editor.render
    var struct = rnd.ctab.molecule
    if ('action' in dragCtx) {
      this.editor.update(dragCtx.action)
    } else if (!('item' in dragCtx)) {
      var xy = rnd.page2obj(event)
      var v = new Vec2(1.0 / 2, 0).rotate(
        this.bondProps.type === Bond.PATTERN.TYPE.SINGLE ? -Math.PI / 6 : 0
      )
      var bondAddition = fromBondAddition(
        rnd.ctab,
        this.bondProps,
        { label: 'C' },
        { label: 'C' },
        Vec2.diff(xy, v),
        Vec2.sum(xy, v)
      )

      this.editor.update(bondAddition[0])
    } else if (dragCtx.item.map === 'atoms') {
      // when does it hapend?
      this.editor.update(
        fromBondAddition(rnd.ctab, this.bondProps, dragCtx.item.id)[0]
      )
    } else if (dragCtx.item.map === 'bonds') {
      var bondProps = Object.assign({}, this.bondProps)
      var bond = struct.bonds.get(dragCtx.item.id)

      this.editor.update(
        bondChangingAction(rnd.ctab, dragCtx.item.id, bond, bondProps)
      )
    }
    delete this.dragCtx
  }
  this.editor.event.message.dispatch({
    info: false
  })
  return true
}

export default BondTool
