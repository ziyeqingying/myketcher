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

import { Pile } from './pile'
import { Pool } from './pool'
import assert from 'assert'

export interface RGroupAttributes {
  index: number
  ifthen?: number
  resth?: boolean
  range?: string
  frags?: Pile<number>
}
export class RGroup {
  index: number
  frags: Pile<number>
  resth: boolean
  range: string
  ifthen: number

  constructor(attributes: RGroupAttributes) {
    assert(attributes != null)
    assert(attributes.index > 0)

    this.index = attributes.index
    this.frags = attributes.frags || new Pile<number>()
    this.resth = attributes.resth || false
    this.range = attributes.range || ''
    this.ifthen = attributes.ifthen || 0
  }

  static findRGroupByFragment(rgroups: Pool<RGroup>, frid: number) {
    return rgroups.find((_rgid, rgroup) => rgroup.frags.has(frid))
  }

  getAttrs(): RGroupAttributes {
    return {
      index: this.index,
      resth: this.resth,
      range: this.range,
      ifthen: this.ifthen
    }
  }

  clone(fidMap?: Map<number, number> | null): RGroup {
    const ret = new RGroup(this)
    this.frags.forEach(fid => {
      ret.frags.add(fidMap ? fidMap.get(fid)! : fid)
    })
    return ret
  }
}
