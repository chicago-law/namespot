import React from 'react'
import styled from '../../utils/styledComponents'

const StyledDivider = styled('div')`
  display: inline-block;
  height: 100%;
  border-right: 1px solid ${props => props.theme.lightGray};
  margin: 0 1em;
`

export const ActionBarDivider = () => (
  <StyledDivider />
)

export default ActionBarDivider
