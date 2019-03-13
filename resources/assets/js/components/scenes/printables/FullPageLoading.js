import React from 'react'
import Loading from '../../Loading'

const FullPageLoading = ({ children }) => (
  <div className="full-page-loading">
    {children}
    <Loading />
  </div>
)

export default FullPageLoading
