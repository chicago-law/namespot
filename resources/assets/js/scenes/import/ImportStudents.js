import React from 'react'
import ImportForm from './ImportForm'
import ColumnsTable from './ColumnsTable'
import DownloadLinks from './DownloadLinks'

const ImportStudents = () => (
  <section id="students" className="import-section">
    <h3>Import Students</h3>
    <p>
      <em>Contains all the students that can be enrolled in offerings. Canvas ID and CNet ID are both optional and can be used however you'd like (they're named for systems that University of Chicago uses). When importing, system will look for an existing record to update with <strong>Namespot ID</strong>, <strong>Canvas ID</strong>, or <strong>CNet ID</strong>.</em>
    </p>
    <DownloadLinks type="students" />
    <ImportForm type="students" />
    <ColumnsTable>
      <tr>
        <td>id</td>
        <td>int</td>
        <td>Namespot ID. Auto-generated upon importing. Leave blank unless you intend to update an entry.</td>
      </tr>
      <tr>
        <td>first_name</td>
        <td>string</td>
        <td><strong>Required. </strong>Student's full first name. Displayed in Student Details.</td>
      </tr>
      <tr>
        <td>middle_name</td>
        <td>string</td>
        <td>Student's middle name. Displayed in Student Details.</td>
      </tr>
      <tr>
        <td>last_name</td>
        <td>string</td>
        <td><strong>Required.</strong> Student's full last  name. Displayed in Student Details.</td>
      </tr>
      <tr>
        <td>canvas_id</td>
        <td>string</td>
        <td>Any unique identifer for the student.</td>
      </tr>
      <tr>
        <td>cnet_id</td>
        <td>string</td>
        <td>Any unique identifer for the student.</td>
      </tr>
      <tr>
        <td>short_first_name</td>
        <td>string</td>
        <td>Alternate for first name. Displayed on seating charts.</td>
      </tr>
      <tr>
        <td>short_last_name</td>
        <td>string</td>
        <td>Alternate for last name. Displayed on seating charts.</td>
      </tr>
      <tr>
        <td>nickname</td>
        <td>string</td>
        <td>Additional "nickname" for student. This is customizable through the app when seating students.</td>
      </tr>
      <tr>
        <td>picture</td>
        <td>string</td>
        <td>Filename of student avatar image. Image is assumed to be in <code>{'{root URL}'}/images/students/</code>. For example, if this field is "sample-face.jpg", the site will look for an image at <code>{'{root URL}'}/images/students/sample-face.jpg</code>.</td>
      </tr>
      <tr>
        <td>email</td>
        <td>string</td>
        <td>Student's email address.</td>
      </tr>
      <tr>
        <td>academic_career</td>
        <td>string</td>
        <td>Academic department (ie, Law).</td>
      </tr>
      <tr>
        <td>academic_prog</td>
        <td>string</td>
        <td>Academic degree program short name (ie, JD).</td>
      </tr>
      <tr>
        <td>academic_prog_descr</td>
        <td>string</td>
        <td>Full name of academic degree program (ie, Law School J.D.).</td>
      </tr>
      <tr>
        <td>academic_level</td>
        <td>string</td>
        <td>Current year level in academic degree program (ie, M1).</td>
      </tr>
      <tr>
        <td>exp_grad_term</td>
        <td>string</td>
        <td>Term code of expected graduation.</td>
      </tr>
    </ColumnsTable>
  </section>
)

export default ImportStudents
