import React from 'react'
import ImportForm from './ImportForm'
import ColumnsTable from './ColumnsTable'
import DownloadLinks from './DownloadLinks'

const ImportTeachings = () => (
  <section id="teachings" className="import-section">
    <h3>Import Teachings</h3>
    <p>
      <em>Join table between Instructors and Offerings. Each row has an instructor and an offering, and it represents that instructor teaching the offering. An offering can have many instructors assigned to it. When importing, system will look for an existing record to update with a match on both <strong>Instructor ID</strong> and <strong>Offering ID</strong>.</em>
    </p>
    <DownloadLinks type="teachings" />
    <ImportForm type="teachings"/>
    <ColumnsTable>
      <tr>
        <td>instructor_id</td>
        <td>int</td>
        <td><strong>Required.</strong> Namespot ID of the instructor.</td>
      </tr>
      <tr>
        <td>offering_id</td>
        <td>int</td>
        <td><strong>Required.</strong> Namespot ID of the offering.</td>
      </tr>
    </ColumnsTable>
  </section>
)

export default ImportTeachings
