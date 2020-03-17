import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AppState } from '../../store/index'
import { Offering } from '../../store/offerings/types'
import Loading from '../Loading'
import { formatOfferingDetails } from '../../utils/formatOfferingDetails'
import IconButton from '../IconButton'
import { setModal } from '../../store/modal/actions'
import { ModalTypes } from '../../store/modal/types'
import { EditOfferingModalData } from '../modals/edit-offering'

interface StoreProps {
  offering: Offering;
  setModal: typeof setModal;
}

const EditOfferingTitles = ({
  offering,
  setModal,
}: StoreProps & RouteComponentProps<{ offeringId: string }>) => {
  if (!offering) {
    return <Loading height={1} />
  }

  function handleEdit() {
    const { id, title, term_code, catalog_nbr, section } = offering
    setModal<EditOfferingModalData>(ModalTypes.editOffering, {
      offeringId: id,
      title,
      term_code,
      catalog_nbr,
      section,
    })
  }

  return (
    <>
      <div className="icon-container">
        <FontAwesomeIcon icon={['far', 'map']} />
      </div>
      <div>
        <h2>{offering.title}</h2>
        <p>{formatOfferingDetails(offering)}</p>
      </div>
      {offering.manually_created_by && (
        <div style={{ marginLeft: '1em' }}>
          <IconButton
            icon={['far', 'pencil']}
            handler={handleEdit}
          />
        </div>
      )}
    </>
  )
}

const mapState = ({
  offerings,
}: AppState, { match }: RouteComponentProps<{ offeringId: string }>) => ({
  offering: offerings[match.params.offeringId],
})

export default connect(mapState, {
  setModal,
})(EditOfferingTitles)
