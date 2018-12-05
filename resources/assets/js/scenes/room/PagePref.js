import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class PagePref extends Component {
  state = {
    flipped: this.props.currentOffering.flipped !== null ? Boolean(this.props.currentOffering.flipped) : false,
    selectedFontSize: this.props.currentOffering.font_size || 'default',
    selectedNamesToShow: this.props.currentOffering.names_to_show || 'first_and_last',
    selectedPaperSize: this.props.currentOffering.paper_size || 'tabloid',
    useNicknames: this.props.currentOffering.use_nicknames !== null ? Boolean(this.props.currentOffering.use_nicknames) : true
  }

  changeFlipPerspective = (e) => {
    this.setState({ flipped: e.target.checked })
    this.props.requestUpdateOffering(this.props.currentOffering.id, 'flipped', +e.target.checked)
  }
  selectFontSize = (e) => {
    this.setState({ selectedFontSize: e.target.value })
    this.props.requestUpdateOffering(this.props.currentOffering.id, 'font_size', e.target.value)
  }
  selectNamesToShow = (e) => {
    this.setState({ selectedNamesToShow: e.target.value })
    this.props.requestUpdateOffering(this.props.currentOffering.id, 'names_to_show', e.target.value)
  }
  selectPaperSize = (e) => {
    this.setState({ selectedPaperSize: e.target.value })
    this.props.requestUpdateOffering(this.props.currentOffering.id, 'paper_size', e.target.value)
  }
  changeUseNicknames = (e) => {
    this.setState({ useNicknames: e.target.checked })
    this.props.requestUpdateOffering(this.props.currentOffering.id, 'use_nicknames', +e.target.checked)
  }

  componentDidUpdate(prevProps) {
    // setting the form's initial states once app if app had been waiting
    // to be hydrated with data.
    if (prevProps.currentOffering.id === null && this.props.currentOffering.id !== null) {
      this.setState({
        flipped: this.props.currentOffering.flipped !== null ? Boolean(this.props.currentOffering.flipped) : false,
        selectedFontSize: this.props.currentOffering.font_size || 'default',
        selectedNamesToShow: this.props.currentOffering.names_to_show || 'first_and_last',
        selectedPaperSize: this.props.currentOffering.paper_size || 'tabloid',
        useNicknames: this.props.currentOffering.use_nicknames !== null ? Boolean(this.props.currentOffering.use_nicknames) : true
      })
    }
  }

  render() {
    const { flipped, selectedFontSize, selectedPaperSize, selectedNamesToShow, useNicknames } = this.state

    return (
      <div className='chart-preferences'>
        <ul>
          <li>
            <FontAwesomeIcon icon={['far', 'file']} fixedWidth style={{'transform':'rotate(90deg)'}} />
            <p>Paper Size
              <select value={selectedPaperSize} onChange={this.selectPaperSize}>
                <option value='tabloid'>Tabloid</option>
                <option value='letter'>Letter</option>
              </select>
            </p>
          </li>
          <li>
            <FontAwesomeIcon icon={['far', 'font']} fixedWidth />
            <p>Name Font Size
              <select value={selectedFontSize} onChange={this.selectFontSize}>
                <option value='smaller'>Smaller</option>
                <option value='default'>Default</option>
                <option value='larger'>Larger</option>
                <option value='x-large'>Largest</option>
              </select>
            </p>
          </li>
          <li>
            <FontAwesomeIcon icon={['far', 'id-card']} fixedWidth />
            <p>Names to Show
              <select value={selectedNamesToShow} onChange={this.selectNamesToShow}>
                <option value='first_and_last'>First and Last</option>
                <option value='first_and_last_initial'>First and Last Initial</option>
                <option value='first_only'>First Only</option>
                <option value='last_only'>Last Only</option>
              </select>
            </p>
          </li>
          <li>
            <FontAwesomeIcon icon={['far', 'user-edit']} fixedWidth />
            <p>
              <input type='checkbox' name='use-nicknames' id='use-nicknames' value={useNicknames} onChange={this.changeUseNicknames} checked={useNicknames}/>
              <label htmlFor="use-nicknames">Use Nicknames</label>
            </p>
          </li>
          <li>
            <FontAwesomeIcon icon={['far', 'exchange-alt']} fixedWidth style={{'transform':'rotate(90deg)'}} />
            <p>
              <input type='checkbox' name='flip-perspective' id='flip-perspective' value={flipped} onChange={this.changeFlipPerspective} checked={flipped}/>
              <label htmlFor="flip-perspective">Flip Perspective</label>
            </p>
          </li>
        </ul>
      </div>
    )
  }
}

PagePref.propTypes = {
  currentOffering: PropTypes.object.isRequired,
  requestUpdateOffering: PropTypes.func.isRequired
}