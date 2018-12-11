import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTimeout from 'react-timeout'
import { requestError, receiveSettings } from '../../actions'
import helpers from '../../bootstrap'
import SaveChangesButton from '../../global/SaveChangesButton'
import AcadYear from './AcadYear'
import CatalogPrefix from './CatalogPrefix'
import SchoolName from './SchoolName'

class Settings extends Component {
  state = {
    loading: false,
    isDirty: false,
    showSuccess: false,
    settings: {
      academic_year: this.props.defaultYear,
      catalog_prefix: (this.props.settings && this.props.settings.catalog_prefix) || '',
      school_name: (this.props.settings && this.props.settings.school_name) || '',
    }
  }

  onChangeSelectedYear = (year) => {
    this.setState(prevState => ({
      settings: {
        ...prevState.settings,
        academic_year: year
      },
      isDirty: true,
    }))
  }

  onChangePrefix = (prefix) => {
    this.setState(prevState => ({
      settings: {
        ...prevState.settings,
        catalog_prefix: prefix,
      },
      isDirty: true,
    }))
  }

  onChangeSchool = (name) => {
    this.setState(prevState => ({
      settings: {
        ...prevState.settings,
        school_name: name,
      },
      isDirty: true,
    }))
  }

  onSaveChanges = () => {
    const { dispatch, setTimeout } = this.props
    const { settings } = this.state

    this.setState({ loading: true })

    axios.put(`${helpers.rootUrl}api/settings`, settings)
      .then(() => {
        dispatch(receiveSettings(settings))
        this.setState({
          loading: false,
          showSuccess: true,
          isDirty: false
        })
        setTimeout(this.showSuccess, 4000)
      })
      .catch(res => {
        dispatch(requestError('save-setting', res.message))
        this.setState({
          loading: false,
        })
      })
  }

  showSuccess = () => {
    this.setState({ showSuccess: false })
  }

  render() {
    const { settings, isDirty, loading, showSuccess } = this.state
    const { years } = this.props

    return (
      <div className='settings-page card narrow-wrap'>
        <header>
          <h2>Edit Settings</h2>
        </header>
        <div className='content'>
          <form>

            <SchoolName
              onChange={this.onChangeSchool}
              schoolName={settings.school_name}
            />
            <CatalogPrefix
              onChange={this.onChangePrefix}
              catalogPrefix={settings.catalog_prefix}
            />
            <AcadYear
              onChange={this.onChangeSelectedYear}
              years={years}
              currentYear={settings.academic_year}
            />

            <div className='controls'>
              <SaveChangesButton
                onSaveChanges={this.onSaveChanges}
                isDisabled={!isDirty}
                thinking={loading}
                showSuccess={showSuccess}
              />
            </div>
          </form>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ settings, app }) {
  return {
    defaultYear: app.years.academicYear,
    years: app.years,
    settings,
  }
}

export default ReactTimeout(connect(mapStateToProps)(Settings))
