import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CSSTransition } from 'react-transition-group'
import helpers from '../../../bootstrap'
import queryString from 'query-string'

export default class PrintOffering extends Component {
  constructor(props) {
    super(props)
    this.modalRef = React.createRef()
    this.state = {
      chosenFormat: '',
      namesOnReverse: false,
      aisOnly: true
    }
  }

  onFormatChange = (e) => {
    this.setState({
      'chosenFormat':e.target.value
    })
  }

  generateUrl = () => {
    // Generate the base URL according to chosen format
    const { chosenFormat, aisOnly, namesOnReverse } = this.state
    const { currentRoom, currentOffering } = this.props
    const params = {}
    let url = `${helpers.rootUrl}print/`

    switch (chosenFormat) {
      case 'seating-chart':
        url += `seating-chart/room/${currentRoom.id}/offering/${currentOffering.id}`
        break
      case 'blank-seating-chart':
        url += `seating-chart/room/${currentRoom.id}/offering/${currentOffering.id}?`
        params.withstudents = false
        break
      case 'flash-cards':
        url += `flash-cards/offering/${currentOffering.id}?`
        params.namesonreverse = namesOnReverse
        break
      case 'name-tents':
        url += `name-tents/offering/${currentOffering.id}`
        break
      case 'roster':
        url += 'roster?'
        params.aisOnly = aisOnly
        params.rosterSource = 'offering'
        params.offeringId = currentOffering.id
        break
    }

    return `${url}${queryString.stringify(params)}`
  }

  printButtonClick() {
    this.props.setModal('print-room', false)
  }

  onNamesOnReverseChange = (e) => {
    this.setState({ namesOnReverse: e.target.checked })
  }

  onEnrollSrcChange = (e) => {
    let aisOnly = false
    if (e.target.value === 'ais-only') {
      aisOnly = true
    }
    this.setState({ aisOnly })
  }

  render() {
    const { chosenFormat, namesOnReverse, aisOnly } = this.state
    const { close, currentOffering } = this.props

    return (
      <div className='print-room' ref={this.modalRef}>

        <header>
          <h2><FontAwesomeIcon icon={['far', 'print']} />Print</h2>
        </header>

        <main>
          <form>

            {/* Print Format */}
            <div className='form-question'>
              <h5>Choose Format</h5>

              <input
                type='radio'
                id='format-seating-chart'
                name='choose-format'
                value='seating-chart'
                onChange={this.onFormatChange}
                checked={chosenFormat === 'seating-chart'}
                disabled={currentOffering.room_id === null}
              />
              <label htmlFor='format-seating-chart'>Seating Chart</label><br/>

              <input
                type='radio'
                id='format-blank-seating-chart'
                name='choose-format'
                value='blank-seating-chart'
                onChange={this.onFormatChange}
                checked={chosenFormat === 'blank-seating-chart'}
                disabled={currentOffering.room_id === null}
              />
              <label htmlFor='format-blank-seating-chart'>Blank Seating Chart</label><br/>

              <input
                type='radio'
                id='format-flash-cards'
                name='choose-format'
                value='flash-cards'
                onChange={this.onFormatChange}
                checked={chosenFormat === 'flash-cards'}
                disabled={currentOffering.students.length === 0}
              />
              <label htmlFor='format-flash-cards'>Flash Cards</label><br/>

              <input
                type='radio'
                id='format-name-tents'
                name='choose-format'
                value='name-tents'
                onChange={this.onFormatChange}
                checked={chosenFormat === 'name-tents'}
                disabled={currentOffering.students.length === 0}
              />
              <label htmlFor='format-name-tents'>Name Tents</label><br/>

              <input
                type='radio'
                id='format-roster'
                name='choose-format'
                value='roster'
                onChange={this.onFormatChange}
                checked={chosenFormat === 'roster'}
                disabled={currentOffering.students.length === 0}
              />
              <label htmlFor='format-roster'>Roster</label>
            </div>

            {/* Flash Card options */}
            <CSSTransition
              mountOnEnter
              in={chosenFormat === 'flash-cards'}
              timeout={300}
              classNames='options'
              unmountOnExit
            >
              <div className='option'>
                <h5>Options</h5>
                <input
                  type='checkbox'
                  name='names-on-reverse'
                  id='names-on-reverse'
                  checked={namesOnReverse}
                  onChange={this.onNamesOnReverseChange}
                />
                <label htmlFor='names-on-reverse'> Print names on reverse side?</label>
              </div>
            </CSSTransition>

            {/* Roster options */}
            <CSSTransition
              mountOnEnter
              in={chosenFormat === 'roster'}
              timeout={300}
              classNames='options'
              unmountOnExit
            >
              <div className='option'>
                <h5>Include</h5>

                {/* Students with "E" status in AIS */}
                <input
                  type='radio'
                  id='ais-only'
                  name='enrollment-sources'
                  value='ais-only'
                  checked={aisOnly}
                  onChange={this.onEnrollSrcChange}
                />
                <label htmlFor='ais-only'>Only students actively enrolled through AIS</label>
                <br/>

                {/* AIS enrolls, plus anyone active in Canvas, plus manual seating chart additions */}
                <input
                  type='radio'
                  id='all-sources'
                  name='enrollment-sources'
                  value='all-sources'
                  checked={!aisOnly}
                  onChange={this.onEnrollSrcChange}
                />
                <label htmlFor='all-sources'>AIS enrolled plus manually added students</label>

              </div>
            </CSSTransition>

          </form>
        </main>

        <footer className="controls">
          <button className='btn-clear' onClick={() => close()}>Cancel</button>
          <a href={this.generateUrl()} target='_blank' rel='noopener noreferrer'>
            <button
              className='btn-accent'
              onClick={() => this.printButtonClick()}
              disabled={chosenFormat === ''}
            >
              Download
            </button>
          </a>
        </footer>

      </div>
    )
  }
}

PrintOffering.propTypes = {
  close: PropTypes.func.isRequired,
  currentOffering: PropTypes.object.isRequired,
  currentRoom: PropTypes.object.isRequired,
  setModal: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
}