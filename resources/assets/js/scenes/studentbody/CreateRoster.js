import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import helpers from '../../bootstrap'
import queryString from 'query-string'

class CreateRoster extends Component {
  state = {
    academicProg: '',
    academicLevel: '',
    term: helpers.termCodesFromYear(this.props.years.academicYear)[0]
  }

  onPlanChange = (e) => {
    this.setState({
      academicProg: e.target.value,
      academicLevel: ''
    })
  }
  onLevelChange = (e) => {
    this.setState({ academicLevel: e.target.value })
  }
  onTermChange = (e) => {
    this.setState({ term: e.target.value })
  }

  formatUrl = () => {
    const { academicProg, academicLevel, term } = this.state
    const params = {rosterSource: 'student-body'}
    academicProg ? params.prog = academicProg : false
    academicLevel ? params.level = academicLevel : false
    term ? params.term = term : false

    return `${helpers.rootUrl}print/roster?${queryString.stringify(params)}`
  }

  render() {
    const { academicProg, academicLevel, term } = this.state
    const { years } = this.props

    return (
      <div className='card create-student-body-roster'>
        <h5>Create Student Body Roster</h5>

        <p>
          <label htmlFor='academic-prog'>Academic Plan</label>
          <select id='academic-prog' name='academic-prog' value={academicProg} onChange={this.onPlanChange}>
            <option value=''> -- </option>
            <option value='LALLM'>LL.M.</option>
            <option value='LAJD'>J.D.</option>
            <option value='LAJSD'>J.S.D.</option>
            <option value='LAMLS'>M.L.S.</option>
          </select><br/>
        </p>

        <p>
          <label htmlFor='academic-level'>Current Academic Level</label>
          <select id='academic-level' name='academic-level' value={academicLevel} onChange={this.onLevelChange}>
            <option value=''> -- </option>
            {academicProg === 'LALLM' && (
              <option value='M1'>M1</option>
            )}
            {academicProg === 'LAJD' && (
              <Fragment>
                <option value='P1'>P1</option>
                <option value='P2'>P2</option>
                <option value='P3'>P3</option>
              </Fragment>
            )}
            {academicProg === 'LAJSD' && (
              <Fragment>
                <option value='D01'>D01</option>
                <option value='D02'>D02</option>
                <option value='D03'>D03</option>
                <option value='D04'>D04</option>
                <option value='D05'>D05</option>
                <option value='D06'>D06</option>
                <option value='D07'>D07</option>
                <option value='D08'>D08</option>
              </Fragment>
            )}
            {academicProg === 'LAMLS' && (
              <option value='M1'>M1</option>
            )}
          </select>
        </p>

        <p>
          <label htmlFor='term'>Enrolled in Term</label>
          <select id='term' name='term' value={term} onChange={this.onTermChange}>
              <option value=''> -- </option>
              {helpers.getAllTermCodes(years).map(term => (
                <option key={term} value={term}>{helpers.termCodeToString(term)}</option>
              ))}
          </select>
        </p>

        <footer>
          <a href={this.formatUrl()} target='_blank' rel='noopener noreferrer'>
            <button className='btn-accent'>Download</button>
          </a>
        </footer>

      </div>
    )
  }
}

function mapStateToProps(state) {
  const { years } = state.app

  return {
    years
  }
}

export default connect(mapStateToProps)(CreateRoster)