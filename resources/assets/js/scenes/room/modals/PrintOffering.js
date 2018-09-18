import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CSSTransition } from 'react-transition-group'
import helpers from '../../../bootstrap'


export default class PrintOffering extends Component {
  constructor(props) {
    super(props)
    this.modalRef = React.createRef()
    this.state = {
      chosenFormat: '',
      namesOnReverse: false,
      aisOnly: false
    }
  }

  onFormatChange = (e) => {
    this.setState({
      'chosenFormat':e.target.value
    })
  }

  generateUrl = () => {
    let url = `${helpers.rootUrl}print/`
    const params = {}
    // Generate the base URL according to chosen format
    switch (this.state.chosenFormat) {
      case 'seating-chart':
        url += `seating-chart/room/${this.props.currentRoom.id}/offering/${this.props.currentOffering.id}`
        break
      case 'blank-seating-chart':
        url += `seating-chart/room/${this.props.currentRoom.id}/offering/${this.props.currentOffering.id}`
        params.withstudents = false
        break
      case 'flash-cards':
        url += `flash-cards/offering/${this.props.currentOffering.id}`
        params.namesonreverse = this.state.namesOnReverse
        break
      case 'name-tents':
        url += `name-tents/offering/${this.props.currentOffering.id}`
        break
      case 'roster':
        url += `roster/offering/${this.props.currentOffering.id}`
        params.aisonly = this.state.aisOnly
        break
    }

    // Add the params to the URL
    if (Object.keys(params).length > 0) {
      url += '?'
      for (let param in params) {
        url += `${param}=${params[param]}&`
      }
    }
    return url
  }

  printButtonClick() {
    this.props.setModal('print-room',false)
  }

  onNamesOnReverseChange = (e) => {
    this.setState({ namesOnReverse: e.target.checked })
  }

  onAISOnlyChange = (e) => {
    this.setState({ aisOnly: e.target.checked })
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
                  onChange={(e) => this.onNamesOnReverseChange(e)}
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
                <h5>Options</h5>
                <input
                  type='checkbox'
                  name='ais-only'
                  id='ais-only'
                  checked={aisOnly}
                  onChange={(e) => this.onAISOnlyChange(e)}
                />
                <label htmlFor='ais-only'> Only include students enrolled through AIS?</label>
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