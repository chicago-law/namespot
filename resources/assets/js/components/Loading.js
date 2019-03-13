import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Loading = () => (
  <div className="loading">
    <FontAwesomeIcon icon={['fas', 'spinner-third']} spin />
  </div>
)

export default Loading
