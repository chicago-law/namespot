import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalHeader from '../ModalHeader'
import ModalControls from '../ModalControls'
import styled from '../../../utils/styledComponents'
import { getTermCodeRange, termCodeToString, guessCurrentTerm } from '../../../utils/helpers'
import { createOffering, updateOffering, deleteOffering } from '../../../store/offerings/actions'
import { dismissModal } from '../../../store/modal/actions'
import useRecentOfferings from '../../../hooks/useRecentOfferings'
import { AppState } from '../../../store'
import { OfferingsState } from '../../../store/offerings/types'

const Content = styled('div')`
  position: relative;
  h5 {
    margin-bottom: 0.25em;
  }
  input {
    width: 20em;
  }
  .required {
    :after {
      content: ' *';
      color: ${(props) => props.theme.red};
    }
  }
  .delete-container {
    position: absolute;
    top: 0;
    right: 0;
    display: inline-block;
    padding: 0.85em 1em 0.65em 1em;
    background: ${(props) => props.theme.lightGray};
    button {
      display: inline-flex;
      align-items: center;
      color: ${(props) => props.theme.red};
      font-size: ${(props) => props.theme.ms(-1)};
      svg {
        margin-right: 0.5em;
        font-size: ${(props) => props.theme.ms(1)};
      }
    }
  }
`

export interface EditOfferingModalData {
  offeringId?: string;
  title?: string;
  term_code?: number;
  catalog_nbr?: string | null;
  section?: string | null;
}
interface StoreProps {
  offerings: OfferingsState;
  updateOffering: typeof updateOffering;
  createOffering: typeof createOffering;
  deleteOffering: typeof deleteOffering;
  dismissModal: typeof dismissModal;
}
interface OwnProps {
  modalData: EditOfferingModalData;
}

const EditOffering: React.FC<StoreProps & OwnProps & RouteComponentProps> = ({
  offerings,
  updateOffering,
  createOffering,
  deleteOffering,
  dismissModal,
  modalData,
  history,
}) => {
  const { offeringId } = modalData
  const offering = offeringId ? offerings[offeringId] || null : null
  const [title, setTitle] = useState(modalData.title || '')
  const [term_code, setTerm] = useState(modalData.term_code || guessCurrentTerm())
  const [catalog_nbr, setCatalog] = useState(modalData.catalog_nbr || '')
  const [section, setSection] = useState(modalData.section || '')
  const [isLoading, setIsLoading] = useState(false)
  const termList = useMemo(() => getTermCodeRange(), [])
  const [, addRecentOffering, removeRecentOffering] = useRecentOfferings()

  function handleConfirm() {
    // Update an offering.
    if (offeringId && offering && title && term_code) {
      updateOffering(offeringId, {
        title,
        term_code,
        catalog_nbr,
        section,
      }, true, (offering) => {
        // We also need to update our entry for this offering in local storage.
        addRecentOffering(offering)
      })
      dismissModal()
    } else {
      // Make a new offering.
      setIsLoading(true)
      createOffering({
        title,
        catalog_nbr,
        section,
        term_code,
      }, (offeringId: string) => {
        dismissModal()
        setIsLoading(false)
        history.push(`/offerings/${offeringId}`)
      })
    }
  }

  function handleDelete(offeringId: string) {
    deleteOffering(offeringId)
    removeRecentOffering(offeringId)
    history.push('/offerings')
  }

  return (
    <>
      <ModalHeader title={offeringId ? 'Edit Custom Class' : 'New Custom Class'} />

      <Content>
        <>
          <label htmlFor="title">
            <h5 className="required">Title</h5>
            <input
              id="title"
              type="text"
              value={title}
              placeholder="Title..."
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label htmlFor="term">
            <h5 className="required">Term</h5>
            <select
              id="term"
              value={term_code}
              onChange={(e) => setTerm(parseInt(e.target.value))}
            >
              {termList.map((term) => (
                <option key={term} value={term}>{termCodeToString(term)}</option>
              ))}
            </select>
          </label>
          <label htmlFor="catalog">
            <h5>Catalog Number</h5>
            <input
              id="catalog"
              type="text"
              value={catalog_nbr}
              placeholder="Catalog number (optional)..."
              onChange={(e) => setCatalog(e.target.value)}
            />
          </label>
          <label htmlFor="section">
            <h5>Section</h5>
            <input
              id="section"
              type="text"
              value={section}
              placeholder="Section number (optional)..."
              onChange={(e) => setSection(e.target.value)}
            />
          </label>
          {offeringId && (
            <div className="delete-container">
              <button type="button" onClick={() => handleDelete(offeringId)}>
                <FontAwesomeIcon icon={['far', 'trash-alt']} /> Permanently delete this class?
              </button>
            </div>
          )}
        </>
      </Content>

      <ModalControls
        confirmText={offeringId ? 'Save' : 'Create'}
        handleConfirm={handleConfirm}
        confirmDisabled={!title || !term_code}
        deferDismissal
        showLoading={isLoading}
      />
    </>
  )
}

const mapState = ({ offerings }: AppState) => ({
  offerings,
})

export default withRouter(connect(mapState, {
  updateOffering,
  createOffering,
  deleteOffering,
  dismissModal,
})(EditOffering))
