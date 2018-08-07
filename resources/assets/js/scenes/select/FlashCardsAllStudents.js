import React, { Component } from 'react'
import PropTypes from 'prop-types'
import helpers from '../../bootstrap'

export default class FlashCardsAllStudents extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTerm: this.props.defaultTerm,
      namesOnReverse: false
    }
  }

  onChangeTerms = (e) => {
    // save the selected term in local storage so it's there in the future
    this.props.saveSessionTerm(e.target.value)
    this.setState({ selectedTerm: e.target.value })
  }

  onNamesOnReverseChange = (e) => {
    this.setState({ namesOnReverse: e.target.checked })
  }

  componentDidMount() {
    this.props.fetchAllStudentsFromTerm(this.state.selectedTerm)
  }

  render() {
    const { selectedTerm } = this.state
    const { terms } = this.props

    return (
      <div className='flash-cards-all-students'>

        <form>
          <div className='form-question'>
            <p className='question-name'>Semester:</p>
            <select value={selectedTerm} onChange={this.onChangeTerms}>
              {terms.map(term =>
                <option key={term} value={term}>{helpers.termCodeToString(term)}</option>
              )}
            </select>
          </div>

          <div className='form-question'>
            <p className='question-name'>Options</p>
            <input type='checkbox' name='names-on-reverse' id='names-on-reverse' checked={this.state.namesOnReverse} onChange={(e) => this.onNamesOnReverseChange(e)}/>
            <label htmlFor='names-on-reverse'> Print names on reverse side?</label>
          </div>

          <div className='controls with-padding'>
            <a href={`${helpers.rootUrl}print/flash-cards/term/${this.state.selectedTerm}?namesonreverse=${this.state.namesOnReverse}`} target='_blank' rel='noopener noreferrer'>
              <button className='btn-accent'>Create Flash Cards</button>
            </a>
          </div>
        </form>

      </div>
    )
  }
}

FlashCardsAllStudents.propTypes = {
  fetchAllStudentsFromTerm: PropTypes.func.isRequired,
  defaultTerm: PropTypes.string,
  terms: PropTypes.array.isRequired,
  saveSessionTerm: PropTypes.func.isRequired
}