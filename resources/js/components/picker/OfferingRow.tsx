import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AppState } from '../../store/index'
import { Offering } from '../../store/offerings/types'
import { parseDate } from '../../utils/helpers'
import { formatOfferingDetails } from '../../utils/formatOfferingDetails'

interface OwnProps {
  offeringId: string;
}
interface StoreProps {
  offering: Offering;
}

const OfferingRow = ({ offering }: OwnProps & StoreProps) => {
  const editedDate = offering.updated_at
    ? parseDate(offering.updated_at)
    : null

  return (
    <li>
      <Link to={`/offerings/${offering.id}`}>
        <h3>{offering.title}</h3>
        <p>{formatOfferingDetails(offering)}</p>
        {editedDate && (
          <span>Edited {editedDate.toLocaleDateString()}</span>
        )}
      </Link>
      <FontAwesomeIcon icon={['far', 'chevron-right']} />
    </li>
  )
}

const mapState = ({ offerings }: AppState, { offeringId }: OwnProps) => ({
  offering: offerings[offeringId],
})

export default connect(mapState)(OfferingRow)
