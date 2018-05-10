import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers'
import Root from './containers/Root'
import { fetchOfferings, enterOffering, fetchStudents, fetchRooms } from './actions'

const loggerMiddleware = createLogger()

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
)

window.store = store

store.dispatch(fetchRooms())
store.dispatch(fetchOfferings('2192'))
// store.dispatch(enterOffering('22'))
// store.dispatch(fetchStudents('10'))

render(
  <BrowserRouter basename="/namespot/public/">
    <Root store={store} />
  </BrowserRouter>,
  document.getElementById('root')
)