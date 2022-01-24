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

import { LayoutContent, Layout } from 'components/Layout'
import { render, screen } from 'test-utils'

const TopElementMock = () => {
  return <div>top element</div>
}

const LeftElementMock = () => {
  return <div>left element</div>
}

const MainElementMock = () => {
  return <div>main element</div>
}

const RightElementMock = () => {
  return <div>right element</div>
}

const BottomElementMock = () => {
  return <div>bottom element</div>
}

describe('Layout', () => {
  it('should render several subcomponents correctly', () => {
    render(
      <LayoutContent>
        {{
          left: (
            <Layout.Left>
              <LeftElementMock />
            </Layout.Left>
          ),
          top: (
            <Layout.Top>
              <TopElementMock />
            </Layout.Top>
          ),
          main: (
            <Layout.Main>
              <MainElementMock />
            </Layout.Main>
          ),
          right: (
            <Layout.Right>
              <RightElementMock />
            </Layout.Right>
          )
        }}
      </LayoutContent>
    )

    const topElement = screen.getByText('top element')
    const mainElement = screen.getByText('main element')
    const leftElement = screen.getByText('left element')
    const rightElement = screen.getByText('right element')
    const bottomElement = screen.queryByTestId('bottom-container')

    expect(topElement).toBeVisible()
    expect(mainElement).toBeVisible()
    expect(leftElement).toBeVisible()
    expect(rightElement).toBeVisible()
    expect(bottomElement).not.toBeInTheDocument()
  })

  it('should render all subcomponents correctly', () => {
    render(
      <LayoutContent>
        {{
          left: (
            <Layout.Left>
              <LeftElementMock />
            </Layout.Left>
          ),
          top: (
            <Layout.Top>
              <TopElementMock />
            </Layout.Top>
          ),
          main: (
            <Layout.Main>
              <MainElementMock />
            </Layout.Main>
          ),
          bottom: (
            <Layout.Bottom>
              <BottomElementMock />
            </Layout.Bottom>
          ),
          right: (
            <Layout.Right>
              <RightElementMock />
            </Layout.Right>
          )
        }}
      </LayoutContent>
    )

    const topElement = screen.getByText('top element')
    const mainElement = screen.getByText('main element')
    const leftElement = screen.getByText('left element')
    const rightElement = screen.getByText('right element')
    const bottomElement = screen.getByText('bottom element')

    expect(topElement).toBeVisible()
    expect(mainElement).toBeVisible()
    expect(leftElement).toBeVisible()
    expect(bottomElement).toBeVisible()
    expect(rightElement).toBeVisible()
  })

  it('renders a message and logo', async () => {
    render(<Layout />)

    expect(screen.getByText('App is not ready')).toBeVisible()

    expect(await screen.findByText('Polymer Editor')).toBeVisible()
    expect(await screen.findByText('Ketcher')).toBeVisible()
    expect(await screen.findByText('EPAM')).toBeVisible()
  })
})
