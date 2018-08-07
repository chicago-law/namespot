import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Page from '../room/containers/Page'
import classNames from 'classnames/bind'
import Loading from '../../global/Loading'
import html2canvas from 'html2canvas'
import * as jsPDF from 'jspdf'

export default class SeatingChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showLoading: true
    }
  }

  createPdf() {
    const seatingChartCanvas = document.querySelector('canvas')

    // We start by manually add the SVGs to a blank canvas with canvg
    // because html2canvas will skip them for some reason!
    const canvgOptions = {
      // log: true,
      offsetX: 0,
      offsetY: 5
    }
    canvg(seatingChartCanvas, document.querySelector('.tables-container').outerHTML, canvgOptions)

    // Now use html2canvas to paint the rest of the page into the canvas
    const input = document.querySelector('.outer-page-container')
    const canvasOptions = {
      logging: false,
      scale:'1', // specifying 1 makes this work the same on Retina displays
      canvas: seatingChartCanvas,
      // width:'1550',
      // height:'1000',
      // windowWidth: '1550',
      // windowHeight: '1000'
    }
    html2canvas(input, canvasOptions).then((canvas) => {
      // now convert the canvas into a PDF and download
      const imgData = canvas.toDataURL('image/jpg')
      const pdf = new jsPDF({
        orientation: 'landscape',
        format: 'tabloid'
      })
      pdf.addImage(imgData, 'JPG', 0, 0)
      const title = this.props.currentOffering.long_title ? `${this.props.currentOffering.long_title}-${this.props.currentOffering.section}` : this.props.rooms[this.props.roomId].name
      pdf.save(`${title}.pdf`)

      this.setState({
        showLoading:false
      })

    })
  }


  componentDidMount() {
    // set view to 'seating-chart'
    this.props.setView('seating-chart')

    // fetch room data
    if (this.props.roomId) {
      this.props.fetchRoom(this.props.roomId)
      this.props.fetchTables(this.props.roomId)
    }

    // fetch offering data, if we need it
    if (this.props.offeringId) {
      this.props.requestOffering(this.props.offeringId)
      this.props.requestStudents(this.props.offeringId)
    }

    // set store's currentRoom and currentOffering (if there is one)
    this.props.findAndSetCurrentRoom(this.props.roomId)
    this.props.offeringId ? this.props.findAndSetCurrentOffering(this.props.offeringId) : false
  }

  componentDidUpdate() {
    // again, set currentRoom and currentOffering in app store in case we were
    // waiting on room data from fetching.
    this.props.findAndSetCurrentRoom(this.props.roomId)
    this.props.offeringId ? this.props.findAndSetCurrentOffering(this.props.offeringId) : false

    // check if we're waiting on anything to finish loading. If not, go ahead
    // and make the PDF.
    if (Object.keys(this.props.loading).every(loadingType => this.props.loading[loadingType] === false) && this.state.showLoading === true) {
      this.createPdf()
    }
  }

  render() {
    const { showLoading } = this.state
    const { withStudents } = this.props

    const seatingChartClasses = classNames({
      'printable': true,
      'seating-chart': true,
      'show-loading': showLoading
    })

    return (
      <div className={seatingChartClasses}>

        <div className='full-page-loading'>
          <Loading />
        </div>

        <Page withStudents={withStudents} />

      </div>
    )
  }
}

SeatingChart.propTypes = {
  currentOffering: PropTypes.object.isRequired,
  fetchRoom: PropTypes.func.isRequired,
  fetchTables: PropTypes.func.isRequired,
  findAndSetCurrentOffering: PropTypes.func.isRequired,
  findAndSetCurrentRoom: PropTypes.func.isRequired,
  loading: PropTypes.object.isRequired,
  offeringId: PropTypes.string,
  offerings: PropTypes.object,
  requestOffering: PropTypes.func.isRequired,
  requestStudents: PropTypes.func.isRequired,
  roomId: PropTypes.string.isRequired,
  rooms: PropTypes.object.isRequired,
  seats: PropTypes.object.isRequired,
  setView: PropTypes.func.isRequired,
  students: PropTypes.object,
  tables: PropTypes.object.isRequired,
  withStudents: PropTypes.bool.isRequired
}

