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
import React, { createContext, useState } from 'react'
import { MenuItem } from 'components/menu/menuItem'
import { SubMenu } from 'components/menu/subMenu'
import { MenuItemVariant } from 'components/menu/menu.types'

const Group = ({ children, divider = false }) => {
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

  const Divider = () => {
    const Divider = styled('span')`
      display: block;
      height: 8px;
      width: 32px;
      border-top: 1px solid;
      border-color: ${(props) => props.theme.color.divider};
    `
    return <Divider />
  }
  const subComponents = React.Children.map(children, (child) => {
    return child.type === MenuItem || SubMenu ? child : null
  })

  return (
    <>
      <GroupContainer>
        {subComponents.map((component) => component)}
      </GroupContainer>
      {divider && <Divider />}
    </>
  )
}

export type ContextType = {
  isActiveItem: (item: MenuItemVariant) => boolean
  selectItemHandler: (item: MenuItemVariant) => void
}

type MenuProps = {
  children: JSX.Element[]
  onItemClick: (itemKey: MenuItemVariant) => void
  customActiveItem?: MenuItemVariant
}

const MenuContext = createContext<ContextType | null>(null)

const Menu = ({ children, onItemClick }: MenuProps) => {
  const [activeItem, setActiveItem] = useState('select-lasso')

  const menuContextValue = React.useMemo<ContextType>(
    () => ({
      isActiveItem: (itemKey) => itemKey === activeItem,
      selectItemHandler: (itemKey) => {
        setActiveItem(itemKey)
        onItemClick(itemKey)
      }
    }),
    [activeItem, onItemClick]
  )

  const subComponents = React.Children.map(children, (child) => {
    return child.type === Group ? child : null
  })

  return (
    <>
      <MenuContext.Provider value={menuContextValue}>
        {subComponents.map((component) => component)}
      </MenuContext.Provider>
    </>
  )
}

Menu.Group = Group
Menu.Item = MenuItem
Menu.Submenu = SubMenu

export { Menu, MenuContext }
