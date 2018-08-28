import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'
import Root from './global/Root'
import helpers from './bootstrap'

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(
      thunkMiddleware
    )
  )
)

let basename = '/'

if (window.location.hostname === 'localhost') {
  basename = '/namespot/public/'
}

basename = helpers.rootUrl

render(
  <BrowserRouter basename={basename}>
    <Root store={store} />
  </BrowserRouter>,
  document.getElementById('root')
)