import { createGlobalStyle } from './styled-components'
import { theme } from './theme'

const GlobalStyles = createGlobalStyle`
  html, body {
    font-family: 'Amatic SC', sans-serif;
    color: ${theme.primaryColor};
    font-size: 19px;
    line-height: 1.5;
    background: url('images/graph-paper.png');
    letter-spacing: 1px;
  }
`

export default GlobalStyles
