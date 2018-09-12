import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import App from './App'

// Add FontAwesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCamera,
  faMapMarkerAlt,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons'
import {
  faCalendarAlt,
  faFile,
  faMap,
  faTrashAlt
} from '@fortawesome/free-regular-svg-icons'
import {
  faArrowLeft,
  faBars,
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
  faUnlink,
  faUserEdit,
  faUserPlus,
  faUsers,
  faWrench
} from '@fortawesome/pro-regular-svg-icons'
import {
  faArrowAltToBottom,
  faSpinnerThird
} from '@fortawesome/pro-solid-svg-icons'

library.add(
  faArrowAltToBottom,
  faArrowLeft,
  faBars,
  faCalendarAlt,
  faCamera,
  faChevronRight,
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
  faTimes,
  faTimesCircle,
  faTrashAlt,
  faUnlink,
  faUserEdit,
  faUserPlus,
  faUsers,
  faWrench
)

const Root = ({store}) => (
  <Provider store={store}>
    <App/>
  </Provider>
)

export default Root

Root.propTypes = {
  store: PropTypes.object.isRequired
}