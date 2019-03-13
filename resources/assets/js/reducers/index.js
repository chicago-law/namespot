import { combineReducers } from 'redux'
import app from './app'
import entities from './entities'
import storage from './storage'
import authedUser from './authedUser'
import settings from './settings'
import receivedOfferingsFor from './receivedOfferingsFor'

const rootReducer = combineReducers({
  app,
  entities,
  storage,
  authedUser,
  settings,
  receivedOfferingsFor,
})

export default rootReducer
