import React from 'react'
import { useSelector } from 'react-redux'
import { AppState } from '../../store'
import SidebarToolTip from './SidebarToolTip'

const RoomSidebarLeft = () => {
  const session = useSelector((state: AppState) => state.session)
  const { task, choosingPoint } = session

  return (
    <div style={{ paddingRight: '1.5em' }}>
      {task === null && choosingPoint === null && (
        <SidebarToolTip
          heading="Select Table Section"
          text={[
            'Click a table section in the seating chart to add/remove seats or change its location.',
            'You can also create a new section by clicking the New Table button above.',
          ]}
        />
      )}
      {task === 'edit-table' && (
        <SidebarToolTip
          heading="Edit Table Section"
          text={[
            'Use the controls above to change the number of seats at a table section or adjust its location.',
            'You can lengthen, shorten, and move the table around the room.',
          ]}
        />
      )}
      {choosingPoint === 'start' && (
        <SidebarToolTip
          heading="Start Point"
          text={[
            <>Click the grid dot where this section of seats should start. Both a <strong>start point</strong> and an <strong>end point</strong> are required.</>,
            'Use the controls above to change which point you\'re currently choosing.',
          ]}
        />
      )}
      {choosingPoint === 'curve' && (
        <SidebarToolTip
          heading="Curve Point"
          text={[
            'Click the grid dot where this section of seats should bend towards. This point is optional.',
            'Use the controls above to change which point you\'re currently choosing.',
          ]}
        />
      )}
      {choosingPoint === 'end' && (
        <SidebarToolTip
          heading="End Point"
          text={[
            <>Click the grid dot where this section of seats should end. Both a <strong>start point</strong> and an <strong>end point</strong> are required.</>,
            'Use the controls above to change which point you\'re currently choosing.',
          ]}
        />
      )}
    </div>
  )
}


export default RoomSidebarLeft
