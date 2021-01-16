import React, { useState, useMemo } from 'react'
import { connect, useDispatch } from 'react-redux'
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
import { OfferingsState, Offering } from '../../../store/offerings/types'
import TextButton from '../../TextButton'
import IconButton from '../../IconButton'

const Content = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr;
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
      color: ${props => props.theme.red};
    }
  }
  .delete-container {
    margin-top: 3rem;
    button {
      display: inline-flex;
      align-items: center;
      color: ${props => props.theme.red};
      font-size: ${props => props.theme.ms(-1)};
      svg {
        margin-right: 0.5em;
        font-size: ${props => props.theme.ms(1)};
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
  manual_instructor_cnets?: string[];
}
interface StoreProps {
  offerings: OfferingsState;
}
interface OwnProps {
  modalData: EditOfferingModalData;
}

const EditOffering: React.FC<StoreProps & OwnProps & RouteComponentProps> = ({
  offerings,
  modalData,
  history,
}) => {
  const dispatch = useDispatch()
  const { offeringId } = modalData
  const offering = offeringId ? offerings[offeringId] || null : null
  const [title, setTitle] = useState(modalData.title || '')
  const [term_code, setTerm] = useState(modalData.term_code || guessCurrentTerm())
  const [catalog_nbr, setCatalog] = useState(modalData.catalog_nbr || '')
  const [section, setSection] = useState(modalData.section || '')
  const [instructors, setInstructors] = useState([...(modalData.manual_instructor_cnets ?? []), ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const termList = useMemo(() => getTermCodeRange(), [])
  const [, addRecentOffering, removeRecentOffering] = useRecentOfferings()

  function handleAddCnetRow() {
    setInstructors(prev => [...prev, ''])
  }

  function handleRemoveCnetRow(indexToRemove: number) {
    setInstructors(prev => prev.filter((inst, i) => i !== indexToRemove))
  }

  function handleInstructorCNetIdChange(e: React.ChangeEvent<HTMLInputElement>, indexToChange: number) {
    const { value } = e.target

    const newInstructors = instructors.map((inst, i) => (i === indexToChange ? value : inst))
    setInstructors(newInstructors)
  }

  function handleConfirm() {
    // Filter out the empty strings. May just be an empty array.
    const manual_instructor_cnets = instructors.filter(inst => !!inst)

    // Update an offering.
    if (offeringId && offering && title && term_code) {
      dispatch(updateOffering(offeringId, {
        title,
        term_code,
        catalog_nbr,
        section,
        manual_instructor_cnets,
      }, true, (offering: Offering) => {
        // We also need to update our entry for this offering in local storage.
        addRecentOffering(offering)
      }))
      dispatch(dismissModal())
    } else {
      // Make a new offering.
      setIsLoading(true)
      dispatch(createOffering({
        title,
        catalog_nbr,
        section,
        term_code,
        manual_instructor_cnets,
      }, (offeringId: string) => {
        dispatch(dismissModal())
        setIsLoading(false)
        history.push(`/offerings/${offeringId}`)
      }))
    }
  }

  function handleDeleteRequest() {
    setIsConfirmingDelete(true)
  }

  function handleDelete(offeringId: string) {
    dispatch(deleteOffering(offeringId))
    removeRecentOffering(offeringId)
    history.replace('/offerings')
  }

  return (
    <>
      <ModalHeader title={offeringId ? 'Edit Custom Class' : 'New Custom Class'} />

      <Content>
        <div>
          <label htmlFor="title">
            <h5 className="required">Title</h5>
            <input
              id="title"
              type="text"
              value={title}
              placeholder="Title..."
              onChange={e => setTitle(e.target.value)}
            />
          </label>
          <label htmlFor="term">
            <h5 className="required">Term</h5>
            <select
              id="term"
              value={term_code}
              onChange={e => setTerm(parseInt(e.target.value))}
            >
              {termList.map(term => (
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
              onChange={e => setCatalog(e.target.value)}
            />
          </label>
          <label htmlFor="section">
            <h5>Section</h5>
            <input
              id="section"
              type="text"
              value={section}
              placeholder="Section number (optional)..."
              onChange={e => setSection(e.target.value)}
            />
          </label>
        </div>
        <div>
          <h5>Instructor CNet IDs</h5>
          <p><small>Add the CNet IDs (including possible aliases) of any instructors who should have access to this class in Namespot.</small></p>
          {instructors.map((inst, i) => (
            <div key={i}>
              <input type="text" value={inst} onChange={e => handleInstructorCNetIdChange(e, i)} />
              {instructors.length > 1 && (
                <IconButton icon={['far', 'times']} handler={() => handleRemoveCnetRow(i)} />
              )}
            </div>
          ))}
          <TextButton
            leftIcon={['far', 'plus-circle']}
            text="Add another CNet"
            clickHandler={handleAddCnetRow}
            variant="clear"
            style={{ marginTop: '1rem' }}
          />
          {offeringId && (
            <div className="delete-container">
              {!isConfirmingDelete && (
                <button
                  type="button"
                  onClick={handleDeleteRequest}
                >
                  <FontAwesomeIcon icon={['far', 'trash-alt']} /> Delete this class
                </button>
              )}
              {isConfirmingDelete && (
                <button
                  type="button"
                  onClick={() => handleDelete(offeringId)}
                >
                  <FontAwesomeIcon icon={['far', 'trash-alt']} /> <strong>Confirm: Permanently delete this class?</strong>
                </button>
              )}
            </div>
          )}
        </div>
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

export default withRouter(connect(mapState)(EditOffering))
