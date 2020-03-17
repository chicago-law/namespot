import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from '../utils/styledComponents'

const Container = styled('div')`
  position: relative;
  svg {
    position: absolute;
    left: 0.7em;
    top: 50%;
    transform: translateY(-50%);
    color: ${(props) => props.theme.middleGray};
  }
  input {
    padding-left: 2em;
    width: 100%;
  }
`

const SearchInputContainer: React.FC = ({ children }) => (
  <Container className="search-input-container">
    <FontAwesomeIcon icon={['far', 'search']} />
    {children}
  </Container>
)

export default SearchInputContainer
