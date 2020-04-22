import React from 'react'
import styled from '../../utils/styledComponents'

const Table = styled('table')`
  width: 100%;
  text-align: left;
  border-collapse: collapse;
  th, td {
    padding: 0.5em;
    vertical-align: top;
    h5, p {
      margin: 0;
    }
  }
  th:nth-child(1) {
    min-width: 11em;
  }
  td {
    padding-bottom: 2em;
  }
  th:nth-child(1), th:nth-child(2) {
    padding-right: 2em;
  }
  tr:nth-child(odd) {
    background: ${props => props.theme.offWhite};
  }
  code {
    background: ${props => props.theme.lightGray};
    border-radius: 4px;
    padding: 0.25em;
  }
`

const ColumnsTable: React.FC = ({ children }) => (
  <Table>
    <tbody>
      <tr>
        <th><h5>Column Name</h5></th>
        <th><h5>Type</h5></th>
        <th><h5>Description</h5></th>
      </tr>
      {children}
    </tbody>
  </Table>
)

export default ColumnsTable
