import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import helpers from '../../bootstrap'

const CatalogPrefix = ({ catalogPrefix, onChange }) => (
  <div className='form-question'>
    <div className='setting-icon'>
      <FontAwesomeIcon icon={['far', 'book-open']} />
    </div>
    <div className='setting'>
      <h4>Catalog Prefix</h4>
      <p>Always shown in front of an offering's catalog number. For example, if this is set to 'LAWS', then an offering with a catalog number of 45362 will display as 'LAWS 45362'.</p>
      <input type='text' value={catalogPrefix} onChange={(e) => onChange(e.target.value)} placeholder='Your catalog prefix...' />
    </div>
  </div>
)

export default CatalogPrefix
