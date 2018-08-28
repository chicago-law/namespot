import React from 'react'
import { Link } from 'react-router-dom'

const NotFound404 = () => {
  return (
    <h3 style={{ 'marginTop': '1em'}}>Sorry, page not found! <Link to="/">Go home?</Link></h3>
  )
}

export default NotFound404