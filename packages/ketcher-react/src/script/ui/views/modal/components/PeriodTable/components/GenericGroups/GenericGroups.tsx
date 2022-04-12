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

import { Generics } from 'ketcher-core'

import { GenGroup } from './GenGroup'
import classes from './GenericGroups.module.less'

type GenericGroupsProps = {
  selected: (label: string) => boolean
  onAtomSelect: (label: string) => void
}

function GenericGroups({ selected, onAtomSelect }: GenericGroupsProps) {
  return (
    <div className={classes.genericGroups}>
      <GenGroup
        groups={Generics}
        selected={selected}
        onAtomSelect={onAtomSelect}
      />
    </div>
  )
}

export default GenericGroups
