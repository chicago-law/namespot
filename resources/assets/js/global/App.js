import React, { Component } from 'react'
import Header from './Header'
import Main from './containers/Main'
import Modals from './containers/Modals';

const App = () => {
  return (
    <div className='app-container'>
      <Header />
      <Main />
      <Modals />
    </div>
  )
}

export default App