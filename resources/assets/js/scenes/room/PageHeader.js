import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import helpers from '../../bootstrap'
import InstructorNames from '../../global/InstructorNames'

const PageHeader = (props) =>  {
  const { shrinkRatio, currentRoom, currentOffering, withStudents } = props

  const roomChartDetails = () => (
    <div className='page-header'>
      <div className='left' style={{
        'transformOrigin':'top left',
        'transform':`scale(${shrinkRatio})`,
      }}>
        <h3>University of Chicago Law School</h3>
      </div>
      <div className='right' style={{
        'transformOrigin':'top right',
        'transform':`scale(${shrinkRatio})`,
      }}>
        <h3>{currentRoom.name}</h3>
      </div>
    </div>
  )

  const offeringChartDetails = () => (
    <div className='page-header'>
      <div className='left' style={{
        'transform':`scale(${shrinkRatio})`
      }}>
        <h3>{currentRoom.name} - {helpers.termCodeToString(currentOffering.term_code)} - University of Chicago Law School {currentOffering && withStudents && <span>Printed {new Date().toLocaleDateString()}</span>}</h3>
      </div>
      <div className='right' style={{
        'transform':`scale(${shrinkRatio})`
      }}>
        <h3>{`${currentOffering.long_title} - LAWS ${currentOffering.catalog_nbr}-${currentOffering.section}`}{currentOffering.instructors.length > 0 && <span> - <InstructorNames offering={currentOffering} /></span>}</h3>
      </div>
    </div>
  )

  return (
    <div className='page-header-container'>
      <Route path='/room' component={roomChartDetails} />
      <Route path='/offering' component={offeringChartDetails} />
      <Route exact path='/print/seating-chart/room/:roomid' component={roomChartDetails} />
      <Route exact path='/print/seating-chart/room/:roomid/offering/:offeringid' component={offeringChartDetails} />
    </div>
  )
}

export default PageHeader

PageHeader.propTypes = {
  currentRoom: PropTypes.object,
  currentOffering: PropTypes.object,
  shrinkRatio: PropTypes.number.isRequired
}