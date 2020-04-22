import React from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from '../../utils/styledComponents'
import PickOffering from './PickOffering'
import PickRoom from './PickRoom'

const Container = styled('div')`
  max-width: 40em;
  margin: 5em auto;
  background: white;
  padding: 2em 0;
  box-shadow: ${props => props.theme.boxShadow};
  h4 {
    text-align: center;
  }
  ul {
    margin: 0;
    padding: 0;
    li {
      position: relative;
      list-style-type: none;
      border-color: ${props => props.theme.lightGray};
      border-style: solid;
      border-width: 0 1px 1px 1px;
      >a, >button {
        display: block;
        color: ${props => props.theme.black};
        padding: 1em 2em;
        text-decoration: none;
        &:hover {
          color: ${props => props.theme.red};
        }
      }
      >button {
        width: 100%;
        text-align: left;
      }
      .fa-chevron-right {
        position: absolute;
        top: 50%;
        right: 1em;
        transform: translateY(-50%);
        color: ${props => props.theme.middleGray};
      }
      .delete  {
        position: absolute;
        top: 50%;
        right: 4em;
        transform: translateY(-50%);
        opacity: 0;
        pointer-events: none;
        font-size: ${props => props.theme.ms(-1)};
        transition: opacity 200ms ease-out;
      }
      h3 {
        margin: 0;
      }
      p {
        margin: 0;
        font-size: ${props => props.theme.ms(-1)};
      }
      span {
        display: block;
        margin-top: 0.5em;
        font-size: ${props => props.theme.ms(-1)};
        font-style: italic;
        opacity: 0.5;
      }
      &:first-child {
        border-width: 1px 1px 1px 1px;
      }
      &:hover {
        .fa-chevron-right {
          color: ${props => props.theme.red};
        }
        .delete {
          opacity: 1;
          pointer-events: initial;
        }
      }
    }
  }
`

const Picker = () => (
  <Container>
    <Switch>
      <Route path="/offerings" component={PickOffering} />
      <Route path="/rooms" component={PickRoom} />
    </Switch>
  </Container>
)

export default Picker
