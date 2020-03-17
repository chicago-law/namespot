import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowLeft,
  faArrowToBottom,
  faAsterisk,
  faBars,
  faBookOpen,
  faCalendarStar,
  faCheckCircle,
  faChevronRight,
  faCog,
  faFile,
  faFolderOpen,
  faIdCard,
  faLongArrowUp,
  faLongArrowDown,
  faLongArrowLeft,
  faLongArrowRight,
  faMap,
  faMapMarkerAlt,
  faPencil,
  faPlusCircle,
  faPrint,
  faRobot,
  faSearch,
  faSync,
  faTable,
  faTextSize,
  faTimes,
  faTrashAlt,
  faUniversity,
  faUnlink,
  faUpload,
  faUserEdit,
  faUserPlus,
  faUserTag,
  faUserTimes,
  faUsers,
  faWrench,
} from '@fortawesome/pro-regular-svg-icons'
import {
  faCamera,
} from '@fortawesome/pro-solid-svg-icons'
import { ThemeProvider } from './utils/styledComponents'
import { theme } from './utils/theme'
import App from './components/App'
import store from './store'
import GlobalStyles from './utils/globalStyles'

library.add(
  faArrowLeft,
  faArrowToBottom,
  faAsterisk,
  faBars,
  faBookOpen,
  faCalendarStar,
  faCamera,
  faCheckCircle,
  faChevronRight,
  faCog,
  faFile,
  faFolderOpen,
  faIdCard,
  faLongArrowUp,
  faLongArrowDown,
  faLongArrowLeft,
  faLongArrowRight,
  faMap,
  faMapMarkerAlt,
  faPencil,
  faPlusCircle,
  faPrint,
  faRobot,
  faSearch,
  faSync,
  faTable,
  faTextSize,
  faTimes,
  faTrashAlt,
  faUniversity,
  faUnlink,
  faUpload,
  faUserEdit,
  faUserPlus,
  faUserTag,
  faUserTimes,
  faUsers,
  faWrench,
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
