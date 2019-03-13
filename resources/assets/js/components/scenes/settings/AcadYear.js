import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import helpers from '../../../bootstrap'

const AcadYear = ({ currentYear, years, onChange }) => (
  <div className="form-question">
    <div className="setting-icon">
      <FontAwesomeIcon icon={['far', 'calendar-alt']} />
    </div>
    <div className="setting">
      <h4>Current Academic Year</h4>
      <p>Every night this site does a sync with the University's systems to keep itself up-to-date. The academic year that is set here controls which terms it will sync.</p>
      <p>Once a year, on August 1st at 12:00am, this will automatically set itself to the upcoming academic year. For example, on August 1st 2019, this will change to 2019-2020. Its previous setting doesn't matter; it will switch to the upcoming year regardless of what it was before.</p>
      <select name="academic-year" id="academic-year-select" value={currentYear} onChange={e => onChange(e.target.value)}>
        {helpers.getAllYears(years).map(year => (
          <option key={year} value={year}>{year} - {year + 1}</option>
        ))}
      </select>
    </div>
  </div>
)

export default AcadYear
