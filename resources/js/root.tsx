import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCoffee,
} from '@fortawesome/free-solid-svg-icons'
import App from './components/App'
import store from './store'
import GlobalStyles from './utils/globalStyles'

library.add(
  faCoffee,
)

let basename = '/'
if (window.location.hostname === 'localhost') {
  basename = '/sandboxes/laravel-typescript-react/public/'
}

ReactDOM.render(
  <BrowserRouter basename={basename}>
    <Provider store={store}>
      <GlobalStyles />
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root'),
)
