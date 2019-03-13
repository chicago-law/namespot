import React, { Component } from 'react'
import styled, { keyframes } from '../utils/styled-components'

const float = keyframes`
  0% {
    transform: translateY(0)
  }
  40% {
    transform: translateY(-25px)
  }
  100% {
    transform: translateY(00px)
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
  animation: ${float} 5s ease-out infinite;
  filter: saturate(0);
  img {
    flex: 0 1 30%;
    margin: 0 2em;
  }
`

class App extends Component<{}, {}> {
  componentDidMount() {
    console.log('I\'m alive, awake, alert, enthusiastic 👍') // eslint-disable-line
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
