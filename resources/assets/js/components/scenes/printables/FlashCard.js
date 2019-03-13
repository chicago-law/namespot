import React from 'react'
import PropTypes from 'prop-types'
import helpers from '../../../bootstrap'

const FlashCard = ({ student, namesOnReverse, offering }) => (
  <div className="flash-card-container">

    {!namesOnReverse && (
      <div className="flash-card-same-side flash-card">
        <div className="left">
          <img src={`${helpers.rootUrl}storage/student_pictures/${student.picture}`} />
        </div>
        <div className="right">
          <h1>
            {student.short_first_name
              ? student.short_first_name
              : student.first_name
            }
            &nbsp;
            {student.short_last_name
              ? student.short_last_name
              : student.last_name
            }
          </h1>
          <p>{offering.long_title}<br />{helpers.termCodeToString(offering.term_code)}</p>
        </div>
      </div>
    )}

    {namesOnReverse && (
      <div className="flash-card-both-sides">
        <div className="flash-card front">
          <img src={`${helpers.rootUrl}storage/student_pictures/${student.picture}`} />
        </div>
        <div className="flash-card back">
          <h1>
            {student.short_first_name
              ? student.short_first_name
              : student.first_name
            }
            &nbsp;
            {student.short_last_name
              ? student.short_last_name
              : student.last_name
            }
          </h1>
          <p>{offering.long_title}<br />{helpers.termCodeToString(offering.term_code)}</p>
        </div>
      </div>
    )}
  </div>
)

FlashCard.propTypes = {
  namesOnReverse: PropTypes.bool.isRequired,
  offering: PropTypes.object.isRequired,
  student: PropTypes.object.isRequired,
}

export default FlashCard
