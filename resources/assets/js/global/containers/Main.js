import { connect } from 'react-redux'
import Main from '../Main'
import { withRouter } from 'react-router-dom'
import { setTask, fetchUser } from '../../actions'

const mapStateToProps = (state) => {
  return {
    view:state.app.view,
    task:state.app.task
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUser: (id) => {
      dispatch(fetchUser(id))
    },
    setTask: (task) => {
      dispatch(setTask(task))
    }
  }
}

const MainContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Main))

export default MainContainer