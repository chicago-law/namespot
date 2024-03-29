import React from 'react'
import styled from '../../utils/styledComponents'
import ImportOfferings from './ImportOfferings'
import ImportStudents from './ImportStudents'
import ImportEnrollments from './ImportEnrollments'
import ImportInstructors from './ImportInstructors'
import ImportTeachings from './ImportTeachings'

const Container = styled('div')`
  max-width: 60em;
  margin: 5em auto;
  background: white;
  padding: 2em;
  box-shadow: ${props => props.theme.boxShadow};
  h4 {
    text-align: center;
  }
  .anchor-links {
    display: flex;
    margin: 4em 0;
    a {
      margin: 0 1em;
    }
  }
`

const ImportExport = () => {
  return (
    <Container>
      <h4>Importing and Exporting Data from Spreadsheets</h4>
      <h3>Instructions</h3>
      <p>You can populate and update the tables in Namespot's database with data from spreadsheets. Download the template for each type and fill them in with your data. Upon importing, the system will look for matches with a few different columns (described below). If a match is found with any of them, it will update that record. Otherwise, a new record is created.</p>
      <p>The spreadsheet must remain a CSV file, and you must keep the header row in there. The columns for each type of import are explained on this page. All fields are optional unless marked Required. All columns are included in the empty template, but if you'd like you can remove unused columns and even change the column order.</p>
      <ul className="anchor-links">
        <li><em>Jump to:</em></li>
        <li><a href="#offerings">Offerings</a></li>
        <li><a href="#students">Students</a></li>
        <li><a href="#enrollments">Enrollments</a></li>
        <li><a href="#instructors">Instructors</a></li>
        <li><a href="#teachings">Teaching Assignments</a></li>
      </ul>
      <ImportOfferings />
      <ImportStudents />
      <ImportEnrollments />
      <ImportInstructors />
      <ImportTeachings />
    </Container>
  )
}

export default ImportExport
