import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { fetchStudents, requestOffering } from '../../actions'
import helpers from '../../bootstrap'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import FullPageLoading from '../printables/FullPageLoading'
import InstructorNames from '../../global/InstructorNames'
import PrintableReady from './PrintableReady'

class Roster extends Component {
  state = {
    showLoading: true,
    printableReady: false
  }
  rosterRef = React.createRef()

  createPdf() {

    const pdf = new jsPDF({
      format: 'letter',
      unit: 'in',
    })

    // We're going to make an array of everything we want in this PDF
    const elems = []

    // Add the header, and then all the students
    const header = document.querySelector('.roster-header')
    const students = document.querySelectorAll('.roster-row')
    elems.push(header, ...students)

    // the .printable-roster div has a height of 11in, set in CSS, and now we can measure it to get
    // that value converted into pixels.
    const initPaperHeight = parseFloat(window.getComputedStyle(document.querySelector('.printable-roster')).getPropertyValue('height'))
    const pxPerInch = initPaperHeight / 11

    // Half-inch margins padding (in pixels)
    const padding = .5 * pxPerInch

    // Use these to track where we are as we loop through everything
    let i = 0
    let page = 1
    let remainingSpace = initPaperHeight - padding
    let column = 1

    const addToPdf = function(el) {
      console.log(`${i} of ${elems.length}`, el)

      // First, we check if there is space enough for this next element
      const height = parseFloat(window.getComputedStyle(el).getPropertyValue('height'))

      if (height + padding < remainingSpace) { // Okay, there is room - proceed with adding to PDF
        html2canvas(el, {
          logging: false,
          scale: 1
        }).then(canvas => {
          const imgData = canvas.toDataURL('image/jpeg', 1.0)
          pdf.addImage(
            imgData,
            'jpeg',
            (7.5 / 3) * (column - 1) + (padding / pxPerInch),
            (initPaperHeight - remainingSpace) / pxPerInch
          )

          // K, element added. Now we need to subtract its height from remainingSpace
          remainingSpace = remainingSpace - height

          // If there are more to go still, re-run the function the loop, otherwise Save.
          if (i < elems.length - 1) {
            i++
            addToPdf(elems[i])
          } else { // We're done!!
            pdf.save('test.pdf')
            this.setState({
              showLoading: false,
              printableReady: true
            })
          }
        })

      } else if (column === 1) { // Doesn't fit! But are we still only on the first column?
        // Switch to column 2
        column = 2

        // Take us back to the top of the page and start again
        remainingSpace = initPaperHeight - padding
        addToPdf(el)

      } else if (column === 2) { // Doesn't fit! Okay, filled up column 2, let's do three

        // Switch to column 3
        column = 3

        // Take us back to the top of the page and start again
        remainingSpace = initPaperHeight - padding
        addToPdf(el)

    } else { // Doesn't fit, and we've already filled column 2! New page!

        // Okay, we'll add a new page and fully reset
        pdf.addPage()
        page++
        pdf.setPage(page)
        remainingSpace = initPaperHeight - padding
        column = 1

        // Now that we're on a fresh page, try again with this element that we're on
        addToPdf(el)
      }

    }.bind(this) // end addToPdf

    // Start us off!
    addToPdf(elems[0])

  }

  componentDidMount() {
    const { dispatch, offeringid } = this.props

    dispatch(requestOffering(offeringid))
    dispatch(fetchStudents(offeringid))
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
    const { offeringid, offerings, students } = this.props
    const currentOffering = offerings[offeringid]
    const currentStudents = Object.keys(students)
      .filter(sId => currentOffering.students.includes(parseInt(sId)))
      .sort((a, b) => students[a].last_name.toUpperCase() < students[b].last_name.toUpperCase() ? -1 : 1)
      .map(sId => students[sId])

    return (
      <div className='printable printable-roster' ref={this.rosterRef}>

        {showLoading && (
          <FullPageLoading>
            Hang on! We're preparing your class roster now...
          </FullPageLoading>
        )}

        {!printableReady && currentOffering && (
          <Fragment>
            <header className='roster-header'>
              <span className='class-title'>{currentOffering.long_title}</span>
              <span>LAWS {currentOffering.catalog_nbr}-{currentOffering.section}</span>
              <span>Term: <strong>{helpers.termCodeToString(currentOffering.term_code)}</strong></span>
              <span>Section: <strong>{currentOffering.section}</strong></span>
              <span>Instructors: <strong><InstructorNames offering={currentOffering} /></strong></span>
              <span>Students Enrolled: <strong>{currentStudents.length}</strong></span>
            </header>
            {currentStudents.map(student => (
              <li key={student.id} className='roster-row'>
                <div className='picture' style={{ 'backgroundImage': `url('${helpers.rootUrl}images/students/${student.picture}')` }}></div>
                <div>
                  <span>{student.short_full_name}</span>
                  {/* <span>{student.cnet_id}@uchicago.edu</span> */}
                </div>
              </li>
            ))}
          </Fragment>
        )}

        {printableReady &&  (
          <PrintableReady />
        )}
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const { offeringid } = ownProps.match.params
  const { offerings, students } = state.entities
  const { loading } = state.app

  return {
    loading,
    offeringid,
    students,
    offerings
  }
}

export default connect(mapStateToProps)(Roster)