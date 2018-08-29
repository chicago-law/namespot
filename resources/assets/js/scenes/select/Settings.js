import React, { Component } from 'react'
import PropTypes from 'prop-types'
import helpers from '../../bootstrap'
import SaveChangesButton from '../../global/SaveChangesButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Settings extends Component {
  state = {
    selectedYear: this.props.defaultYear
  }

  onChangeSelectedYear = (e) => {
    this.setState({
      selectedYear: e.target.value,
   })
  }

  onSaveChanges = (resolve, reject) => {
    const newYear = parseInt(this.state.selectedYear)

    // make the API call and resolve or reject
    axios.post(`${helpers.rootUrl}api/settings/update`, {
      'setting_name': 'academic_year',
      'setting_value': newYear
    })
    .then(() => {
      // resolve SaveChangesButton promise
      resolve()
      // make the change in the store
      this.props.setAcademicYear(newYear)
    })
    .catch(response => {
      // reject SaveChangesButton promise
      reject(response)
      // create error message in store
      this.props.requestError('save-setting',response.message)
      // set the dropdown back to what it was before
      this.setState({ selectedYear: this.props.defaultYear })
    })
  }

  render() {
    const { years } = this.props

    return (
      <div className='settings-page'>

        <header>
          <h5>Edit Settings</h5>
        </header>

        <div className='content'>

          <form>
            <div className='form-question'>
              <p className='question-name'><FontAwesomeIcon icon={['far', 'calendar-alt']} />Current Academic Year</p>
              <select name='academic-year' id='academic-year-select' value={this.state.selectedYear} onChange={(e) => this.onChangeSelectedYear(e)}>
                {helpers.getAllYears(years).map(year => (
                  <option key={year} value={year}>{year} - {year + 1}</option>
                ))}
              </select>
            </div>

            <div className='controls with-padding'>
              <SaveChangesButton onSaveChanges={this.onSaveChanges} />
            </div>
          </form>

        </div>
      </div>
    )
  }
}

Settings.propTypes = {
  requestError: PropTypes.func.isRequired,
  setAcademicYear: PropTypes.func.isRequired,
  defaultYear: PropTypes.number.isRequired,
  years: PropTypes.object.isRequired
}