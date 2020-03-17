import React from 'react'
import { connect } from 'react-redux'
import styled from '../../utils/styledComponents'
import { Room } from '../../store/rooms/types'
import { AppState } from '../../store'
import { OfferingsState } from '../../store/offerings/types'
import { termCodeToString } from '../../utils/helpers'
import { SettingsState } from '../../store/settings/types'

const Container = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
  .left, .right {
    max-width: 50%;
  }
  .right {
    padding-left: 0.5em;
    text-align: right;
  }
  p {
    margin: 0;
  }
  h1 {
    position: absolute;
    top: 1em;
    left: 0;
    right: 0;
    text-align: center;
    margin: 0;
  }
`

interface StoreProps {
  room: Room;
  offerings: OfferingsState;
  settings: SettingsState;
}
interface OwnProps {
  roomId: string;
  offeringId?: string;
}

const PageHeader = ({
  room,
  offerings,
  offeringId,
  settings,
}: StoreProps & OwnProps) => {
  const offering = offeringId ? offerings[offeringId] : null

  function buildLeftText() {
    let text = room.name || '(Untitled Room)'
    if (settings.school_name) text += ` - ${settings.school_name}`
    if (offering) text += ` - ${termCodeToString(offering.term_code)}`
    return text
  }

  function buildRightText() {
    let text = ''
    if (offering) {
      if (offering.subject) text += `${offering.subject} `
      if (offering.catalog_nbr && offering.section) text += `${offering.catalog_nbr}-${offering.section} `
      text += offering.title
      if (offering.instructors.length) {
        text += ` - ${offering.instructors.map((inst) => inst.last_name).join(', ')}`
      }
    }
    return text
  }

  return (
    <Container>
      <div className="left">
        <p>{buildLeftText()}</p>
      </div>
      {offering && !!offering.flipped && (
        <h1>FRONT</h1>
      )}
      <div className="right">
        <p>{buildRightText()}</p>
      </div>
    </Container>
  )
}

const mapState = ({ rooms, offerings, settings }: AppState, { roomId }: OwnProps) => ({
  room: rooms[roomId],
  offerings,
  settings,
})

export default connect(mapState)(PageHeader)
