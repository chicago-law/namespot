import React from 'react'
import { Link } from 'react-router-dom'

const OfferingList = ({ offerings, setView }) => {
  setView('offering-list');

  return (
    <div>
      <h5>Select Class</h5>
      <ul>
        {Object.keys(offerings).map((id) => (
          <li key={id}>
            <Link to={`/offering/${id}`}>
              <h4>{offerings[id].name}</h4>
              <p><small>LAWS {offerings[id].course_num} &bull; Spring 2018</small></p>
            </Link>
            <i className="far fa-chevron-right"></i>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default OfferingList;