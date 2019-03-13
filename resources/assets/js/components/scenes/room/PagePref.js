import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'
import { requestUpdateOffering } from '../../../actions'

class PagePref extends Component {
  constructor(props) {
    super(props)
    const { currentOffering } = this.props
    this.state = {
      flipped: currentOffering.flipped !== null ? Boolean(currentOffering.flipped) : false,
      selectedFontSize: currentOffering.font_size || 'default',
      selectedNamesToShow: currentOffering.names_to_show || 'first_and_last',
      selectedPaperSize: currentOffering.paper_size || 'tabloid',
      useNicknames: currentOffering.use_nicknames !== null
        ? Boolean(currentOffering.use_nicknames)
        : true,
    }
  }

  componentDidUpdate(prevProps) {
    // setting the form's initial states if app had been waiting
    // to be hydrated with data.
    const { currentOffering } = this.props
    if (prevProps.currentOffering.id === null && currentOffering.id !== null) {
      this.setState({
        flipped: currentOffering.flipped !== null ? Boolean(currentOffering.flipped) : false,
        selectedFontSize: currentOffering.font_size || 'default',
        selectedNamesToShow: currentOffering.names_to_show || 'first_and_last',
        selectedPaperSize: currentOffering.paper_size || 'tabloid',
        useNicknames: currentOffering.use_nicknames !== null
        ? Boolean(currentOffering.use_nicknames)
        : true,
      })
    }
  }

  changeFlipPerspective=(e) => {
    const { dispatch, currentOffering } = this.props
    this.setState({ flipped: e.target.checked })
    dispatch(requestUpdateOffering(currentOffering.id, 'flipped', +e.target.checked))
  }

  selectFontSize=(e) => {
    const { dispatch, currentOffering } = this.props
    this.setState({ selectedFontSize: e.target.value })
    dispatch(requestUpdateOffering(currentOffering.id, 'font_size', e.target.value))
  }

  selectNamesToShow=(e) => {
    const { dispatch, currentOffering } = this.props
    this.setState({ selectedNamesToShow: e.target.value })
    dispatch(requestUpdateOffering(currentOffering.id, 'names_to_show', e.target.value))
  }

  selectPaperSize=(e) => {
    const { dispatch, currentOffering } = this.props
    this.setState({ selectedPaperSize: e.target.value })
    dispatch(requestUpdateOffering(currentOffering.id, 'paper_size', e.target.value))
  }

  changeUseNicknames=(e) => {
    const { dispatch, currentOffering } = this.props
    this.setState({ useNicknames: e.target.checked })
    dispatch(requestUpdateOffering(currentOffering.id, 'use_nicknames', +e.target.checked))
  }

  render() {
    const {
      flipped, selectedFontSize, selectedPaperSize, selectedNamesToShow, useNicknames,
    } = this.state

    return (
      <div className="chart-preferences">
        <ul>
          <li>
            <FontAwesomeIcon icon={['far', 'file']} fixedWidth style={{ transform: 'rotate(90deg)' }} />
            <p>Paper Size
              <select value={selectedPaperSize} onChange={this.selectPaperSize}>
                <option value="tabloid">Tabloid</option>
                <option value="letter">Letter</option>
              </select>
            </p>
          </li>
          <li>
            <FontAwesomeIcon icon={['far', 'font']} fixedWidth />
            <p>Name Font Size
              <select value={selectedFontSize} onChange={this.selectFontSize}>
                <option value="smaller">Smaller</option>
                <option value="default">Default</option>
                <option value="larger">Larger</option>
                <option value="x-large">Largest</option>
              </select>
            </p>
          </li>
          <li>
            <FontAwesomeIcon icon={['far', 'id-card']} fixedWidth />
            <p>Names to Show
              <select value={selectedNamesToShow} onChange={this.selectNamesToShow}>
                <option value="first_and_last">First and Last</option>
                <option value="first_and_last_initial">First and Last Initial</option>
                <option value="first_only">First Only</option>
                <option value="last_only">Last Only</option>
              </select>
            </p>
          </li>
          <li>
            <FontAwesomeIcon icon={['far', 'user-edit']} fixedWidth />
            <p>
              <label htmlFor="use-nicknames">
                <input
                  type="checkbox"
                  name="use-nicknames"
                  id="use-nicknames"
                  value={useNicknames}
                  onChange={this.changeUseNicknames}
                  checked={useNicknames}
                />
                Use Nicknames
              </label>
            </p>
          </li>
          <li>
            <FontAwesomeIcon icon={['far', 'exchange-alt']} fixedWidth style={{ transform: 'rotate(90deg)' }} />
            <p>
              <label htmlFor="flip-perspective">
                <input
                  type="checkbox"
                  name="flip-perspective"
                  id="flip-perspective"
                  value={flipped}
                  onChange={this.changeFlipPerspective}
                  checked={flipped}
                />
                Flip Perspective
              </label>
            </p>
          </li>
        </ul>
      </div>
    )
  }
}

const mapStateToProps = state => ({
    currentOffering: state.app.currentOffering,
  })

export default connect(mapStateToProps)(PagePref)
