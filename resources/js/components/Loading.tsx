import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from '../utils/styledComponents'
import animateEntrance from '../utils/animateEntrance'

const Container = styled('div')<{ height: number }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${(props) => props.height}em;
  font-size: ${(props) => props.theme.ms(1)};
  color: ${(props) => props.theme.middleGray};
  svg {
    ${animateEntrance('spin')}
  }
`

interface OwnProps {
  height?: number;
}

const Loading = ({
  height = 10,
}: OwnProps) => (
  <Container height={height}>
    <FontAwesomeIcon icon={['far', 'asterisk']} />
  </Container>
)

export default Loading
