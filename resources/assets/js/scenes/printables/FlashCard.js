import React, { Component } from 'react'
import PropTypes from 'prop-types'
import helpers from '../../bootstrap'

export default class FlashCard extends Component {
  render() {
    const { student, namesOnReverse, offering } = this.props

    return (
      <div className='flash-card-container'>

        {!namesOnReverse && (
          <div className='flash-card-same-side flash-card'>
            <div className='left'>
              <img src={`${helpers.rootUrl}/images/students/${student.picture}`} />
            </div>
            <div className='right'>
              <h1>{student.first_name} {student.last_name}</h1>
              <p>{offering.long_title}<br/>{helpers.termCodeToString(offering.term_code)}</p>
            </div>
          </div>
        )}

        {namesOnReverse && (
          <div className='flash-card-both-sides'>
            <div className="flash-card front">
              <img src={`${helpers.rootUrl}/images/students/${student.picture}`} />
            </div>
            <div className="flash-card back">
              <h1>{student.first_name} {student.last_name}</h1>
              <p>{offering.long_title}<br/>{helpers.termCodeToString(offering.term_code)}</p>
            </div>
          </div>
        )}
      </div>
    )
  }
}

FlashCard.propTypes = {
  namesOnReverse: PropTypes.bool.isRequired,
  offering: PropTypes.object.isRequired,
  student: PropTypes.object.isRequired,
}

