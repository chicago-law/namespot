import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import queryString from 'query-string'
import { fetchStudents, fetchStudentBody, requestOffering } from '../../../actions'
import helpers from '../../../bootstrap'
import FullPageLoading from './FullPageLoading'
import InstructorNames from '../../InstructorNames'
import PrintableReady from './PrintableReady'

class Roster extends Component {
  state = {
    showLoading: true,
    printableReady: false,
  }

  createPdf() {
    const paper = document.querySelector('.printable-roster')
    const paperStyles = window.getComputedStyle(paper)
    const paperWidth = parseFloat(paperStyles.getPropertyValue('width'))
    const paperHeight = parseFloat(paperStyles.getPropertyValue('height'))
    const columnCount = 3

    // Paper dimensions in inches. Use these to get conversation ratios
    const paperWidthInches = 17 // 8.5 x 2
    const paperHeightInches = 22 // 11 x 2
    const pxPerInch = paperHeight / paperHeightInches
    function pxToInches(pxValue) {
      return pxValue / pxPerInch
    }
    function inchesToPx(inValue) {
      return inValue * pxPerInch
    }

    // Page padding
    const paddingInches = 1 // .5 x 2
    const padding = inchesToPx(paddingInches)

    const pdf = new jsPDF({
      format: [paperHeightInches, paperWidthInches],
      unit: 'in',
    })

    // We're going to make an array of everything we want in this PDF
    const elems = []

    // Add the header, and then all the students
    const header = document.querySelector('.roster-header')
    const students = document.querySelectorAll('.roster-row')
    elems.push(header, ...students)

    // Use these to track where we are as we loop through everything
    let i = 0
    let page = 1
    let remainingSpace = paperHeight - padding
    let currentColumn = 1

    const addToPdf = function (el) {
      const currentOffering = this.props.offerings[this.props.params.offeringId]

      // First, we check if there is space enough for this next element
      const elCSS = window.getComputedStyle(el)
      const height = parseFloat(elCSS.getPropertyValue('height'))

      if (height + padding < remainingSpace) { // Okay, there is room - proceed with adding to PDF
        html2canvas(el, {
          logging: false,
          scale: 1,
        }).then((canvas) => {
          const imgData = canvas.toDataURL('image/jpeg', 1.0)
          pdf.addImage(
            imgData,
            'jpeg',
            pxToInches(padding + (((paperWidth - padding * 2) / columnCount) * (currentColumn - 1))),
            pxToInches(paperHeight - remainingSpace),
          )

          // Update the counter in the UI
          document.getElementById('index').innerHTML = i

          // K, element added. Now we need to subtract its height from remainingSpace
          remainingSpace -= height

          // If there are more to go still, re-run the function the loop, otherwise Save.
          if (i < elems.length - 1) {
            i++
            addToPdf(elems[i])
          } else { // We're done!!
            const title = currentOffering
              ? `Roster - ${currentOffering.long_title}${currentOffering.section ? ` ${currentOffering.section}` : ''}`
              : `Roster${this.props.params.prog ? ` - ${this.props.params.prog}` : ''}${this.props.params.term ? ` - ${helpers.termCodeToString(this.props.params.term)}` : ''}`
            pdf.save(`${title}.pdf`)

            this.setState({
              showLoading: false,
              printableReady: true,
            })
          }
        })
      } else if (currentColumn === 1) { // Doesn't fit! But are we still only on the first column?
        // Switch to column 2
        currentColumn = 2

        // Take us back to the top of the page and start again
        remainingSpace = paperHeight - padding
        addToPdf(el)
      } else if (currentColumn === 2) { // Doesn't fit! Okay, filled up column 2, let's do three
        // Switch to column 3
        currentColumn = 3

        // Take us back to the top of the page and start again
        remainingSpace = paperHeight - padding
        addToPdf(el)
    } else { // Doesn't fit, and we've already filled all the columns. New page!
        // Okay, we'll add a new page and fully reset
        pdf.addPage()
        page++
        pdf.setPage(page)
        remainingSpace = paperHeight - padding
        currentColumn = 1

        // Now that we're on a fresh page, try again with this element that we're on
        addToPdf(el)
      }
    }.bind(this) // end addToPdf

    // Start us off!!
    addToPdf(elems[0])
  }

