import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import helpers from '../../bootstrap'

const PageHeader = (props) =>  {
  const { shrinkRatio, currentRoom, currentOffering } = props

  const roomChartDetails = () => (
    <div className='page-header'>
      <div className='left' style={{
        'transformOrigin':'top left',
        'transform':`scale(${shrinkRatio})`,
      }}>
        <p>University of Chicago Law School</p>
      </div>
      <div className='right' style={{
        'transformOrigin':'top right',
        'transform':`scale(${shrinkRatio})`,
      }}>
        <p>{currentRoom.name}</p>
      </div>
    </div>
  )

  const offeringChartDetails = () => (
    <div className='page-header'>
      <div className='left' style={{
        'transformOrigin':'top left',
        'transform':`scale(${shrinkRatio})`
      }}>
        <p>{helpers.termCodeToString(currentOffering.term_code)} &bull; University of Chicago Law School</p>
      </div>
      <div className='right' style={{
        'transformOrigin':'top right',
        'transform':`scale(${shrinkRatio})`
      }}>
        <p>LAWS {currentOffering.catalog_nbr}-{currentOffering.section} &bull; {currentOffering.long_title} &bull; {currentRoom.name}</p>
      </div>
    </div>
  )

  return (
    <div className='page-header-container'>
      <Route path='/room' component={roomChartDetails} />
      <Route path='/offering' component={offeringChartDetails} />
      <Route exact path='/print/seating-chart/room/:roomid' component={roomChartDetails} />
      <Route path='/print/seating-chart/room/:roomid/offering/:offeringid' component={offeringChartDetails} />
    </div>
  )
}

export default PageHeader

PageHeader.propTypes = {
  currentRoom: PropTypes.object,
  currentOffering: PropTypes.object,
  shrinkRatio: PropTypes.number.isRequired
}