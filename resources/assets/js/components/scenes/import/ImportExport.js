import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import ImportOfferings from './ImportOfferings'
import ImportStudents from './ImportStudents'
import ImportEnrollments from './ImportEnrollments'
import ImportInstructors from './ImportInstructors'
import ImportTeachings from './ImportTeachings'

const ImportExport = () => (
  <div className="card wide-wrap import-export">
    <h2>Importing and Exporting Data from Spreadsheets</h2>
    <h3>Instructions</h3>
    <p>You can populate and update the tables in Namespot's database with data from spreadsheets. Download the template for each type and fill them in with your data. Upon importing, the system will look for matches with a few different columns (described below). If a match is found with any of them, it will update that record. Otherwise, a new record is created.</p>
    <p>The spreadsheet must remain a CSV file, and you must keep the header row in there. The columns for each type of import are explained on this page. All fields are optional unless marked Required. All columns are included in the empty template, but if you'd like you can remove unused columns and even change the column order.</p>
    <Route
      path="/import"
      exact
      render={() => (
        <Fragment>
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
        </Fragment>
    )}
    />
  </div>
)

export default connect()(ImportExport)
