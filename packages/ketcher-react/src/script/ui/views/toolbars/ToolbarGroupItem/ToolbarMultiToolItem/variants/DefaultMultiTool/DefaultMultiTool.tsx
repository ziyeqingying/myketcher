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

import { MultiToolCallProps, MultiToolProps } from '../variants.types'

import { ActionButton } from '../../../ActionButton'
import action from '../../../../../../action'

interface DefaultMultiToolProps extends MultiToolProps {}
interface DefaultMultiToolCallProps extends MultiToolCallProps {}

type Props = DefaultMultiToolProps & DefaultMultiToolCallProps

const DefaultMultiTool = (props: Props) => {
  const { options, status, disableableButtons, indigoVerification, onAction } =
    props

  return (
    <>
      {options.map(toolbarItem => {
        const currentStatus = status[toolbarItem.id]
        return (
          <ActionButton
            key={toolbarItem.id}
            name={toolbarItem.id}
            action={action[toolbarItem.id]}
            // @ts-ignore
            status={currentStatus}
            selected={!!currentStatus?.selected}
            disableableButtons={disableableButtons}
            indigoVerification={indigoVerification}
            onAction={onAction}
          />
        )
      })}
    </>
  )
}

export type { DefaultMultiToolProps, DefaultMultiToolCallProps }
export { DefaultMultiTool }
