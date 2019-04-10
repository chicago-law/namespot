import { createGlobalStyle } from './styledComponents'
import { theme } from './theme'

const GlobalStyles = createGlobalStyle`
  html, body {
    font-family: ${theme.primaryFont};
    color: ${theme.darkGray};
    font-size: ${theme.ms(0)};
    line-height: 1.5;
    background: url('images/graph-paper.png');
    letter-spacing: 1px;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
  }

  img {
    max-width: 100%;
  }

  h1 {
    font-size: ${theme.ms(3)};
  }
  h2 {
    font-size: ${theme.ms(2)};
  }
  h3 {
    font-size: ${theme.ms(1)};
  }
  h4 {
    font-size: ${theme.ms(0)};
  }
  h5 {
    font-size: ${theme.ms(-1)};
  }
  h6 {
    font-size: ${theme.ms(-2)};
  }
`

export default GlobalStyles
