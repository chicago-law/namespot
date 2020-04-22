import React from 'react'
import styled from '../../utils/styledComponents'
import namespotLogo from '../../../images/namespot-logo.png'

const Container = styled('div')`
  margin-left: auto;
  width: 66px;
  line-height: 0;
`

const Logo = () => (
  <Container>
    <img src={namespotLogo} alt="Namespot" />
  </Container>
)

export default Logo
