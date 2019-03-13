import React from 'react'

const ColumnsTable = ({ children }) => (
  <table>
    <tbody>
      <tr>
        <th><h5>Column Name</h5></th>
        <th><h5>Type</h5></th>
        <th><h5>Description</h5></th>
      </tr>
      {children}
    </tbody>
  </table>
)

export default ColumnsTable
