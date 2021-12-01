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

import classes from './SpecialSymbolsList.module.less'
import { SpecialSymbolsButtonProps } from '../SpecialSymbols/SpecialSymbolsButton'
import React from 'react'

interface SpecialSymbolsListProps extends SpecialSymbolsButtonProps {
  hideMenu: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const SpecialSymbolsList = ({ select, hideMenu }: SpecialSymbolsListProps) => {
  const symbols = [
    'α',
    'β',
    'γ',
    'δ',
    'ε',
    'ζ',
    'η',
    'θ',
    'ι',
    'κ',
    'λ',
    'μ',
    'ν',
    'ξ',
    'ο',
    'π',
    'ρ',
    'σ',
    'τ',
    'υ',
    'φ',
    'χ',
    'ψ',
    'ω',
    '℃',
    '℉',
    'Å',
    '°',
    'ħ',
    '±',
    '‰',
    '√',
    '←',
    '→',
    '↚',
    '↛',
    '↔',
    '⇌',
    '∏',
    '∑',
    '∞',
    '∂',
    '∆',
    '∫',
    '≈',
    '≠',
    '≤',
    '≥'
  ]
  return (
    <div className={classes.window}>
      {symbols.map((symbol, id) => {
        return (
          <button
            className={classes.button}
            key={`symbol-${id}`}
            value={symbol}
            onClick={event => {
              select(symbol)
              hideMenu(event)
            }}
          >
            {symbol}
          </button>
        )
      })}
    </div>
  )
}
export { SpecialSymbolsList }
