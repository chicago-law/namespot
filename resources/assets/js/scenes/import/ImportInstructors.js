import React from 'react'
import ImportForm from './ImportForm'
import ColumnsTable from './ColumnsTable'
import DownloadLinks from './DownloadLinks'

const ImportInstructors = () => (
  <section id="instructors" className="import-section">
    <h3>Import Instructors</h3>
    <p>
      <em>Contains all the instructors that can be assigned to teach offerings. Emplid and CNet ID are both optional and can be used however you'd like (they're named for systems that University of Chicago uses). When importing, system will look for an existing record to update with <strong>Namespot ID</strong>, <strong>Emplid</strong>, or <strong>CNet ID</strong>.</em>
    </p>
    <DownloadLinks type="instructors" />
    <ImportForm type="instructors"/>
    <ColumnsTable>
      <tr>
        <td>id</td>
        <td>int</td>
        <td>Namespot ID. Auto-generated upon importing. Leave blank unless you intend to update an entry.</td>
      </tr>
      <tr>
        <td>emplid</td>
        <td>string</td>
        <td>Any unique identifer code for the instructor.</td>
      </tr>
      <tr>
        <td>cnet_id</td>
        <td>string</td>
        <td>Any unique identifer code for the instructor.</td>
      </tr>
      <tr>
        <td>first_name</td>
        <td>string</td>
        <td><strong>Required.</strong> Instructor's first name.</td>
      </tr>
      <tr>
        <td>last_name</td>
        <td>string</td>
        <td><strong>Required.</strong> Instructor's last name.</td>
      </tr>
      <tr>
        <td>email</td>
        <td>string</td>
        <td>Instructor's email address.</td>
      </tr>
    </ColumnsTable>
  </section>
)

export default ImportInstructors
