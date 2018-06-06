import React from 'react'
import { Link } from 'react-router-dom'

const ClassList = ({ offerings, onOfferingClick }) => {
  return (
    <div>
      <h5>Select Class</h5>
      <ul>
        {Object.keys(offerings).map((id) => (
          <li key={id} onClick={() => onOfferingClick(id)}>
            <a href="javascript:void(0)">
              <h4>{offerings[id].name}</h4>
              <p><small>LAWS {offerings[id].course_num} &bull; Spring 2018</small></p>
            </a>
            <i className="far fa-chevron-right"></i>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ClassList;