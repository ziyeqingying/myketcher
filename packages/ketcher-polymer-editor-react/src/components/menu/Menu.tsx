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
import styled from '@emotion/styled'
import React from 'react'
import { MenuItem } from 'components/menu/menuItem'
import { SubMenu } from 'components/menu/subMenu'

const Group = ({ children }) => {
  const GroupContainer = styled('div')`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    background-color: ${(props) => props.theme.color.background.primary};
    border-radius: 2px;
    width: 32px;
    margin-bottom: 8px;

    > * {
      margin-bottom: 8px;
    }

    > :last-child {
      margin-bottom: 0;
    }
  `

  return <GroupContainer>{children}</GroupContainer>
}

// const Divider = () => {
//   const Divider = styled('span')`
//     height: 8px;
//     width: 32px;
//     border-top: 1px solid;
//     border-color: ${(props) => props.theme.color.divider};
//   `
//   return <Divider/>
// }

const Menu = ({ children }) => {
  const subComponentList = Object.keys(Menu)

  const subComponents = subComponentList.map((key) => {
    return React.Children.map(children, (child) =>
      child.type.name === key ? child : null
    )
  })

  return <>{subComponents.map((component) => component)} </>
}

Menu.Group = Group
Menu.Item = MenuItem
Menu.Submenu = SubMenu

export { Menu }
