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
import { BaseOperation } from './base'
import { OperationType } from './OperationType'
import { Text, Vec2, scale } from 'ketcher-core'
import Restruct, { ReText } from '../../render/restruct'

interface TextCreateData {
  id?: any
  label: string
  position: Vec2
}

export class TextCreate extends BaseOperation {
  data: TextCreateData
  performed: boolean

  constructor(id: any, label: string = '', position: Vec2) {
    super(OperationType.TEXT_CREATE)
    this.data = { id, label, position }
    this.performed = false
  }

  execute(restruct: Restruct): void {
    const struct = restruct.molecule

    if (!this.performed) {
      this.data.id = struct.texts.add(new Text(this.data))
      this.performed = true
    } else {
      struct.texts.set(this.data.id, new Text(this.data))
    }

    restruct.texts.set(this.data.id, new ReText(struct.texts.get(this.data.id)))

    const { id, position } = this.data

    struct.textSetPosition(id, new Vec2(position))

    BaseOperation.invalidateItem(
      restruct,
      'texts',
      // @ts-ignore
      this.data.id,
      1
    )
  }

  invert(): BaseOperation {
    //@ts-ignore
    return new TextDelete(this.data.id)
  }
}

interface TextUpdateData {
  id?: any
  label?: string
  position?: Vec2
}

export class TextUpdate extends BaseOperation {
  oldData: TextUpdateData
  newData: TextUpdateData | null

  constructor(id?: any, label?: string, position?: Vec2) {
    super(OperationType.TEXT_UPDATE)
    this.oldData = { id, label, position }
    this.newData = null
  }

  execute(restruct: Restruct) {
    const struct = restruct.molecule
    const { id, label, position } = this.oldData
    const item = struct.texts.get(this.oldData.id)

    if (!this.newData) {
      this.newData = {
        id,
        label,
        position
      }
    }

    if (item) {
      item.label = label!
    }

    BaseOperation.invalidateItem(
      restruct,
      'texts',
      // @ts-ignore
      this.oldData.id,
      1
    )
  }

  invert() {
    const inverted = new TextUpdate()
    // @ts-ignore
    inverted.oldData = this.newData
    inverted.newData = this.oldData
    return inverted
  }
}

interface TextDeleteData {
  id: any
  label?: string
  position?: Vec2
}

export class TextDelete extends BaseOperation {
  data: TextDeleteData
  performed: boolean

  constructor(id: any) {
    super(OperationType.TEXT_DELETE)
    this.data = { id }
    this.performed = false
  }

  execute(restruct: Restruct): void {
    const struct = restruct.molecule

    if (!this.performed) {
      const item = struct.texts.get(this.data.id)!

      this.data.label = item.label || ''
      this.data.position = item.position
      this.performed = true
    }

    restruct.markItemRemoved()
    restruct.clearVisel(restruct.texts.get(this.data.id).visel)
    restruct.texts.delete(this.data.id)

    struct.texts.delete(this.data.id)
  }

  invert(): BaseOperation {
    return new TextCreate(
      this.data.id,
      this.data.label,
      // @ts-ignore
      this.data.position
    )
  }
}

interface TextMoveData {
  id: any
  d: any
  noinvalidate: boolean
}

export class TextMove extends BaseOperation {
  data: TextMoveData

  constructor(id: any, d: any, noinvalidate: boolean) {
    super(OperationType.TEXT_MOVE)
    this.data = { id, d, noinvalidate }
  }

  execute(restruct: Restruct): void {
    const struct = restruct.molecule
    const id = this.data.id
    const difference = this.data.d
    const item = struct.texts.get(id)

    item?.position?.add_(difference)
    restruct.texts
      .get(id)
      .visel.translate(scale.obj2scaled(difference, restruct.render.options))
    this.data.d = difference.negated()

    if (!this.data.noinvalidate) {
      BaseOperation.invalidateItem(
        restruct,
        'texts',
        // @ts-ignore
        id,
        1
      )
    }
  }

  invert(): BaseOperation {
    const move = new TextMove(this.data.id, this.data.d, this.data.noinvalidate)

    move.data = this.data

    return move
  }
}
