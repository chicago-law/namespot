import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import InstructorNames from '../../InstructorNames'
import Loading from '../../Loading'
import helpers from '../../../bootstrap'
import { setView, fetchOfferings, saveSessionTerm } from '../../../actions'

class OfferingList extends Component {
  state = {
    query: '',
    selectedTermCode: '',
    recentOfferings: [],
  }

  searchRef = React.createRef()

  componentDidMount() {
    const { dispatch, years } = this.props
    const termCode = localStorage.getItem('selectedTerm')
      ? JSON.parse(localStorage.getItem('selectedTerm'))
      : `2${String(years.academicYear).substring(2, 4)}8` // default to Autumn of whatever the current year is
    const recentOfferings = localStorage.getItem('recentOfferings')
      ? JSON.parse(localStorage.getItem('recentOfferings'))
      : []

    dispatch(fetchOfferings({ termCode }))
    dispatch(setView('offering-list'))
    this.setState({
      selectedTermCode: termCode,
      recentOfferings,
    })
    this.searchRef.current.focus()
  }

  handleSearchInput = (e) => {
    this.setState({
      query: e.target.value,
    })
  }

  handleTermChange = (e) => {
    const { dispatch } = this.props
    const { value } = e.target

    // Value will be empty string if user selected "--" from quarter menu.
    if (value !== '') {
      dispatch(fetchOfferings({ termCode: value })) // get classes for the selected term
      dispatch(saveSessionTerm(value)) // save the selected term in local storage
    }

    this.setState({
      selectedTermCode: value,
      query: '',
    })
  }

  onOfferingClick = (e) => {
    const { recentOfferings } = this.state
    const { history } = this.props
    e.preventDefault()

    // add clicked offering's ID to local storage
    const { id } = e.target.closest('.offering').dataset
    // if recentOfferings includes the id, then create new array with that filtered out,
    // and then add to beginning
    const newRecent = JSON.stringify([id, ...recentOfferings
      .filter(offeringId => offeringId !== id).slice(0, 4)])
    localStorage.setItem('recentOfferings', newRecent)
    history.push(`/offering/${id}`)
  }

  clearQuery = () => {
    this.setState({ query: '' })
  }

  render() {
    const { query, selectedTermCode, recentOfferings } = this.state
    const {
      loading,
      offerings,
      settings,
      years,
    } = this.props
    const terms = helpers.getAllTermCodes(years)
    const offeringListClasses = classNames({
      'offering-list': true,
      'is-loading': loading.offerings,
    })

    // sort the offerings
    const sortedOfferings = Object.keys(offerings)
      .sort((idA, idB) => (offerings[idA].long_title < offerings[idB].long_title ? -1 : 1))
    // only show offerings filtered by selected term and by the search query
    const filteredOfferingList = []
    sortedOfferings.forEach((id) => {
      const offering = offerings[id]
      // first check if they're in the selected term
      if (offering.term_code === selectedTermCode || selectedTermCode === 'all') {
        // prepare a few things to make them better searchable by regex...
        const courseNumString = `${settings.catalog_prefix || 'LAWS'} ${offering.catalog_nbr}`
        let instructorsString = ''
        for (let i = 0; i < offering.instructors.length; i++) {
          instructorsString += `${offering.instructors[i].first_name} ${offering.instructors[i].last_name} `
        }
        const regex = new RegExp(query, 'gi')
        if (
          offering.long_title.match(regex)
          || courseNumString.match(regex)
          || instructorsString.match(regex)
        ) {
          filteredOfferingList.push(offering)
        }
      }
    })

    return (
      <div className={offeringListClasses}>

        <Loading />

        <header>
          <h5>Select Class</h5>
          <div className="filter-controls">
            <div className="input-container">
              {query.length
                ? <FontAwesomeIcon icon={['fas', 'times-circle']} onClick={this.clearQuery} />
                : <FontAwesomeIcon icon={['far', 'search']} />
              }
              <input
                ref={this.searchRef}
                type="text"
                value={query}
                onChange={e => this.handleSearchInput(e)}
                placeholder="Instructor, class name or number..."
              />
            </div>
            <div className="quarter-dropdown-container">
              <p>Quarter:</p>
              <select value={selectedTermCode} onChange={e => this.handleTermChange(e)}>
                <option value="">--</option>
                <option value="all">All quarters</option>
                {terms.map(term => (
                  <option key={term} value={term}>{ helpers.termCodeToString(term) }</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <ul className="content">

          {recentOfferings.length > 0
          && query.length === 0
          && Object.keys(loading).every(type => loading[type] === false) && (
            <li className="select__recent-offerings">
              <h6>Recent</h6>
              <ul>
                {recentOfferings.map((offeringId) => {
                  const offering = offerings[offeringId]
                  return offering && (
                    <li key={offering.id}>
                      <Link
                        to={`/offering/${offering.id}`}
                        onClick={this.onOfferingClick}
                        className="offering"
                        data-id={offering.id}
                      >
                        {offering.long_title}
                        <span>
                          {settings.catalog_prefix || 'LAWS'}&nbsp;
                          {offering.catalog_nbr} {offering.section && `-${offering.section} `}
                          {helpers.termCodeToString(offering.term_code)}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
          )}

          {filteredOfferingList.length > 0 && filteredOfferingList.map(offering => (
            <li key={offering.id}>
              <Link to={`/offering/${offering.id}`} onClick={this.onOfferingClick} className="offering" data-id={offering.id}>
                <h4>{offering.long_title}</h4>
                <p>
                  {settings.catalog_prefix || 'LAWS'}&nbsp;
                  {offering.catalog_nbr} {offering.section && ` - Section ${offering.section} `}
                  {offering.instructors.length > 0 && (
                    <Fragment>
                      &bull; <InstructorNames offering={offering} />&nbsp;
                    </Fragment>
                  )}
                  {offering.term_code && (
                    <Fragment>
                      &bull; {helpers.termCodeToString(offering.term_code)}
                    </Fragment>
                  )}
                </p>
                {offering.updated_at && (
                  <span className="meta">Edited {helpers.parseDate(offering.updated_at).toLocaleDateString()}</span>
                )}
              </Link>
              <FontAwesomeIcon icon={['far', 'chevron-right']} />
            </li>
          ))}

          {filteredOfferingList.length === 0 && Object.keys(loading)
            .every(l => loading[l] === false) && (
              <li className="select__no-classes-found">
                <h4>No classes found</h4>
              </li>
            )
          }
        </ul>
      </div>
    )
  }
}

const mapStateToProps = ({ app, entities, settings }) => ({
    loading: app.loading,
    offerings: entities.offerings,
    settings,
    years: app.years,
  })


export default connect(mapStateToProps)(OfferingList)
