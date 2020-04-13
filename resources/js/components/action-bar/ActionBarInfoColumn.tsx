import React from 'react'
import styled from '../../utils/styledComponents'

const Container = styled('div')`
  display: inline-block;
  padding: 0 1em;
  vertical-align: top;
  h5 {
    margin: 0;
  }
  p {
    position: relative;
    display: inline-block;
    margin: 0 0 0.25em 0;
  }
  .icon-button {
    position: absolute;
    top: 50%;
    right: 0;
    font-size: ${props => props.theme.ms(-2)};
    transform: translate(100%, -50%);
  }
`

interface OwnProps {
  children: React.ReactChild;
}

const ActionBarInfoColumn = ({ children }: OwnProps) => (
  <Container>
    {children}
  </Container>
)

export default ActionBarInfoColumn
