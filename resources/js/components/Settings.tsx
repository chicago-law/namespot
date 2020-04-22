import React from 'react'
import { connect, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from '../utils/styledComponents'
import { AppState } from '../store'
import { SettingsState } from '../store/settings/types'
import { setModal } from '../store/modal/actions'
import { ModalTypes } from '../store/modal/types'
import { EditTextInputModalData } from './modals/edit-text-input'
import { updateSettings } from '../store/settings/actions'
import { EditSelectModalData } from './modals/edit-select/EditSelect'
import { getYears } from '../utils/helpers'

const Container = styled('div')`
  max-width: 40em;
  margin: 5em auto;
  background: white;
  padding: 2em 0;
  box-shadow: ${props => props.theme.boxShadow};
  h4 {
    text-align: center;
  }
  .setting-row {
    display: flex;
    padding: 0 2em 1em 2em;
    padding: 1em 2em;
    margin-bottom: 1em;
    border-bottom: 1px solid ${props => props.theme.lightGray};
    .left {
      padding-right: 1em;
      svg {
        font-size: ${props => props.theme.ms(2)};
        color: ${props => props.theme.darkGray};
      }
    }
    .right {
      h3 {
        margin: 0;
      }
      h2 {
        button {
          font-size: ${props => props.theme.ms(-1)};
          font-style: italic;
          color: ${props => props.theme.red};
        }
      }
    }
  }
`

interface Props {
  settings: SettingsState;
}

const Settings = ({ settings }: Props) => {
  const dispatch = useDispatch()

  function saveSetting(settingName: string, settingValue: string) {
    dispatch(updateSettings({ [settingName]: settingValue }))
  }

  function editSchoolName() {
    dispatch(setModal<EditTextInputModalData>(ModalTypes.editTextInput, {
      title: 'Edit School Name',
      p: 'The name of your school or institution.',
      previousValue: settings.school_name || '',
      onConfirm: (text: string) => saveSetting('school_name', text),
    }))
  }

  function editYear() {
    const options = getYears().map(year => ({
      value: `${year}`,
      label: `${year}-${year + 1}`,
    }))
    dispatch(setModal<EditSelectModalData>(ModalTypes.editSelect, {
      title: 'Edit Academic Year',
      options,
      p: 'Every night this site does a sync with the University\'s systems to keep student enrollment up-to-date. The academic year that is set here controls which terms it will sync.',
      previousValue: settings.academic_year || '',
      onConfirm: (text: string) => saveSetting('academic_year', text),
    }))
  }

  return (
    <Container>
      <h4>Namespot Settings</h4>
      <div className="setting-row">
        <div className="left">
          <FontAwesomeIcon icon={['far', 'university']} />
        </div>
        <div className="right">
          <h3>School Name</h3>
          <p>The name of your school or institution.</p>
          <h2>
            {settings.school_name || '(none)'}
            <button type="button" onClick={editSchoolName}>Edit</button>
          </h2>
        </div>
      </div>
      <div className="setting-row">
        <div className="left">
          <FontAwesomeIcon icon={['far', 'calendar-star']} />
        </div>
        <div className="right">
          <h3>Current Academic Year</h3>
          <p>Every night this site does a sync with the University's systems to keep itself up-to-date. The academic year that is set here controls which terms it will sync.</p>
          <p>Once a year, on August 1st at 12:00am, this will automatically set itself to the upcoming academic year. For example, on August 1st 2019, this will change to 2019-2020. Its previous setting doesn't matter; it will switch to the upcoming year regardless of what it was before.</p>
          <h2>
            {settings.academic_year && (
              <>
                {settings.academic_year}-{parseInt(settings.academic_year) + 1}
                <button type="button" onClick={editYear}>Edit</button>
              </>
            )}
          </h2>
        </div>
      </div>
    </Container>
  )
}

const mapState = ({ settings }: AppState) => ({
  settings,
})

export default connect(mapState)(Settings)
