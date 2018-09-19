import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import FullPageLoading from './FullPageLoading'
import FlashCard from './FlashCard'
import PrintableReady from './PrintableReady'
import helpers from '../../bootstrap'

export default class FlashCardsDeck extends Component {
  state = {
    showLoading: true,
    printableReady: false
  }

  createPdf() {
    const { namesOnReverse } = this.props

    const pdf = new jsPDF({
      format: 'letter',
      unit: 'in',
    })

    const cards = document.querySelectorAll('.flash-card')

    // Number of flash cards per page
    const perPage = 3

    // Counter for all the flash cards. Keep in mind that if we're doing
    // names on reverse, then both the front and the back count as a flash card.
    let c = 0

    // The page of the PDF we're going to print on.
    let currentPage = 1

    // The position on the page of the of the current flash card. If it's
    // three cards to page, then the top card is 0, the next will be 1,
    // and then 2.
    let pagePos = 0

    if (namesOnReverse) {
      // add another page for the names, since pics are first page
      pdf.addPage()
      // switch back to first page
      pdf.setPage(1)
    }

    const addToPdf = function(cardsArray) {
      const canvasOptions = {
        logging: false,
        scale:'1',
      }

      let even = false
      if (c % 2 === 0) {
        even = true
      }

      html2canvas(cardsArray[c], canvasOptions).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0)

        if (namesOnReverse) { // Add to PDF with names on reverse.

          // If the counter is even, then add face pic to current
          // If it's odd, then we have a name, so add it to current + 1
          if (even) {
            pdf.setPage(currentPage)
            // left margin of 1.75 in, top margin of 1 inch plus position in page x 3 in.
            // Formatted for Avery Template #5388
            pdf.addImage(imgData, 'JPG', 1.75, ((pagePos * 3) + 1))
          } else {
            pdf.setPage(currentPage + 1)
            pdf.addImage(imgData, 'JPG', 1.75, ((pagePos * 3) + 1))

            // increment pagePos every other one (aka only on the odds),
            // because we're effectively doing sets of six instead of three
            pagePos === perPage - 1 ? pagePos = 0 : pagePos++
          }

        } else { // Add to PDF for names on same side

          pdf.setPage(currentPage)
          pdf.addImage(imgData, 'JPG', 1.75, ((pagePos * 3) + 1))

          // increment or reset the page position tracker
          pagePos === perPage - 1 ? pagePos = 0 : pagePos++

        }

        // we do a recursive, manual loop so we only go as fast as the canvases are created
        // increment the count and then check if we need to run the function again

        // increment c
        console.log(`Just created number ${c} of ${cards.length}`)

        // Increment c and check if we need to go again.
        c++
        if (c < cards.length) {

          // Yes, we need to go again, but first we need to check if more pages
          // are needed. How we do this depends on namesOnReverse.

          if (namesOnReverse) {
            if (c % (perPage * 2) === 0) {
              currentPage = currentPage + 2
              pdf.addPage()
              pdf.addPage()
              pdf.setPage(currentPage)
            }
          } else {
            if (c % perPage === 0) {
              currentPage = currentPage + 1
              pdf.addPage()
              pdf.setPage(currentPage)
            }
          }

          // Fire function again
          addToPdf(cards)

        } else {

          // We're done! Save the file and mop up.
          const title = this.props.currentOffering.long_title
            ? `Flash Cards - ${this.props.currentOffering.long_title}-${this.props.currentOffering.section}`
            : `Flash Cards - Student Body - ${helpers.termCodeToString(this.props.termCode)}`
          pdf.save(`${title}.pdf`)
          window.close()

          // Hide everything
          this.setState({
            showLoading:false,
            printableReady: true
          })
        }
      })

    }.bind(this) // end addToPdf

    // start the loop
    addToPdf(cards)
  }

  componentDidMount() {
    this.props.setView('flash-cards')

    // fetch offering data, if we need it
    if (this.props.offeringId) {
      this.props.requestOffering(this.props.offeringId)
      this.props.requestStudents(this.props.offeringId)
    }

    if (this.props.termCode) {
      this.props.fetchAllStudentsFromTerm(this.props.termCode)
    }

    // set store's currentRoom and currentOffering (if there is one)
    this.props.offeringId ? this.props.findAndSetCurrentOffering(this.props.offeringId) : false
  }

  componentDidUpdate() {
    // again, set currentRoom and currentOffering in app store in case we were
    // waiting on room data from fetching.
    this.props.offeringId ? this.props.findAndSetCurrentOffering(this.props.offeringId) : false

    // check if we're waiting on anything to finish loading. If not, go ahead
    // and make the PDF.
    if (Object.keys(this.props.loading).every(loadingType => this.props.loading[loadingType] === false) && this.state.showLoading === true) {
      this.createPdf()
    }
  }

  render() {
    const { printableReady, showLoading } = this.state
    const { students, currentOffering, namesOnReverse, offeringId } = this.props

    // put the students into an array. If there is an offering ID, then filter
    // the students to only include this in the current offering
    const studentArray = []
    if (offeringId) {
      Object.keys(students).forEach(id => students[id].enrollment.hasOwnProperty([`offering_${currentOffering.id}`]) ? studentArray.push(students[id]) : false )
    } else {
      Object.keys(students).forEach(id => studentArray.push(students[id]))
    }

    const studentsSorted = studentArray.sort((a, b) => a.last_name.toUpperCase() < b.last_name.toUpperCase() ? -1 : 1)

    const flashCardClasses = classNames({
      'printable': true,
      'flash-cards-deck': true,
    })

    return (
      <div className={flashCardClasses}>

        {showLoading && (
          <FullPageLoading>
            <p>Hang on, we're preparing your flash cards now...</p>
            <p>If you're making them for one class, this shouldn't take more than a minute or so. If you're making them for all the students, you may want to go grab a cup of coffee ;)</p>
          </FullPageLoading>
        )}

        {printableReady && (
          <PrintableReady />
        )}

        {!printableReady && (
          <Fragment>
            {studentsSorted.map(student => (
              <FlashCard
                key={student.id}
                student={student}
                offering={currentOffering}
                namesOnReverse={namesOnReverse}
              />
            ))}
          </Fragment>
        )}

      </div>
    )
  }
}

FlashCardsDeck.propTypes = {
  currentOffering: PropTypes.object.isRequired,
  findAndSetCurrentOffering: PropTypes.func.isRequired,
  fetchAllStudentsFromTerm: PropTypes.func.isRequired,
  loading: PropTypes.object.isRequired,
  namesOnReverse: PropTypes.bool.isRequired,
  offeringId: PropTypes.string,
  requestOffering: PropTypes.func.isRequired,
  requestStudents: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
  students: PropTypes.object.isRequired,
  termCode: PropTypes.string
}
