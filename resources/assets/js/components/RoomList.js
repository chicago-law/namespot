import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const ClassList = ({ rooms }) => {
  return (
    <div className='class-list card narrow-wrap'>
      <h5>Rooms</h5>
      <ul>
        {Object.keys(rooms).map((id) => (
          <li key={id}>
            <Link to={`/rooms/edit/${id}`}>
              <h4>{rooms[id].name}</h4>
            </Link>
            <i className="far fa-chevron-right"></i>
          </li>
        ))}
      </ul>
    </div>
  )
}

ClassList.propTypes = {
  rooms: PropTypes.objectOf(PropTypes.shape({
    id:PropTypes.number.isRequired,
    name:PropTypes.string
  }))
}

export default ClassList;