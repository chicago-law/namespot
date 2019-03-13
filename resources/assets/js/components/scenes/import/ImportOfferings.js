import React from 'react'
import ImportForm from './ImportForm'
import ColumnsTable from './ColumnsTable'
import DownloadLinks from './DownloadLinks'

const ImportOfferings = () => (
  <section id="offerings" className="import-section">
    <h3>Import Offerings</h3>
    <p>
      <em>Contains all the offerings available for students. "Offerings" is just a more generic word for classes, courses, etc. When importing, system will look for an existing record to update with <strong>Namespot ID</strong> or <strong>Class Number</strong>.</em>
    </p>
    <DownloadLinks type="offerings" />
    <ImportForm type="offerings" />
    <ColumnsTable>
      <tr>
        <td>id</td>
        <td>int</td>
        <td>Namespot ID. Auto-generated upon importing. Leave blank unless you intend to update an entry.</td>
      </tr>
      <tr>
        <td>class_nbr</td>
        <td>int</td>
        <td>Your university's unique identifier for this instance of this class.</td>
      </tr>
      <tr>
        <td>catalog_nbr</td>
        <td>int</td>
        <td><strong>Required.</strong> Displayed through app. Preceded by your catalog prefix, which can be customized in Settings.</td>
      </tr>
      <tr>
        <td>long_title</td>
        <td>string</td>
        <td><strong>Required. </strong>Offering's full title.</td>
      </tr>
      <tr>
        <td>section</td>
        <td>int</td>
        <td>Offering section number. If present, it will display next to catalog_nbr.</td>
      </tr>
      <tr>
        <td>term_code</td>
        <td>int</td>
        <td>The academic term of the offering. It is a concatenation of the following: the first digit of the millennia, then the last two digits of the year, then either a 2, 4, or 8, depending if the term is winter, spring, or autumn, respectively. For example, Autumn 2018 is <code>2188</code>. Spring 2019 is <code>2194</code>.</td>
      </tr>
      <tr>
        <td>room_id</td>
        <td>int</td>
        <td>The Namespot ID of the room that this offering is taught in. You can assign a room this way if you want to, or you can assign a room through the app's interface.</td>
      </tr>
    </ColumnsTable>
  </section>
)

export default ImportOfferings
