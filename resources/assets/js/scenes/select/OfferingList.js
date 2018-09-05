import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import InstructorNames from '../../global/InstructorNames'
import Loading from '../../global/Loading'
import helpers from '../../bootstrap'

export default class OfferingList extends Component {
  state = {
    query: '',
    selectedTermCode: this.props.defaultTerm
  }
  searchRef = React.createRef()

  handleSearchInput(e) {
    this.setState({
      query: e.target.value
    })
  }

  clearQuery = () => {
    this.setState({ query: '' })
  }

  handleTermChange(e) {
    // get classes for the selected term
    this.props.requestOfferings(e.target.value)
    // save the selected term so it's there in the future
    this.props.saveSessionTerm(e.target.value)
    this.setState({
      selectedTermCode: e.target.value,
      query:''
    })
  }

  onOfferingClick = (e) => {
    e.preventDefault()

    // add clicked offering's ID to local storage
    const id = e.target.closest('.offering').dataset.id
    // if recentOfferings includes the id, then create new array with that filtered out, and then add to beginning
    const newRecent = JSON.stringify([ id, ...this.props.recentOfferings.filter(offeringId => offeringId !== id).slice(0, 4) ])
    localStorage.setItem('recentOfferings', newRecent)

    this.props.history.push(`/offering/${id}`)
  }

  componentDidMount() {
    this.props.requestOfferings(this.state.selectedTermCode)
    this.props.setView('offering-list')
    this.searchRef.current.focus()
  }

  render() {
    const { query, selectedTermCode } = this.state
    const { loading, offerings, recentOfferings, years } = this.props

    const terms = helpers.getAllTermCodes(years)

    const offeringListClasses = classNames({
      'offering-list':true,
      'is-loading':loading.offerings
    })

    // sort the offerings
    const sortedOfferings = Object.keys(offerings).sort((idA, idB) => offerings[idA].long_title < offerings[idB].long_title ? -1 : 1)

    // only show offerings filtered by selected term and by the search query
    const filteredOfferingList = []
    sortedOfferings.forEach(id => {
      const offering = offerings[id]
      // first check if they're in the selected term
      if (offering.term_code === selectedTermCode) {
        // prepare a few things to make them better searchable by regex...
        const courseNumString = `LAWS ${offering.catalog_nbr}`
        let instructorsString = ''
        for (let i = 0; i < offering.instructors.length; i++) {
          instructorsString += offering.instructors[i].first_name + ' ' + offering.instructors[i].last_name + ' '
        }
        const regex = new RegExp(query, 'gi')
        if (offering.long_title.match(regex) || courseNumString.match(regex) || instructorsString.match(regex)) {
          filteredOfferingList.push(offering)
        }
      }
    })

    return (
      <div className={offeringListClasses}>

        <Loading />

        <header>
          <h5>Select Class</h5>
          <div className='filter-controls'>
            <div className="input-container">
              {query.length
                ? <FontAwesomeIcon icon={['fas','times-circle']} onClick={this.clearQuery} />
                : <FontAwesomeIcon icon={['far','search']} />
              }
              <input ref={this.searchRef} type='text' value={query} onChange={(e) => this.handleSearchInput(e)} placeholder="Type to find class..." />
            </div>
            <div className="semester-dropdown-container">
              <p>Semester:</p>
              <select value={selectedTermCode} onChange={(e) => this.handleTermChange(e)}>
                {terms.map(term =>
                  <option key={term} value={term}>{ helpers.termCodeToString(term) }</option>
                )}
              </select>
            </div>
          </div>
        </header>

        <ul className='content'>

          {recentOfferings.length > 0 && query.length === 0 && Object.keys(loading).every(type => loading[type] === false) && (
            <li className='select__recent-offerings'>
              <h6>Recent</h6>
              <ul>
                {recentOfferings.map(offeringId => {
                  const offering = offerings[offeringId]
                  return offering ? (
                    <li key={offering.id}>
                      <Link to={`/offering/${offering.id}`} onClick={this.onOfferingClick} className='offering' data-id={offering.id}>
                        {offering.long_title} - {helpers.termCodeToString(offering.term_code)}
                      </Link>
                    </li>
                  ) : ''
                })}
              </ul>
            </li>
          )}

          {filteredOfferingList.length > 0 && (filteredOfferingList.map(offering => {
            const updatedAt = new Date(offering.updatedAt)
            return (
              <li key={offering.id}>
              <Link to={`/offering/${offering.id}`} onClick={this.onOfferingClick} className='offering' data-id={offering.id}>
                <h4>{offering.long_title}</h4>
                <p>
                  LAWS {offering.catalog_nbr}-{offering.section} {offering.instructors.length > 0 && <Fragment>&bull; <InstructorNames offering={offering} /></Fragment>} &bull; {helpers.termCodeToString(offering.term_code)}
                </p>
                {offering.updatedAt && (
                  <span className='meta'>Edited {updatedAt.getMonth() + 1}/{updatedAt.getDate()}/{updatedAt.getFullYear().toString().slice(-2)}</span>
                )}
              </Link>
              <FontAwesomeIcon icon={['far', 'chevron-right']} />
            </li>
            )
          }

          ))}
          {filteredOfferingList.length === 0 && Object.keys(loading).every(l => loading[l] === false) && (
            <li className='select__no-classes-found'>
              <h4>No classes found</h4>
            </li>
          )}
        </ul>

      </div>
    )
  }
}

OfferingList.propTypes = {
  defaultTerm: PropTypes.string.isRequired,
  loading: PropTypes.object.isRequired,
  offerings: PropTypes.object.isRequired,
  recentOfferings: PropTypes.array.isRequired,
  requestOfferings: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
  saveSessionTerm: PropTypes.func.isRequired,
  years: PropTypes.object.isRequired
}