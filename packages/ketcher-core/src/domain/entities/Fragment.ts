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

import { Point, Vec2 } from './Vec2'

import { Bond } from './Bond'
import { StereoLabel } from './Atom'
import { Struct } from './Struct'

export enum StereoFlag {
  Mixed = 'MIXED',
  Abs = 'ABS',
  And = 'AND',
  Or = 'OR'
}

function calcStereoFlag(
  struct: Struct,
  stereoAids: Array<number>
): StereoFlag | undefined {
  if (!stereoAids || stereoAids.length === 0) return undefined
  const filteredStereoAtoms = stereoAids
    .map(aid => struct.atoms.get(aid))
    .filter(atom => atom?.stereoLabel)
  if (!filteredStereoAtoms.length) return undefined

  const atom = filteredStereoAtoms[0]!
  const stereoLabel = atom.stereoLabel! // {string | null} "<abs|and|or>-<group>"

  const hasAnotherLabel = filteredStereoAtoms.some(
    atom => atom?.stereoLabel !== stereoLabel
  )

  let stereoFlag: StereoFlag
  if (hasAnotherLabel) {
    stereoFlag = StereoFlag.Mixed
  } else {
    const label = stereoLabel.match(/\D+/g)?.[0]
    switch (label) {
      case StereoLabel.Abs: {
        stereoFlag = StereoFlag.Abs
        break
      }
      case StereoLabel.And: {
        stereoFlag = StereoFlag.And
        break
      }
      case StereoLabel.Or: {
        stereoFlag = StereoFlag.Or
        break
      }
      default: {
        throw new Error(`Unsupported stereo label: ${label}.`)
      }
    }
  }
  return stereoFlag
}

export class Fragment {
  #enhancedStereoFlag?: StereoFlag
  #stereoAtoms: Array<number>
  stereoFlagPosition?: Vec2

  get enhancedStereoFlag() {
    return this.#enhancedStereoFlag
  }

  get stereoAtoms(): Array<number> {
    return [...this.#stereoAtoms]
  }

  constructor(stereoAtoms: Array<number> = [], stereoFlagPosition?: Point) {
    if (stereoFlagPosition) {
      this.stereoFlagPosition = new Vec2(stereoFlagPosition)
    }

    this.#stereoAtoms = stereoAtoms
  }

  static getDefaultStereoFlagPosition(
    struct: Struct,
    fragmentId: number
  ): Vec2 {
    const fragment = struct.getFragment(fragmentId)
    const bb = fragment.getCoordBoundingBox()
    return new Vec2(bb.max.x, bb.min.y - 1)
  }

  clone(aidMap: Map<number, number>) {
    const stereoAtoms = this.#stereoAtoms.map(aid => aidMap.get(aid)!)
    const fragment = new Fragment(stereoAtoms, this.stereoFlagPosition)
    fragment.#enhancedStereoFlag = this.#enhancedStereoFlag
    return fragment
  }

  updateStereoFlag(struct: Struct): StereoFlag | undefined {
    this.#enhancedStereoFlag = calcStereoFlag(struct, this.stereoAtoms)
    return this.#enhancedStereoFlag
  }

  addStereoAtom(atomId: number): boolean {
    if (!this.#stereoAtoms.includes(atomId)) {
      this.stereoAtoms.push(atomId)
      return true
    }
    return false
  }

  deleteStereoAtom(
    struct: Struct,
    fragmentId: number,
    atomId: number
  ): boolean {
    if (
      struct.atoms.get(atomId)?.fragment !== fragmentId ||
      !Array.from(struct.bonds.values())
        .filter(bond => bond.stereo && bond.type !== Bond.PATTERN.TYPE.DOUBLE)
        .some(bond => bond.begin === atomId)
    ) {
      this.#stereoAtoms = this.#stereoAtoms.filter(item => item !== atomId)
      return true
    }
    return false
  }
}
