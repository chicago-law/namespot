import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCoffee,
} from '@fortawesome/free-solid-svg-icons'
import { ThemeProvider } from './utils/styledComponents'
import { theme } from './utils/theme'
import App from './components/App'
import store from './store'
import GlobalStyles from './utils/globalStyles'

library.add(
  faCoffee,
)

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <GlobalStyles />
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root'),
)
