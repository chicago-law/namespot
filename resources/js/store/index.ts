import { combineReducers, createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import authedUser from './authedUser/reducers'
import offerings from './offerings/reducers'
import students from './students/reducers'
import enrollments from './enrollments/reducers'
import rooms from './rooms/reducers'
import tables from './tables/reducers'
import seats from './seats/reducers'
import session from './session/reducers'
import printing from './printing/reducers'
import settings from './settings/reducers'
import modal from './modal/reducers'
import errors from './errors/reducers'
import loading from './loading/reducers'

const rootReducer = combineReducers({
  authedUser,
  offerings,
  students,
  enrollments,
  rooms,
  tables,
  seats,
  session,
  printing,
  settings,
  modal,
  errors,
  loading,
})
export type AppState = ReturnType<typeof rootReducer>;

const composeEnhancers = composeWithDevTools({
  trace: true,
})
const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
    ),
  ),
)


export default store
