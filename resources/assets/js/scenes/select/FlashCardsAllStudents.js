import React, { Component } from 'react'
import PropTypes from 'prop-types'
import helpers from '../../bootstrap'

export default class FlashCardsAllStudents extends Component {
  state = {
    selectedTerm: this.props.defaultTerm,
    namesOnReverse: false
  }

  onChangeTerms = (e) => {
    this.setState({ selectedTerm: e.target.value })
  }

  onNamesOnReverseChange = (e) => {
    this.setState({ namesOnReverse: e.target.checked })
  }

  render() {
    const { selectedTerm, namesOnReverse } = this.state
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
              <input type='checkbox' name='names-on-reverse' id='names-on-reverse' checked={namesOnReverse} onChange={this.onNamesOnReverseChange}/>
              <label htmlFor='names-on-reverse'>Print names on reverse side?</label>
            </div>
          </form>

          <div className='controls with-padding'>
            <a href={`${helpers.rootUrl}print/flash-cards/term/${selectedTerm}?namesonreverse=${namesOnReverse}`} target='_blank' rel='noopener noreferrer'>
              <button className='btn-accent'>Create Flash Cards</button>
            </a>
          </div>

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