import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'

// Add FontAwesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCamera,
  faMapMarkerAlt,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'
import {
  faArrowAltCircleDown,
  faCalendarAlt,
  faFile,
  faMap,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons'
import {
  faTable,
} from '@fortawesome/pro-light-svg-icons'
import {
  faArrowLeft,
  faBars,
  faBookOpen,
  faCheck,
  faChevronRight,
  faCog,
  faExclamationTriangle,
  faExchangeAlt,
  faFont,
  faIdCard,
  faLongArrowDown,
  faLongArrowLeft,
  faLongArrowRight,
  faLongArrowUp,
  faMinusCircle,
  faPencil,
  faPlusCircle,
  faPrint,
  faSearch,
  faSignOut,
  faSignOutAlt,
  faTimes,
  faUniversity,
  faUnlink,
  faUpload,
  faUserEdit,
  faUserPlus,
  faUsers,
  faWrench,
} from '@fortawesome/pro-regular-svg-icons'
import {
  faArrowAltToBottom,
  faSpinnerThird,
} from '@fortawesome/pro-solid-svg-icons'
import App from './App'

library.add(
  faArrowAltCircleDown,
  faArrowAltToBottom,
  faArrowLeft,
  faBars,
  faBookOpen,
  faCalendarAlt,
  faCamera,
  faCheck,
  faChevronRight,
  faUpload,
  faCog,
  faExchangeAlt,
  faExclamationTriangle,
  faFile,
  faFont,
  faIdCard,
  faLongArrowDown,
  faLongArrowLeft,
  faLongArrowRight,
  faLongArrowUp,
  faMap,
  faMapMarkerAlt,
  faMinusCircle,
  faPencil,
  faPlusCircle,
  faPrint,
  faSearch,
  faSignOut,
  faSignOutAlt,
  faSpinnerThird,
  faTable,
  faTimes,
  faTimesCircle,
  faTrashAlt,
  faUniversity,
  faUnlink,
  faUserEdit,
  faUserPlus,
  faUsers,
  faWrench,
)

const Root = ({ store }) => (
  <Provider store={store}>
    <App />
  </Provider>
)

export default Root

Root.propTypes = {
  store: PropTypes.object.isRequired,
}
