import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import Loading from '../../global/Loading'
import FlashCardsAllStudents from './containers/FlashCardsAllStudents'

export default class StudentList extends Component {
  render() {
    const { loading } = this.props

    const studentListClasses = classNames({
      'student-list':true,
      'is-loading': Object.keys(loading).some(loadingEntity => this.props.loading[loadingEntity] === true)
    })

    return (
      <div className={studentListClasses}>

        <Loading />

        <header>
          <h5>Create Flash Cards for All Students</h5>
        </header>

        <div className="content">
          <FlashCardsAllStudents />
        </div>

      </div>
    )
  }
}

StudentList.propTypes = {
  loading: PropTypes.object.isRequired
}