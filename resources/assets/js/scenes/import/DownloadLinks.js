import React, { Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import helpers from '../../bootstrap'

const DownloadLinks = ({ type }) => (
  <Fragment>
    <a
      href="#"
      className='download-links'
    >
      <FontAwesomeIcon icon={['far', 'arrow-alt-circle-down']} />
      Download template
    </a>
    <a
      href={`${helpers.rootUrl}api/export/${type}`}
      className='download-links'
      // target="_blank"
      // rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={['fal', 'table']} />
      Export all {type}
    </a>
  </Fragment>
)

export default DownloadLinks
