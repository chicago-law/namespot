import React from 'react'
import helpers from '../../../bootstrap'

const FlashCard = ({ student, namesOnReverse, offering }) => {
  const firstName = `${student.short_first_name ? student.short_first_name : student.first_name}`
  const lastName = `${student.short_last_name ? student.short_last_name : student.last_name}`
  const name = `${firstName} ${lastName}`

  return (
    <div className="flash-card-container">

      {!namesOnReverse && (
        <div className="flash-card-same-side flash-card">
          <div className="left">
            <img src={`${helpers.rootUrl}storage/student_pictures/${student.picture}`} alt="student" />
          </div>
          <div className="right">
            <h1>{name}</h1>
            <p style={{ marginBottom: 0 }}>{offering.long_title}</p>
            <p style={{ marginBottom: 0 }}>{helpers.termCodeToString(offering.term_code)}</p>
          </div>
        </div>
      )}

      {namesOnReverse && (
        <div className="flash-card-both-sides">
          <div className="flash-card front">
            <img src={`${helpers.rootUrl}storage/student_pictures/${student.picture}`} alt="student" />
          </div>
          <div className="flash-card back">
            <h1>{name}</h1>
            <p style={{ marginBottom: 0 }}>{offering.long_title}</p>
            <p style={{ marginBottom: 0 }}>{helpers.termCodeToString(offering.term_code)}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FlashCard
