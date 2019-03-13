import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CatalogPrefix = ({ schoolName, onChange }) => (
  <div className="form-question">
    <div className="setting-icon">
      <FontAwesomeIcon icon={['far', 'university']} />
    </div>
    <div className="setting">
      <h4>School Name</h4>
      <p>The name of your school or institution. Shown on seating charts, rosters, etc.</p>
      <input type="text" value={schoolName} onChange={e => onChange(e.target.value)} placeholder="Your school name..." />
    </div>
  </div>
)

export default CatalogPrefix
