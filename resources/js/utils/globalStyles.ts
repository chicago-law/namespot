import { createGlobalStyle } from './styledComponents'
import { theme } from './theme'

const GlobalStyles = createGlobalStyle`
  html {
    box-sizing: border-box;
  }
  * {
    box-sizing: inherit;
  }
  html, body {
    font-family: ${theme.primaryFont};
    color: ${theme.black};
    background-color: ${theme.offWhite};
    font-size: ${theme.ms(0)};
    line-height: 1.5;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
  }

  img {
    max-width: 100%;
  }

  h1 {
    font-size: ${theme.ms(2)};
  }
  h2 {
    font-size: ${theme.ms(1)};
  }
  h3 {
    font-size: ${theme.ms(0)};
  }
  h4 {
    font-size: ${theme.ms(0)};
    text-transform: uppercase;
    color: ${theme.middleGray};
  }
  h5 {
    font-size: ${theme.ms(-1)};
  }
  h6 {
    font-size: ${theme.ms(-2)};
  }

  a {
    color: ${theme.red};
    transition: color 150ms ease-out;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    li {
      list-style-type: none;
      margin: 0.25em 0;
    }
  }

  /* Forms */
  button {
    cursor: pointer;
    border: none;
    background: none;
    outline: none;
    color: ${theme.black};
    &:disabled {
      cursor: default;
    }
  }
  input, select {
    padding: 0.55em 0.5em;
    border: 2px solid ${theme.lightGray};
    border-radius: 3px;
    background: white;
    color: ${theme.darkGray};
    transition: border 100ms ease-out;
    &:hover {
      border-color: rgba(0,0,0, 0.1);
    }
    &:focus {
      border-color: ${theme.red};
      box-shadow: 0 0 10px rgba(0,0,0, 0.25);
    }
    &[type='radio'], &[type='checkbox'] {
      margin-right: 0.5em;
    }
  }

  /* Transitions */
  .fade-enter {
    opacity: 0;
    transition: all 300ms ease-out;
  }
  .fade-enter-active, .fade-enter-done {
    opacity: 1;
    transition: all 300ms ease-out;
  }
  .fade-exit {
    opacity: 1;
    transition: all 300ms ease-out;
  }
  .fade-exit-active {
    opacity: 0;
    transition: all 300ms ease-out;
  }

  .slide-up-fade-enter {
    opacity: 0;
    transform: translateY(0.5em);
    transition: opacity 200ms ease-out, transform 200ms ease-out;
  }
  .slide-up-fade-enter-active, .slide-up-fade-enter-done {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 200ms ease-out, transform 200ms ease-out;
  }
  .slide-up-fade-exit {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 200ms ease-out, transform 200ms ease-out;
  }
  .slide-up-fade-exit-active {
    opacity: 0;
    transform: translateY(0.5em);
    transition: opacity 200ms ease-out, transform 200ms ease-out;
  }

  .slide-left-fade-enter {
    opacity: 0;
    transform: translateX(100%);
    transition: opacity 200ms ease-out, transform 200ms ease-out;
  }
  .slide-left-fade-enter-active, .slide-left-fade-enter-done {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 200ms ease-out, transform 200ms ease-out;
  }
  .slide-left-fade-exit {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 200ms ease-out, transform 200ms ease-out;
  }
  .slide-left-fade-exit-active {
    opacity: 0;
    transform: translateX(100%);
    transition: opacity 200ms ease-out, transform 200ms ease-out;
  }

  .slide-right-fade-enter {
    opacity: 0;
    transform: translateX(-100%);
    transition: opacity 200ms ease-out, transform 200ms ease-out;
  }
  .slide-right-fade-enter-active, .slide-right-fade-enter-done {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 200ms ease-out, transform 200ms ease-out;
  }
  .slide-right-fade-exit {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 200ms ease-out, transform 200ms ease-out;
  }
  .slide-right-fade-exit-active {
    opacity: 0;
    transform: translateX(-100%);
    transition: opacity 200ms ease-out, transform 200ms ease-out;
  }

  @keyframes moveToPosition {
    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes spin {
    0% {
      opacity: 0.5;
      transform:rotate(0deg);
    }
    75% {
      opacity: 1;
      transform:rotate(360deg)
    }
    100% {
      opacity: 0.5;
      transform:rotate(0deg);
    }
  }
`

export default GlobalStyles
