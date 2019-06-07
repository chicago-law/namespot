/* eslint-disable new-cap */
/* eslint-disable func-names */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames/bind'
import FullPageLoading from './FullPageLoading'
import PrintableReady from './PrintableReady'
import {
  requestStudents,
  setView,
  requestOffering,
  findAndSetCurrentOffering,
} from '../../../actions'


class NameTents extends Component {
  state = {
    showLoading: true,
    printableReady: false,
  }

  componentDidMount() {
    const { dispatch, offeringId } = this.props

    dispatch(setView('name-tents'))

    // fetch offering data, if we need it
    if (offeringId) {
      dispatch(requestOffering(offeringId))
      dispatch(requestStudents(offeringId))
    }
  }

  componentDidUpdate() {
    const { showLoading } = this.state
    const { loading } = this.props

    // check if we're waiting on anything to finish loading. If not, go ahead
    // and make the PDF.
    if (Object.keys(loading).every(loadingType => loading[loadingType] === false) && showLoading === true) {
      setTimeout(() => {
        this.createPdf()
      }, 2000)
    }
  }

  createPdf = () => {
    const { currentOffering } = this.props
    const tents = document.querySelectorAll('.nt-list__name-tent')

    // before we do anything else, we're going to check that all names fit on their cards.
    tents.forEach(tent => this.checkNameSize(tent))

    const pdf = new jsPDF({
      format: 'letter',
      unit: 'in',
      orientation: 'landscape',
    })

    const h2cOptions = {
      logging: false,
      scale: '1',
    }

    // Start with page 1
    let currentPage = 1

    // Counter for all the name tents
    let c = 0

    const addToPdf = function (tentsArray) {
      console.log(`Processing ${c} of ${tents.length}`) //eslint-disable-line

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
          const title = `Name Tents - ${currentOffering.long_title}${currentOffering.section ? ` ${currentOffering.section}` : ''}`
          pdf.save(`${title}.pdf`)

          this.setState({
            showLoading: false,
            printableReady: true,
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
    const maxTop = (parseFloat(window.getComputedStyle(tent).getPropertyValue('height')) / 2) + 25
    const name = tent.querySelector('.name')
    const currentTop = name.offsetTop

    if (currentTop < maxTop) {
      const span = name.querySelector('span')
      const currentSize = parseFloat(window.getComputedStyle(span).getPropertyValue('font-size'))
      const newSize = currentSize - 5
      span.style.fontSize = `${newSize}px`

      this.checkNameSize(tent)
    }
  }

  render() {
    const { printableReady, showLoading } = this.state
    const { currentStudents } = this.props

    const ntContainerClasses = classNames({
      'nt-container': true,
      printable: true,
    })

    return (
      <div className={ntContainerClasses}>

        {showLoading && (
          <FullPageLoading>
            <p>Hang on, we're preparing your flash cards now...</p>
            <p>This shouldn't take more than a minute or so.</p>
          </FullPageLoading>
        )}

        {printableReady && (
          <PrintableReady />
        )}

        {!printableReady && (
        <div className="nt-container__nt-list">
          {currentStudents.map(student => (
            <div key={student.id} className="nt-list__name-tent">
              <div className="name">
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
              </div>
            </div>
            ))}
        </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentOffering = {}
  if (ownProps.match.params.offeringId != null
    && Object.keys(state.entities.offerings).length
    && state.entities.offerings[ownProps.match.params.offeringId]
  ) {
    currentOffering = state.entities.offerings[ownProps.match.params.offeringId]
  }

  const currentStudents = Object.keys(state.entities.students)
    .filter(studentId => currentOffering.students.includes(parseInt(studentId)))
    .map(studentId => state.entities.students[studentId])
    .sort((a, b) => (a.last_name < b.last_name ? -1 : 1))

  return {
    currentOffering,
    currentStudents,
    offeringId: ownProps.match.params.offeringId,
    students: state.entities.students,
    loading: state.app.loading,
  }
}

export default connect(mapStateToProps)(NameTents)
