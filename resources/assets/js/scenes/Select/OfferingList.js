import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import Loading from '../../global/Loading';
import helpers from '../../bootstrap';

export default class OfferingList extends Component {
  constructor(props) {
    super(props)
    this.searchRef = React.createRef();
    this.state = {
      search: '',
      selectedTerm:'2188'
    }
  }

  componentDidMount() {
    this.props.requestOfferings(this.state.selectedTerm);
    this.props.setView('offering-list');
  }

  handleSearchInput(e) {
    this.setState({
      search: e.target.value
    });
  }

  handleTermChange(e) {
    this.props.requestOfferings(e.target.value);
    this.setState({
      selectedTerm: e.target.value,
      search:''
    });
    this.searchRef.current.value = '';
  }

  render() {

    const terms = ['2188','2192','2194'];

    const offeringListClasses = classNames({
      'offering-list':true,
      'is-loading':this.props.loading.offerings
    });

    const filteredOfferingList = [];
    Object.keys(this.props.offerings).forEach(id => {
      const offering = this.props.offerings[id];
      // first check if they're in the selected term
      if (offering.term_code === this.state.selectedTerm) {
        // prepare a few things to make them better searchable by regex...
        const courseNumString = `LAWS ${offering.course_num}`;
        let instructorsString = '';
        for (let i = 0; i < offering.instructors.length; i++) {
          instructorsString += offering.instructors[i].first_name + ' ' + offering.instructors[i].last_name + ' ';
        }
        const regex = new RegExp(this.state.search, 'gi');
        if (offering.name.match(regex) || courseNumString.match(regex) || instructorsString.match(regex)) {
          filteredOfferingList.push(offering);
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
              <i className="far fa-search"></i>
              <input ref={this.searchRef} type='text' value={this.state.filter} onChange={(e) => this.handleSearchInput(e)} placeholder="Type to find class..." />
            </div>
            <div className="semester-dropdown-container">
              <p>Semester:</p>
              <select value={this.state.selectedTerm} onChange={(e) => this.handleTermChange(e)}>
                { terms.map(term =>
                  <option key={term} value={term}>{ helpers.termCodeToString(term) }</option>
                )}
              </select>
            </div>
          </div>
        </header>

        <ul>
          { filteredOfferingList.map(offering =>
            <li key={offering.id}>
              <Link to={`/offering/${offering.id}`}>
                <h4>{offering.name}</h4>
                <p><small>
                  LAWS {offering.course_num} &bull;&nbsp;
                  {offering.instructors.map((instructor, i) => i != 0 ? `, ${instructor.last_name}` : instructor.last_name )} &bull;&nbsp;
                  {helpers.termCodeToString(offering.term_code)}
                </small></p>
              </Link>
              <i className="far fa-chevron-right"></i>
            </li>
          )}
        </ul>

      </div>
    )
  }
}

OfferingList.propTypes = {
  loading: PropTypes.object.isRequired,
  offerings: PropTypes.object.isRequired,
  requestOfferings: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired
}