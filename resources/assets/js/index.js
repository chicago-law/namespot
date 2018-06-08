import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'
import Root from './global/Root'
import { fetchOfferings, enterOffering, fetchStudents, fetchRooms } from './actions'

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(
      thunkMiddleware
    )
  )
)

// window.store = store
store.dispatch(fetchRooms())
store.dispatch(fetchOfferings('2188'))

render(
  <BrowserRouter basename="/namespot/public/">
    <Root store={store} />
  </BrowserRouter>,
  document.getElementById('root')
)