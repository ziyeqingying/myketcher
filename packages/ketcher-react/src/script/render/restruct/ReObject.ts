/****************************************************************************
 * Copyright 2020 EPAM Systems
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

import Visel from './visel'
import { scale } from 'ketcher-core'

class ReObject {
  protected visel: Visel
  protected highlight: boolean = false
  protected highlighting: any
  protected selected: boolean = false
  protected selectionPlate: any

  constructor(viselType: string) {
    this.visel = new Visel(viselType)
    // this.init(viselType)
  }

  // init(viselType: string): void {
  //   this.visel = new Visel(viselType)
  //
  //   this.highlight = false
  //   this.highlighting = null
  //   this.selected = false
  //   this.selectionPlate = null
  // }
  getVBoxObj(render: any): any {
    var vbox = this.visel.boundingBox
    if (vbox === null) return null
    if (render.options.offset)
      vbox = vbox.translate(render.options.offset.negated())
    return vbox.transform(scale.scaled2obj, render.options)
  }
  setHighlight(highLight: boolean, render: any): void {
    // TODO render should be field
    if (highLight) {
      let noredraw = 'highlighting' in this && this.highlighting !== null // && !this.highlighting.removed;
      if (noredraw) {
        if (this.highlighting.type === 'set') {
          if (!this.highlighting[0]) return
          noredraw = !this.highlighting[0].removed
        } else {
          noredraw = !this.highlighting.removed
        }
      }
      if (noredraw) {
        this.highlighting.show()
      } else {
        render.paper.setStart()
        this.drawHighlight(render)
        this.highlighting = render.paper.setFinish()
      }
    } else if (this.highlighting) {
      this.highlighting.hide()
    }

    this.highlight = highLight
  }
  // @ts-ignore
  drawHighlight(render: any): any {
    console.assert(null, 'ReObject.drawHighlight is not overridden') // eslint-disable-line no-console
  }

  // @ts-ignore
  makeSelectionPlate(restruct: any, paper: any, styles: any): any {
    console.assert(null, 'ReObject.makeSelectionPlate is not overridden') // eslint-disable-line no-console
  }
}

export default ReObject
