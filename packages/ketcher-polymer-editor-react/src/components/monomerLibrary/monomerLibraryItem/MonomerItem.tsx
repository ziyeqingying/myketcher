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
import { EmptyFunction } from 'helpers'
import { useAppDispatch } from 'hooks'
import { useState } from 'react'
import { toggleMonomerFavorites } from 'state/library'
import { MonomerColorScheme } from 'theming/defaultTheme'

export type MonomerItemType = {
  label: string
  colorScheme?: MonomerColorScheme
  favorite?: boolean
  props: {
    MonomerNaturalAnalogCode: string
    MonomerName?: string
    Name?: string
    BranchMonomer?: string
    MonomerCaps?: string
    MonomerCode?: string
    MonomerType?: string
  }
}

interface MonomerItemProps {
  item: MonomerItemType
  onClick?: VoidFunction
  onStarClick?: VoidFunction
}

const Card = styled.div<{ code: string }>`
  background: white;
  width: 58px;
  height: 48px;
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.ketcher.font.size.small};
  color: ${({ theme }) => theme.ketcher.color.text.primary};
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  margin: 0;
  margin-bottom: 8px;
  user-select: none;

  .hidden & .star {
    visibility: hidden !important;
  }

  &:hover {
    outline: 1px solid #b4b9d6;
    &::after {
      content: '';
      background: ${({ code, theme }) =>
        theme.ketcher.monomer.color[code].hover};
    }
    > .star {
      visibility: visible;
      opacity: 1;
    }
  }
  &::after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background: ${({ code, theme }) =>
      theme.ketcher.monomer.color[code].regular};
  }
  > span {
    position: absolute;
    bottom: 6px;
    left: 6px;
    text-overflow: ellipsis;
    max-width: calc(100% - 12px);
    overflow: hidden;
  }
  > .star {
    color: #e1e5ea;
    position: absolute;
    top: 12px;
    right: 4px;
    font-size: 15px;
    opacity: 0;
    transition: 0.2s ease;
    &.visible {
      visibility: visible;
      opacity: 1;
    }
    &:active {
      transform: scale(1.4);
    }
    &:hover,
    &.visible {
      color: #faa500;
    }
  }
`

const MonomerItem = ({ item, onClick = EmptyFunction }: MonomerItemProps) => {
  const [favorite, setFavorite] = useState(item.favorite)

  const dispatch = useAppDispatch()

  return (
    <Card
      onClick={onClick}
      code={item.props.MonomerNaturalAnalogCode}
      data-testid={item.props.MonomerNaturalAnalogCode}
    >
      <span>{item.label}</span>
      <div
        onClick={(event) => {
          event.stopPropagation()
          setFavorite(!favorite)
          dispatch(toggleMonomerFavorites(item))
        }}
        className={`star ${favorite ? 'visible' : ''}`}
      >
        ★
      </div>
    </Card>
  )
}

export { MonomerItem }
