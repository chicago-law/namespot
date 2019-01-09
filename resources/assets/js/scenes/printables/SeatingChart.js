import React, { Component } from 'react'
import { connect } from 'react-redux'
import queryString from 'query-string'
import Page from '../room/Page'
import classNames from 'classnames/bind'
import FullPageLoading from './FullPageLoading'
import PrintableReady from './PrintableReady'
import {
  fetchRoom,
  fetchTables,
  requestOffering,
  requestStudents,
  findAndSetCurrentOffering,
  findAndSetCurrentRoom,
  setView,
 } from '../../actions'

class SeatingChart extends Component {
  state = {
    showLoading: true,
    printableReady: false
  }

  createPdf() {
    // We start by manually adding the SVGs to a blank canvas with canvg
    // because html2canvas will skip them for some reason!

    // grab the existing canvas we put in the dom
    const seatingChartCanvas = document.querySelector('canvas')

    const canvgOptions = {
      log: true,
      offsetX: 0,
      offsetY: 5
    }
    canvg(seatingChartCanvas, document.querySelector('.tables-container').outerHTML, canvgOptions)

    // Now use html2canvas to paint the rest of the page into the canvas
    // const input = document.querySelector('.test')
    const input = document.querySelector('.outer-page-container')
    const h2cOptions = {
      logging: true,
      scale: '1', // specifying 1 makes this work the same on Retina displays
      canvas: seatingChartCanvas,
    }
    html2canvas(input, h2cOptions).then((canvas) => {
      const { currentOffering, rooms, roomId } = this.props

      // these are the dimensions for the PDF that will be generated, in inches.
      // They should be doubled from normal, because we're cranking out higher res
      let dimensions
      switch (currentOffering.paper_size) {
        case 'tabloid':
          dimensions = [22.5, 35.5]
          break
        case 'letter':
          dimensions = [17, 22]
          break
        default:
          dimensions = [22.5, 35.5]
      }

      // now convert the canvas into a PDF and download
      const imgData = canvas.toDataURL('image/jpeg', 1.0)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: dimensions
      })
      pdf.addImage(imgData, 'jpeg', 0, 0)
      const title = currentOffering.long_title
        ? `Seating Chart - ${currentOffering.long_title}${currentOffering.section ? ' ' + currentOffering.section : ''}`
        : `Blank Chart - ${rooms[roomId].name}`
      pdf.save(`${title}.pdf`)

      this.setState({
        showLoading: false,
        printableReady: true
      })

    })
  }

  componentDidMount() {
    const { dispatch, roomId, offeringId } = this.props

    // set view to 'seating-chart'
    dispatch(setView('seating-chart'))

    // fetch room data
    if (roomId) {
      dispatch(fetchRoom(roomId))
      dispatch(fetchTables(roomId))
    }

    // fetch offering data, if we need it
    if (offeringId) {
      dispatch(requestOffering(offeringId))
      dispatch(requestStudents(offeringId))
    }

    // set store's currentRoom and currentOffering (if there is one)
    dispatch(findAndSetCurrentRoom(roomId))
    if (offeringId) dispatch(findAndSetCurrentOffering(offeringId))
  }

  componentDidUpdate() {
    const { showLoading } = this.state
    const { dispatch, roomId, offeringId, loading } = this.props

    // again, set currentRoom and currentOffering in app store in case we were
    // waiting on room data from fetching.
    dispatch(findAndSetCurrentRoom(roomId))
    if (offeringId) dispatch(findAndSetCurrentOffering(offeringId))

    // check if we're waiting on anything to finish loading. If not, go ahead
    // and make the PDF.
    if (Object.keys(loading).every(loadingType => loading[loadingType] === false) && showLoading === true) {
      setTimeout(()=> {
        this.createPdf()
      }, 2000)
    }
  }

  render() {
    const { showLoading, printableReady } = this.state
    const { withStudents } = this.props

    const seatingChartClasses = classNames({
      'printable': true,
      'seating-chart': true,
    })

    return (
      <div className={seatingChartClasses}>

        {showLoading && (
          <FullPageLoading>
            <p>Hang on, we&apos;re preparing your seating chart now...</p>
          </FullPageLoading>
        )}

        {!printableReady && (
          <Page withStudents={withStudents} />
        )}

        {printableReady && (
          <PrintableReady />
        )}

      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentOffering = {}
  if (ownProps.match.params.offeringid != null && Object.keys(state.entities.offerings).length && state.entities.offerings[ownProps.match.params.offeringid]) {
    currentOffering = state.entities.offerings[ownProps.match.params.offeringid]
  }

  // parse any URL parameters
  const urlParams = queryString.parse(ownProps.location.search)
  const withStudents = urlParams.withstudents === 'false' ? false : true

  return {
    currentOffering,
    loading: state.app.loading,
    offeringId: ownProps.match.params.offeringid,
    offerings: state.entities.offerings,
    roomId: ownProps.match.params.roomid,
    rooms: state.entities.rooms,
    seats: state.entities.seats,
    students: state.entities.students,
    tables: state.entities.tables,
    withStudents
  }
}

export default connect(mapStateToProps)(SeatingChart)
