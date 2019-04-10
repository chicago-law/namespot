import React, { Component } from 'react'
import styled, { keyframes } from '../utils/styledComponents'

const float = keyframes`
  0% {
    transform: translateY(0) scale(1);
    filter: saturate(0) drop-shadow(0 1px 1px rgba(0,0,0,.5));
  }
  40% {
    transform: translateY(-25px) scale(1.1);
    filter: saturate(0) drop-shadow(0 30px 5px rgba(0,0,0,.2));
  }
  100% {
    transform: translateY(0) scale(1);
    filter: saturate(0) drop-shadow(0 1px 1px rgba(0,0,0,.5));
  }
`
const Container = styled('div')`
  text-align: center;
  padding-top: 3em;
`
const Logos = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 40em;
  margin: 5em auto 0 auto;
  animation: ${float} 4s ease-in-out infinite;
  img {
    flex: 0 1 30%;
    margin: 0 2em;
  }
`

class App extends Component<{}, {}> {
  componentDidMount() {
    console.log('I\'m alive, awake, alert, enthusiastic 👍')
  }

  render() {
    return (
      <Container>
        <h4>THIS IS</h4>
        <h1>LARAVEL + TYPESCRIPT + REACT</h1>
        <Logos>
          <img src="images/laravel-logo.png" alt="Laravel Logo" />
          <img src="images/ts-logo.png" alt="Typescript Logo" />
          <img src="images/react-logo.png" alt="React Logo" />
        </Logos>
      </Container>
    )
  }
}

export default App
