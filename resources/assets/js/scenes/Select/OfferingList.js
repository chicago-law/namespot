import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import Loading from '../../global/Loading';

export default class OfferingList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: ''
    }
  }

  componentDidMount() {
    this.props.requestOfferings(2188);
    this.props.setView('offering-list');
  }

  handleSearchInput(e) {
    this.setState({
      search: e.target.value
    });
  }


  render() {

    const offeringListClasses = classNames({
      'offering-list':true,
      'is-loading':this.props.loading.offerings
    });

    const filteredOfferingList = [];
    Object.keys(this.props.offerings).forEach(id => {
      const offering = this.props.offerings[id];
      // prepare a few things to make them better searchable by regex...
      const courseNumString = `LAWS ${offering.course_num}`;
      let instructorsString = '';
      for (let i=0;i<offering.instructors.length;i++) {
        instructorsString += offering.instructors[i].first_name + ' ' + offering.instructors[i].last_name + ' ';
      }
      const regex = new RegExp(this.state.search, 'gi');
      if (offering.name.match(regex)) {
        filteredOfferingList.push(offering);
        return false;
      }
      if (courseNumString.match(regex)) {
        filteredOfferingList.push(offering);
        return false;
      }
      if (instructorsString.match(regex)) {
        filteredOfferingList.push(offering);
        return false;
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
              <input type='text' value={this.state.filter} onChange={(e) => this.handleSearchInput(e)} placeholder="Type to filter..." />
            </div>
            <div className="semester-dropdown-container">
              <p>Semester:</p>
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
                  {offering.instructors.map((instructor, i) => i != 0 ? `, ${instructor.last_name}` : instructor.last_name )} &bull;
                  Spring 2018
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