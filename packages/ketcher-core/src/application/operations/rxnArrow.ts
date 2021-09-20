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

import { Point, RxnArrow, RxnArrowMode, Struct, Vec2 } from 'domain/entities'

import { BaseOperation } from './baseOperation'
import { PerformOperationResult } from './operations.types'
import assert from 'assert'
import { tfx } from 'utils'

export class AddRxnArrow extends BaseOperation {
  #rxnArrowId?: number
  #points: Array<Point>
  #mode: RxnArrowMode

  constructor(
    points: Array<Vec2>,
    mode: RxnArrowMode = 'OPEN_ANGLE',
    rxnArrowId?: number
  ) {
    assert(points && points.length > 0)

    super('RXN_ARROW_ADD')

    this.#points = points
    this.#mode = mode
    this.#rxnArrowId = rxnArrowId
  }

  execute(target: Struct): PerformOperationResult {
    const rxnArrow = new RxnArrow({ mode: this.#mode, points: this.#points })

    let rxnArrowId: number
    if (typeof this.#rxnArrowId !== 'number') {
      rxnArrowId = target.rxnArrows.add(rxnArrow)
    } else {
      target.rxnArrows.set(this.#rxnArrowId, rxnArrow)
      rxnArrowId = this.#rxnArrowId
    }

    // TODO: move to renderer
    //restruct.rxnArrows.set(itemId, new ReRxnArrow(rxnArrow))
    //Base.invalidateItem(restruct, 'rxnArrows', itemId, 1)

    const inverseOperation = new DeleteRxnArrow(rxnArrowId)
    return { inverseOperation, entityId: rxnArrowId, operationType: this.type }
  }
}

export class DeleteRxnArrow extends BaseOperation {
  #rxnArrowId: number

  constructor(rxnArrowId: number) {
    super('RXN_ARROW_DELETE')

    this.#rxnArrowId = rxnArrowId
  }

  execute(target: Struct): PerformOperationResult {
    const rxnArrow = target.rxnArrows.get(this.#rxnArrowId)!

    // TODO: move to renderer
    // restruct.markItemRemoved()
    // restruct.clearVisel(restruct.rxnArrows.get(this.data.id).visel)
    // restruct.rxnArrows.delete(this.data.id)

    target.rxnArrows.delete(this.#rxnArrowId)

    const inverseOperation = new AddRxnArrow(
      rxnArrow.points,
      rxnArrow.mode,
      this.#rxnArrowId
    )

    return {
      inverseOperation,
      entityId: this.#rxnArrowId,
      operationType: this.type
    }
  }
}

export class MoveRxnArrow extends BaseOperation {
  #rxnArrowId: number
  #delta: Vec2

  constructor(rxnArrowId: number, delta: Vec2) {
    super('RXN_ARROW_MOVE')

    this.#rxnArrowId = rxnArrowId
    this.#delta = delta
  }

  execute(target: Struct): PerformOperationResult {
    const rxnArrow = target.rxnArrows.get(this.#rxnArrowId)!
    rxnArrow.points.forEach(p => p.add_(this.#delta))

    // TODO: move to renderer
    // restruct.rxnArrows
    //   .get(id)
    //   .visel.translate(Scale.obj2scaled(d, restruct.render.options))
    // this.data.d = d.negated()
    // if (!this.data.noinvalidate) {
    //   Base.invalidateItem(restruct, 'rxnArrows', id, 1)
    // }

    const inverseOperation = new MoveRxnArrow(
      this.#rxnArrowId,
      this.#delta.negated()
    )

    return {
      inverseOperation,
      entityId: this.#rxnArrowId,
      operationType: this.type
    }
  }
}

export class ResizeRxnArrow extends BaseOperation {
  #rxnArrowId: number
  #delta: Vec2
  #current: Vec2
  #anchor: Vec2

  constructor(rxnArrowId: number, delta: Vec2, current: Vec2, anchor: Vec2) {
    super('RXN_ARROW_RESIZE')

    this.#rxnArrowId = rxnArrowId
    this.#delta = delta
    this.#current = current
    this.#anchor = anchor
  }

  execute(target: Struct): PerformOperationResult {
    // TODO: transfrom to clear function
    const rxnArrow = target.rxnArrows.get(this.#rxnArrowId)!

    const previousPos0 = rxnArrow.points[0].get_xy0()
    const previousPos1 = rxnArrow.points[1].get_xy0()

    if (
      tfx(this.#anchor.x) === tfx(rxnArrow.points[1].x) &&
      tfx(this.#anchor.y) === tfx(rxnArrow.points[1].y)
    ) {
      rxnArrow.points[1].x = this.#anchor.x = this.#current.x
      this.#current.x = previousPos1.x
      rxnArrow.points[1].y = this.#anchor.y = this.#current.y
      this.#current.y = previousPos1.y
    }

    if (
      tfx(this.#anchor.x) === tfx(rxnArrow.points[0].x) &&
      tfx(this.#anchor.y) === tfx(rxnArrow.points[0].y)
    ) {
      rxnArrow.points[0].x = this.#anchor.x = this.#current.x
      this.#current.x = previousPos0.x
      rxnArrow.points[0].y = this.#anchor.y = this.#current.y
      this.#current.y = previousPos0.y
    }

    // TODO: move to renderer
    // restruct.rxnArrows
    //   .get(id)
    //   .visel.translate(Scale.obj2scaled(d, restruct.render.options))
    // this.data.d = d.negated()

    // if (!this.data.noinvalidate) {
    //   Base.invalidateItem(
    //     restruct,
    //     'rxnArrows',
    //     // @ts-ignore
    //     id,
    //     1
    //   )
    // }

    const inverseOperation = new ResizeRxnArrow(
      this.#rxnArrowId,
      this.#delta.negated(),
      this.#current,
      this.#anchor
    )

    return {
      inverseOperation,
      entityId: this.#rxnArrowId,
      operationType: this.type
    }
  }
}
