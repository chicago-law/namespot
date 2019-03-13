import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const PrintableReady = () => (
  <div className="printable-ready">
    <p>Done! You can close this tab.</p>
    <FontAwesomeIcon icon={['fas', 'arrow-alt-to-bottom']} />
    <p>Your PDF should be downloading now. Look for it in your <strong>Downloads</strong> folder.</p>
  </div>
)

export default PrintableReady
