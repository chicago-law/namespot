import React, { Component } from 'react'
import PropTypes from 'prop-types'
import helpers from '../../../bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class PrintOffering extends Component {
  constructor(props) {
    super(props)
    this.modalRef = React.createRef()
    this.state = {
      chosenFormat: '',
      namesOnReverse: false,
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

  render() {

    return (
      <div className='print-room' ref={this.modalRef}>

        <header>
          <h2><FontAwesomeIcon icon={['far', 'print']} />Print</h2>
        </header>

        <main>
          <form>

            {/* Print Format */}
            <div className='form-question'>
              <p className='question-name'>Choose Format</p>

              <input
                type='radio'
                id='format-seating-chart'
                name='choose-format'
                value='seating-chart'
                onChange={this.onFormatChange}
                checked={this.state.chosenFormat === 'seating-chart'}
                disabled={this.props.currentOffering.room_id === null}
              />
              <label htmlFor='format-seating-chart'>Seating Chart</label><br/>

              <input
                type='radio'
                id='format-blank-seating-chart'
                name='choose-format'
                value='blank-seating-chart'
                onChange={this.onFormatChange}
                checked={this.state.chosenFormat === 'blank-seating-chart'}
                disabled={this.props.currentOffering.room_id === null}
              />
              <label htmlFor='format-blank-seating-chart'>Blank Seating Chart</label><br/>

              <input
                type='radio'
                id='format-flash-cards'
                name='choose-format'
                value='flash-cards'
                onChange={this.onFormatChange}
                checked={this.state.chosenFormat === 'flash-cards'}
                disabled={this.props.currentOffering.students.length === 0}
              />
              <label htmlFor='format-flash-cards'>Flash Cards</label><br/>

              <input
                type='radio'
                id='format-name-tents'
                name='choose-format'
                value='name-tents'
                onChange={this.onFormatChange}
                checked={this.state.chosenFormat === 'name-tents'}
                disabled={this.props.currentOffering.students.length === 0}
              />
              <label htmlFor='format-name-tents'>Name Tents</label>
            </div>

            {/* Flash Card options */}
            {this.state.chosenFormat === 'flash-cards' && (
              <div className='form-question'>
                <p className='question-name options'>Options</p>
                <input
                  type='checkbox'
                  name='names-on-reverse'
                  id='names-on-reverse'
                  checked={this.state.namesOnReverse}
                  onChange={(e) => this.onNamesOnReverseChange(e)}
                />
                <label htmlFor='names-on-reverse'> Print names on reverse side?</label>
              </div>
            )}

          </form>
        </main>

        <footer className="controls">
          <button className='btn-clear' onClick={() => this.props.close()}>Cancel</button>
          <a href={this.generateUrl()} target='_blank' rel='noopener noreferrer'>
            <button
              className='btn-accent'
              onClick={() => this.printButtonClick()}
              disabled={this.state.chosenFormat === ''}
            >
              Print
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