  componentDidMount() {
    const { dispatch, params } = this.props
    const {
 rosterSource, prog, level, term, offeringId,
} = params

    switch (rosterSource) {
      case 'offering':
        dispatch(requestOffering(offeringId))
        dispatch(fetchStudents(offeringId))
        break
      case 'student-body':
        dispatch(fetchStudentBody({ prog, level, term }))
        break
    }
  }

  componentDidUpdate() {
    // check if we're waiting on anything to finish loading. If not, go ahead
    // and make the PDF.
    if (Object.keys(this.props.loading).every(loadingType => this.props.loading[loadingType] === false) && this.state.showLoading === true) {
      setTimeout(() => {
        this.createPdf()
      }, 2000)
    }
  }

  render() {
    const { showLoading, printableReady } = this.state
    const {
 offerings, settings, students, params,
} = this.props
    const {
 rosterSource, offeringId, prog, level, term, aisOnly,
} = params
    let currentStudents; let
currentOffering

    if (rosterSource === 'offering') {
      currentOffering = offerings[offeringId]
      currentStudents = Object.keys(students)
        .sort((a, b) => (students[a].last_name.toUpperCase() < students[b].last_name.toUpperCase() ? -1 : 1))
        .map(sId => students[sId])
      if (aisOnly === 'true') {
        currentStudents = currentStudents.filter(student => student.enrollment[`offering_${offeringId}`].is_in_ais === 1)
      }
    }
    if (rosterSource === 'student-body') {
      currentStudents = Object.keys(students)
        .sort((a, b) => (students[a].last_name.toUpperCase() < students[b].last_name.toUpperCase() ? -1 : 1))
        .map(sId => students[sId])
    }

    return (
      <div className="printable printable-roster">

        {showLoading && (
          <FullPageLoading>
            <p>Hang on, we're preparing your roster now.</p>
            <p>Depending on the number of students, this may take a minute.</p>
            <p><span id="index">0</span> of {currentStudents.length}</p>
          </FullPageLoading>
        )}

        {!printableReady && (
          <Fragment>

            {rosterSource === 'offering' && currentOffering && (
              <header className="roster-header">
                <span className="class-title">{currentOffering.long_title}</span>
                <span>{settings.catalog_prefix || 'LAWS'} {currentOffering.catalog_nbr}</span>
                <span>Term: <strong>{helpers.termCodeToString(currentOffering.term_code)}</strong></span>
                <span>Section: <strong>{currentOffering.section}</strong></span>
                <span>Instructors: <strong><InstructorNames offering={currentOffering} /></strong></span>
                <span>Students Enrolled: <strong>{currentStudents.length}</strong></span>
                <span className="printed-date">Printed {new Date().toLocaleDateString()}</span>
              </header>
            )}

            {rosterSource === 'student-body' && (
              <header className="roster-header">
                <span className="class-title">{helpers.formatAcademicProgram(prog)} Students</span>
                <span>Academic Level: <strong>{level}</strong></span>
                <span>Term: <strong>{helpers.termCodeToString(term)}</strong></span>
                <span>Students Enrolled: <strong>{currentStudents.length}</strong></span>
                <span className="printed-date">Printed {new Date().toLocaleDateString()}</span>
              </header>
            )}

            {currentStudents.map(student => (
              <li key={student.id} className="roster-row">
                <div className="roster-row__picture" style={{ backgroundImage: `url('${helpers.rootUrl}storage/student_pictures/${student.picture}')` }} />
                <div className="roster-row__info">
                  <span>
                    {student.short_first_name
                      ? student.short_first_name
                      : student.first_name
                    }
                    &nbsp;
                    {student.short_last_name
                      ? student.short_last_name
                      : student.last_name
                    }
                  </span>
                  <span className="details">{student.academic_prog_descr} {helpers.academicLevelToString(student.academic_level)}</span>
                  <span className="details">{student.cnet_id}</span>
                </div>
              </li>
            ))}
          </Fragment>
        )}

        {printableReady && (
          <PrintableReady />
        )}
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const { search } = ownProps.location
  const { offerings, students } = state.entities
  const { loading } = state.app
  const { settings } = state

  return {
    loading,
    students,
    offerings,
    settings,
    params: queryString.parse(search),
  }
}

export default connect(mapStateToProps)(Roster)
