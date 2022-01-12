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

import { render } from 'test-utils'
import { fireEvent, screen } from '@testing-library/react'

import { ExpandButton } from '../expandButton'

describe('ExpandButton component', () => {
  it('should call expand handler when clicked', () => {
    const mockExpandHandler = jest.fn()
    const mockExpanded = false

    render(
      <ExpandButton expanded={mockExpanded} expandHandler={mockExpandHandler} />
    )
    const button = screen.getByRole('button')

    fireEvent.click(button)
    expect(mockExpandHandler).toHaveBeenCalledTimes(1)
  })

  it('should flip svg arrow when expanded', () => {
    const mockExpandHandler = jest.fn()
    const mockExpanded = true

    render(
      <ExpandButton expanded={mockExpanded} expandHandler={mockExpandHandler} />
    )
    const button = screen.getByRole('button')

    expect(button).toHaveAttribute('data-isflipped', 'true')
  })
})
