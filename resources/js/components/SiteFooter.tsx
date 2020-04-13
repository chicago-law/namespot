import React from 'react'
import styled from '../utils/styledComponents'

const Container = styled('div')`
  padding: 1em;
  margin-bottom: 2em;
  text-align: center;
  p {
    font-size: ${props => props.theme.ms(-1)};
    font-weight: bold;
    color: ${props => props.theme.middleGray};
  }
`

const SiteFooter = () => (
  <Container>
    <p>&copy; {new Date().getFullYear()} The Law School &bull; The University of Chicago &bull; <a href="mailto:helpdesk@law.uchicago.edu">Feedback?</a></p>
  </Container>
)

export default SiteFooter
