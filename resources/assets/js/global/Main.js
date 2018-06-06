import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Select from '../scenes/Select/Select'
import Room from '../scenes/Room/containers/Room'

const Main = ({ setTask, match }) => {
  return (
    <div className='main'>
      <Switch>
        <Route exact path="/" component={Select} />
        <Route path="/select" component={Select} />}
        <Route path='/room/:roomID' component={Room} />
        {/* <Route exact path='/' render={() => {
              // setTask(null);
              return <Select />
            }
          }
        />
        <Route path='/select' render={() => {
              // setTask(null);
              return <Select />
            }
          }
        />
        <Route path='/room/:roomID' render={() => {
              // setTask('edit-room');
              return <Room />
            }
          }
        /> */}
      </Switch>
    </div>
  )
}

export default Main;