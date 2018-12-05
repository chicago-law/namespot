import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setAcademicYear, requestError } from '../../actions'
import helpers from '../../bootstrap'
import SaveChangesButton from '../../global/SaveChangesButton'
import AcadYear from './AcadYear'
import CatalogPrefix from './CatalogPrefix'

class Settings extends Component {
  state = {
    academic_year: this.props.defaultYear,
    catalogPrefix: 'LAWS',
    isDirty: false,
  }

  onChangeSelectedYear = (year) => {
    this.setState({
      academic_year: year,
      isDirty: true,
   })
  }

  onSaveChanges = (resolve, reject) => {
    const { dispatch, defaultYear } = this.props
    const { academic_year } = this.state
    const newYear = parseInt(academic_year)

    // make the API call and resolve or reject
    axios.post(`${helpers.rootUrl}api/settings/update`, {
      'setting_name': 'academic_year',
      'setting_value': newYear
    })
    .then(() => {
      resolve() // resolve SaveChangesButton promise
      dispatch(setAcademicYear(newYear)) // make the change in the store
      this.setState({ isDirty: false }) // reset the form to not having changed
    })
    .catch(response => {
      reject(response) // reject SaveChangesButton promise
      dispatch(requestError('save-setting',response.message)) // create error message in store
      this.setState({ selectedYear: defaultYear }) // set the dropdown back to what it was before
    })
  }

  render() {
    const { academic_year, catalogPrefix, isDirty } = this.state
    const { years } = this.props

    return (
      <div className='settings-page card narrow-wrap'>

        <header>
          <h2>Edit Settings</h2>
        </header>

        <div className='content'>
          <form>

            <AcadYear onChange={this.onChangeSelectedYear} years={years} currentYear={academic_year} />
            <CatalogPrefix onChange={this.onChangeCatalogPrefix} catalogPrefix={catalogPrefix} />

            <div className='controls'>
              <SaveChangesButton onSaveChanges={this.onSaveChanges} isDisabled={!isDirty} />
            </div>
          </form>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ app }) {
  return {
    defaultYear: app.years.academicYear,
    years: app.years
  }
}

export default connect(mapStateToProps)(Settings)
