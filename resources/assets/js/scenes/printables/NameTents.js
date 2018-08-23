import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import * as jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Loading from '../../global/Loading'

export default class NameTents extends Component {
  state = {
    showLoading: true,
  }

  createPdf() {
    const tents = document.querySelectorAll('.nt-list__name-tent')

    // before we do anything else, we're going to check that all names fit on their cards.
    tents.forEach(tent => this.checkNameSize(tent))

    const pdf = new jsPDF({
      format: 'letter',
      unit: 'in',
      orientation: 'landscape'
    })

    const h2cOptions = {
      logging: false,
      scale:'1',
    }

    // Start with page 1
    let currentPage = 1

    // Counter for all the name tents
    let c = 0

    const addToPdf = function(tentsArray) {

      console.log(`Processing ${c} of ${tents.length}`)

      // set us to current page
      pdf.setPage(currentPage)

      html2canvas(tentsArray[c], h2cOptions).then((canvas) => {

        const imgData = canvas.toDataURL('image/jpeg', 1.0)
        pdf.addImage(imgData, 'JPG', 0, 0)

        // Increment c and check if we need to go again.
        c++
        if (c < tents.length) {

          // increment our page counter and add another page
          currentPage++
          pdf.addPage()

          // Fire function again
          addToPdf(tents)

        } else {

          // We're done! Save the file and mop up.
          const title = `Name Tents: ${this.props.currentOffering.long_title}`
          pdf.save(`${title}.pdf`)

          // Hide everything
          document.getElementById('root').style.display = 'none'

          this.setState({
            showLoading: false
          })
        }
      })

    }.bind(this) // end addToPdf

    // start the loop
    addToPdf(tents)
  }

  checkNameSize(tent) {

    // The max distance a name element can be from top of page is the page's halfway point,
    // plus a little more since the text doesn't start right at the point that offsetTop
    // measures from.
    const maxTop = (parseFloat(window.getComputedStyle(tent).getPropertyValue('height')) / 2) + 50

    const name = tent.querySelector('.name')
    const currentTop = name.offsetTop

    if (currentTop < maxTop) {
      const span = name.querySelector('span')
      const currentSize = parseFloat(window.getComputedStyle(span).getPropertyValue('font-size'))
      span.style.fontSize = currentSize - 5 + 'px'
      this.checkNameSize(tent)
    }
  }

  componentDidMount() {
    this.props.setView('name-tents')

    // fetch offering data, if we need it
    if (this.props.offeringId) {
      this.props.requestOffering(this.props.offeringId)
      this.props.requestStudents(this.props.offeringId)
    }

    // set store's currentOffering (if there is one)
    this.props.offeringId ? this.props.findAndSetCurrentOffering(this.props.offeringId) : false
  }

  componentDidUpdate() {
    // again, set currentOffering in app store in case we were waiting on data from fetching.
    this.props.offeringId ? this.props.findAndSetCurrentOffering(this.props.offeringId) : false

    // check if we're waiting on anything to finish loading. If not, go ahead
    // and make the PDF.
    if (Object.keys(this.props.loading).every(loadingType => this.props.loading[loadingType] === false) && this.state.showLoading === true) {
      this.createPdf()
    }
  }

  render() {
    const { showLoading } = this.state
    const { currentStudents } = this.props

    const ntContainerClasses = classNames({
      'nt-container': true,
      'printable': true,
      'show-loading': this.state.showLoading
    })

    return (
      <div className={ntContainerClasses}>

        {showLoading && (
          <div className='full-page-loading'>
            <p>Hang on, we&apos;re preparing your name tents now...</p>
            <p>This shouldn't take more than a minute or so.</p>
            <Loading />
          </div>
        )}

        <div className='nt-container__nt-list'>
          {currentStudents.map(student => (
            <div key={student.id} className='nt-list__name-tent'>
              <div className='name'>
                <span>{student.short_full_name}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    )
  }
}

NameTents.propTypes = {
  currentOffering: PropTypes.object.isRequired,
  currentStudents: PropTypes.array.isRequired,
  findAndSetCurrentOffering: PropTypes.func.isRequired,
  loading: PropTypes.object.isRequired,
  offeringId: PropTypes.string,
  requestOffering: PropTypes.func.isRequired,
  requestStudents: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
}
