import React from 'react'
import ImportForm from './ImportForm'
import ColumnsTable from './ColumnsTable'
import DownloadLinks from './DownloadLinks'

const ImportEnrollments = () => (
  <section id="enrollments" className="import-section">
    <h3>Import Enrollments</h3>
    <p>
      <em>Join table between Offerings and Students. Each row has an offering and a student, and it represents that student's enrollment in that class. When importing, system will look for an existing record to update with a match on both <strong>Offering ID</strong> and <strong>Student ID</strong>.</em>
    </p>
    <p>
      <em>Assigned seats are also stored in this table, but that will happen automatically as you seat students using the site. If for some reason you want to manually assign them here, you can.</em>
    </p>
    <DownloadLinks type="enrollments" />
    <ImportForm type="enrollments" />
    <ColumnsTable>
      <tr>
        <td>offering_id</td>
        <td>int</td>
        <td><strong>Required. </strong>Namespot ID of the offering.</td>
      </tr>
      <tr>
        <td>student_id</td>
        <td>int</td>
        <td><strong>Required. </strong>Namespot ID of the student.</td>
      </tr>
      <tr>
        <td>assigned_seat</td>
        <td>string</td>
        <td>Concatenation of table's Namespot ID and the seat at the table, joined by "_". Probably just leave this blank.</td>
      </tr>
      <tr>
        <td>canvas_enrollment_state</td>
        <td>string</td>
        <td>Indicates if this enrollment is reflected in Canvas. Possible values: <code>active</code>, <code>inactive.</code></td>
      </tr>
      <tr>
        <td>ais_enrollment_state</td>
        <td>string</td>
        <td>Indicates if this enrollment is reflected in AIS.</td>
      </tr>
      <tr>
        <td>is_namespot_addition</td>
        <td>tinyInt</td>
        <td>A <code>1</code> here indicates that this enrollment was created manually through the interface with the "Find More Students" button.</td>
      </tr>
    </ColumnsTable>
  </section>
)

export default ImportEnrollments
