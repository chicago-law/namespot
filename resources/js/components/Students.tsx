import React, { useState } from 'react'
import { connect } from 'react-redux'
import styled from '../utils/styledComponents'
import { AppState } from '../store'
import { termCodeToString, getTermCodeRange } from '../utils/helpers'
import TextButton from './TextButton'
import { initiatePrint } from '../store/printing/actions'
import { getStudentsForRoster } from '../store/students/actions'
import { PrintingState } from '../store/printing/types'
import Roster from './Roster'
import { LoadingState } from '../store/loading/types'
import { setLoadingStatus } from '../store/loading/actions'

const Container = styled('div')`
  max-width: 40em;
  margin: 5em auto;
  background: white;
  padding: 2em;
  box-shadow: ${(props) => props.theme.boxShadow};
  h4 {
    text-align: center;
  }
  select {
    margin-left: 0.5em;
  }
  ul li {
    margin-bottom: 1em;
  }
`

interface StoreProps {
  printing: PrintingState;
  loading: LoadingState;
  initiatePrint: typeof initiatePrint;
  getStudentsForRoster: typeof getStudentsForRoster;
  setLoadingStatus: typeof setLoadingStatus;
}

const Students = ({
  printing,
  loading,
  initiatePrint,
  getStudentsForRoster,
  setLoadingStatus,
}: StoreProps) => {
  const [plan, setPlan] = useState('')
  const [term, setTerm] = useState('')

  function handleDownload() {
    if (plan && term) {
      setLoadingStatus('students', true)
      getStudentsForRoster(plan, term, () => {
        setLoadingStatus('students', false)
        initiatePrint('roster', {
          academicPlan: plan,
          gradTerm: term,
        })
      })
    }
  }

  if (printing.isPrinting) {
    return (
      <Roster />
    )
  }

  return (
    <Container>
      <h4>Create Student Body Roster</h4>
      <ul>
        <li>
          <label htmlFor="academic-plan">
          Academic Plan
            <select
              id="academic-plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            >
              <option value="">- Select Plan -</option>
              {/* Values for plans come from AIS */}
              <option value="lajd">J.D.</option>
              <option value="lallm">LL.M.</option>
              <option value="lamls">M.L.S.</option>
              <option value="lajsd">J.S.D.</option>
            </select>
          </label>
        </li>
        <li>
          <label htmlFor="term">
            Expected Graduation Term
            <select
              id="term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            >
              <option value="">- Select Term -</option>
              {getTermCodeRange(undefined, new Date().getFullYear() + 4).map((code) => (
                <option key={code} value={code}>{termCodeToString(code)}</option>
              ))}
            </select>
          </label>
        </li>
      </ul>
      <TextButton
        text="Download"
        variant="red"
        clickHandler={handleDownload}
        loading={loading.students}
        disabled={!plan || !term || loading.students}
      />
    </Container>
  )
}

const mapState = ({ students, printing, loading }: AppState) => ({
  students,
  printing,
  loading,
})

export default connect(mapState, {
  initiatePrint,
  getStudentsForRoster,
  setLoadingStatus,
})(Students)
