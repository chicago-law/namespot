import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import helpers from '../../bootstrap'

export default class ChartDetails extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    const roomChartDetails = () => (
      <div className='chart-details'>
        <div className='left' style={{
          'transformOrigin':'top left',
          'transform':`scale(${this.props.shrinkRatio})`
        }}>
          <p>University of Chicago Law School</p>
        </div>
        <div className='right' style={{
          'transformOrigin':'top right',
          'transform':`scale(${this.props.shrinkRatio})`
        }}>
          <p>{this.props.currentRoom.name}</p>
        </div>
      </div>
    )

    const offeringChartDetails = () => (
      <div className='chart-details'>
        <div className='left' style={{
          'transformOrigin':'top left',
          'transform':`scale(${this.props.shrinkRatio})`
        }}>
          <p>{helpers.termCodeToString(this.props.currentOffering.term_code)} &bull; University of Chicago Law School</p>
        </div>
        <div className='right' style={{
          'transformOrigin':'top right',
          'transform':`scale(${this.props.shrinkRatio})`
        }}>
          <p>LAWS {this.props.currentOffering.catalog_nbr}-{this.props.currentOffering.section} &bull; {this.props.currentOffering.long_title} &bull; {this.props.currentRoom.name}</p>
        </div>
      </div>
    )

    return (
      <div className='chart-details-container'>
        <Route path='/room' component={roomChartDetails} />
        <Route path='/offering' component={offeringChartDetails} />
        <Route exact path='/print/seating-chart/room/:roomid' component={roomChartDetails} />
        <Route path='/print/seating-chart/room/:roomid/offering/:offeringid' component={offeringChartDetails} />
      </div>
    )
  }
}

ChartDetails.propTypes = {
  currentRoom: PropTypes.object,
  currentOffering: PropTypes.object,
  shrinkRatio: PropTypes.number.isRequired
}