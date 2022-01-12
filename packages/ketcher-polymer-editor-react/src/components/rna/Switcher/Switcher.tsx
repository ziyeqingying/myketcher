import { Button } from '@mui/material'
import styled from '@emotion/styled'
import LeftLink from '../../../icons/leftLink.svg'
import MiddleLink from '../../../icons/middleLink.svg'
import RightLink from '../../../icons/rightLink.svg'
import { FC, useState } from 'react'

const RAPButton = styled(Button)<{ 'data-isactive': boolean }>((props) => ({
  padding: '3px 12px',
  backgroundColor: props['data-isactive']
    ? props.theme.color.button.primary.active
    : props.theme.color.background.canvas,
  borderRadius: '8px',
  lineHeight: '18px',
  minWidth: '33px',
  color: props['data-isactive']
    ? props.theme.color.text.light
    : props.theme.color.text.dark,
  ':hover': {
    backgroundColor: props.theme.color.button.primary.hover,
    color: props.theme.color.text.light
  }
}))

const SwitcherContainer = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Container = styled('div')<{ gap: string }>`
  display: flex;
  gap: ${({ gap }) => gap};
`

const buttons = ['R', 'A', 'P']
const svgLinks = [LeftLink, MiddleLink, RightLink].map((Component) =>
  // @ts-ignore
  styled(Component)<{ 'data-isactive': boolean }>((props) => ({
    '& path': {
      strokeDasharray: props['data-isactive'] ? 'none' : '4,4',
      stroke: props['data-isactive']
        ? props.theme.color.button.primary.active
        : '#D1D5E3'
    }
  }))
)

export const Switcher: FC = () => {
  const [active, setActive] = useState(0)
  return (
    <SwitcherContainer>
      <RAPButton onClick={() => setActive(0)} data-isactive={active === 0}>
        R(A)P
      </RAPButton>
      <Container gap="11px">
        {svgLinks.map((Component, index) => (
          <Component key={index} data-isactive={active === index + 1} />
        ))}
      </Container>
      <Container gap="4px">
        {buttons.map((button, index) => (
          <RAPButton
            key={button}
            onClick={() => setActive(index + 1)}
            data-isactive={active === index + 1}
          >
            {button}
          </RAPButton>
        ))}
      </Container>
    </SwitcherContainer>
  )
}
