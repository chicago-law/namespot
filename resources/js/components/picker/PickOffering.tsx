import React, { useState, useEffect, useMemo, useRef } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getOfferingsByTerm } from '../../store/offerings/actions'
import { AppState } from '../../store/index'
import { OfferingsState } from '../../store/offerings/types'
import OfferingRow from './OfferingRow'
import { SessionState } from '../../store/session/types'
import { LoadingState } from '../../store/loading/types'
import Loading from '../Loading'
import styled from '../../utils/styledComponents'
import { getTermCodeRange, termCodeToString, guessCurrentTerm } from '../../utils/helpers'
import useLocalStorage from '../../hooks/useLocalStorage'
import SearchInputContainer from '../SearchInputContainer'
import { User } from '../../store/authedUser/types'
import { setModal } from '../../store/modal/actions'
import { ModalTypes } from '../../store/modal/types'
import { EditOfferingModalData } from '../modals/edit-offering'
import useRecentOfferings from '../../hooks/useRecentOfferings'

const Container = styled('div')`
  .instructor-message {
    padding: 1em;
    text-align: center;
    font-style: italic;
  }
  .filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1em;
    margin-bottom: 1em;
  }
  h5 {
    margin-left: 2.5em;
    margin-bottom: 0.5em;
    text-transform: uppercase;
    color: ${props => props.theme.middleGray};
  }
  .recent {
    margin: 0 2em 2em 2em;
    li {
      border: none;
      margin: 0.25em 0;
      a {
        display: inline-block;
        padding: 0;
        font-size: ${props => props.theme.ms(-1)};
        font-weight: bold;
        text-decoration: none;
      }
    }
  }
  .no-offerings-found {
    padding: 1em 0 0 2.1em;
    color: ${props => props.theme.middleGray};
    font-style: italic;
  }
`

interface Props {
  authedUser: User | null;
  offerings: OfferingsState;
  session: SessionState;
  loading: LoadingState;
}

const PickOffering = ({
  authedUser,
  offerings,
  session,
  loading,
}: Props) => {
  const dispatch = useDispatch()
  const searchQueryRef = useRef<HTMLInputElement>(null)
  const [term, setTerm] = useLocalStorage('namespot_term', guessCurrentTerm().toString())
  const [query, setQuery] = useState('')
  const [recentOfferings] = useRecentOfferings()

  useEffect(() => {
    if (searchQueryRef.current) searchQueryRef.current.focus()
  }, [])

  useEffect(() => {
    // Fetch the offerings for this term.
    if (!session.termOfferingsReceived.includes(parseInt(term))) {
      dispatch(getOfferingsByTerm(parseInt(term)))
    }
  }, [dispatch, session.termOfferingsReceived, term])

  function handleCreate() {
    dispatch(setModal<EditOfferingModalData>(ModalTypes.editOffering, {
      term_code: parseInt(term),
    }))
  }

  const termList = useMemo(() => getTermCodeRange(), [])

  const termOfferings = useMemo(() => (Object.values(offerings)
    .filter(offering => offering.term_code === parseInt(term))
    .sort((a, b) => (a.title.toUpperCase() > b.title.toUpperCase() ? 1 : -1))
  ), [term, offerings])

  const queriedOfferings = useMemo(() => (
    termOfferings.filter(offering => {
      const searchable = offering.title.toUpperCase()
      + offering.id
      + offering.catalog_nbr
      + (offering.subject ? `${offering.subject.toUpperCase()} ` : '')
      + offering.instructors
        .map(inst => `${inst.first_name.toUpperCase()} ${inst.last_name.toUpperCase()}`)
        .join('')
      return searchable.includes(query.toUpperCase())
    })
  ), [query, termOfferings])

  if (!authedUser) return <div />

  return (
    <Container>
      <h4>Select Class</h4>
      {authedUser.role === 'inst' && (
        <div className="instructor-message">
          <p>Showing classes taught by CNet ID: <strong>{authedUser.cnet_id}</strong></p>
        </div>
      )}
      <div className="filters">
        <SearchInputContainer>
          <input
            type="text"
            value={query}
            placeholder="Name, instructor, catalog number..."
            onChange={e => setQuery(e.target.value)}
            style={{ width: '19em' }}
            ref={searchQueryRef}
          />
        </SearchInputContainer>
        <select id="term" value={term} onChange={e => setTerm(e.target.value)}>
          {termList.map(term => (
            <option key={term} value={term}>
              {termCodeToString(term)}
            </option>
          ))}
        </select>
      </div>
      {recentOfferings.length > 0 && (
        <>
          <h5>RECENT</h5>
          <ul className="recent">
            {recentOfferings.map(offering => {
              if (offering) {
                return (
                  <li key={offering.id}>
                    <Link to={`offerings/${offering.id}`}>{offering.label}</Link>
                  </li>
                )
              }
              return false
            })}
          </ul>
        </>
      )}
      <ul>
        <li>
          <button type="button" onClick={handleCreate}>
            <h3><FontAwesomeIcon icon={['far', 'plus-circle']} style={{ marginRight: '0.5em' }} />Create New Class</h3>
          </button>
        </li>
        {loading.offerings && (
          <Loading />
        )}
        {queriedOfferings.map(offering => (
          <OfferingRow key={offering.id} offeringId={offering.id} />
        ))}
      </ul>
      {queriedOfferings.length === 0 && !loading.offerings && (
        <p className="no-offerings-found">
          No applicable classes found for {termCodeToString(term)}
          {query.length > 0 && (
            <> with query "{query}"</>
          )}
        </p>
      )}
    </Container>
  )
}

const mapState = ({
  authedUser,
  offerings,
  session,
  loading,
}: AppState) => ({
  authedUser,
  session,
  offerings,
  loading,
})

export default connect(mapState)(PickOffering)
