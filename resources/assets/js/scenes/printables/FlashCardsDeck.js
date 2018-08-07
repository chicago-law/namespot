import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import Loading from '../../global/Loading'
import FlashCard from './FlashCard'
import html2canvas from 'html2canvas'
import * as jsPDF from 'jspdf'
import helpers from '../../bootstrap'

export default class FlashCardsDeck extends Component {
  state = {
    showLoading: true,
  }

  createPdf() {
    const pdf = new jsPDF({
      format: 'letter',
      unit: 'in',
    })

    const cards = document.querySelectorAll('.flash-card')
    const perPage = 3
    const heightPerCard = 11 / perPage

    // variables for the loop
    let c = 0
    let currentPage = 1
    let pagePos = 0

    // the first page will be for the pics, and the second will be for names
    pdf.addPage()
    pdf.setPage(1)

    // we do a recursive, manual loop so we only go as fast as the canvases are created
    const addToPdf = function(cardsArray) {
      const canvasOptions = {
        logging: false,
        // specifying scale 1 makes this work the same on Retina displays and
        // regardless of user's browser zoom level
        scale:'1',
      }

      let even = false
      if (c % 2 === 0) {
        even = true
      }

      html2canvas(cardsArray[c], canvasOptions).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpg')

        // if the counter is even, then add face pic to current
        // if it's odd, then we have a name, so add it to current + 1
        if (even) {
          pdf.setPage(currentPage)
          pdf.addImage(imgData, 'JPG', 1.75, (pagePos * heightPerCard))
        } else {
          pdf.setPage(currentPage + 1)
          pdf.addImage(imgData, 'JPG', 1.75, (pagePos * heightPerCard))
          // increment pagePos every other one (aka only on the odds)
          // reset when at perPage
          pagePos === perPage - 1 ? pagePos = 0 : pagePos++
        }

        // increment the count and then check if we need to run the function again
        console.log(`Just created number ${c}`)
        c++
        if (c < cards.length) {
          // do we need to make more pages?
          if (c % (perPage * 2) === 0) {
            currentPage = currentPage + 2
            pdf.addPage()
            pdf.addPage()
            pdf.setPage(currentPage)
          }
          addToPdf(cards)
        } else {
          const title = `Flash Cards for ${this.props.currentOffering.long_title || helpers.termCodeToString(this.props.termCode)}`
          pdf.save(`${title}.pdf`)
          this.setState({
            showLoading:false
          })
        }
      })
    }.bind(this)

    // start the loop
    addToPdf(cards)
  }

  componentDidMount() {
    // set view to 'seating-chart'
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
    if ( Object.keys(this.props.loading).every(loadingType => this.props.loading[loadingType] === false) && this.state.showLoading === true ) {
      this.createPdf()
    }
  }

  render() {
    const { students, currentOffering, namesOnReverse, offeringId } = this.props

    // put the students into an array. If there is an offering ID, then filter
    // the students to only include this in the current offering
    const studentArray = []
    if (offeringId) {
      Object.keys(students).forEach(id => students[id].seats.hasOwnProperty([`offering_${currentOffering.id}`]) ? studentArray.push(students[id]) : false )
    } else {
      Object.keys(students).forEach(id => studentArray.push(students[id]))
    }
    const limitedStudentArray = studentArray.slice(0, 100)
    console.log(limitedStudentArray)

    const flashCardClasses = classNames({
      'printable': true,
      'flash-cards-deck': true,
      'show-loading': this.state.showLoading
    })

    return (
      <div className={flashCardClasses}>

        <div className='full-page-loading'>
          <p>Hang on, we&apos;re creating the flash cards PDF now...</p>
          <p>Depending on the number of students, this may take a few minutes.</p>
          <Loading />
        </div>

        {limitedStudentArray.map(student => (
          <FlashCard key={student.cnet_id} student={student} namesOnReverse={namesOnReverse} />
        ))}

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
