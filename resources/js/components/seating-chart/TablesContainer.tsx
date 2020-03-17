import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import styled from '../../utils/styledComponents'
import { AppState } from '../../store'
import { Table } from '../../store/tables/types'
import SingleTable from './SingleTable'
import { setTask, selectTable, loadTempTable } from '../../store/session/actions'
import { SessionState } from '../../store/session/types'
import gridDimensions from '../../utils/gridDimensions'
import { validateTempTable } from '../../utils/validateTempTable'
import { Offering } from '../../store/offerings/types'

const Container = styled('svg')<{ editingRoom: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: visible;
  path {
    stroke-width: 15;
    stroke-linecap: round;
    stroke: ${(props) => (props.editingRoom ? props.theme.middleGray : props.theme.lightGray)};
    fill: none;
    transition: stroke 200ms ease-out, opacity 200ms ease-out;
    &.selected {
      stroke: ${(props) => props.theme.darkBlue};
    }
    &.not-selected {
      opacity: 0.35;
    }
    &:hover:not(.not-selected) {
      stroke: ${(props) => props.theme.blue};
      cursor: pointer;
    }
  }
  .is-being-temped {
    display: none;
  }
`

interface StoreProps {
  offering: Offering | null;
  session: SessionState;
  tables: {
    [key: string]: Table;
  };
  setTask: typeof setTask;
  selectTable: typeof selectTable;
  loadTempTable: typeof loadTempTable;
}
interface OwnProps {
  roomId: string;
  roomPxDimensions: {
    height: number;
    width: number;
  };
}
interface RouteParams {
  roomId?: string;
  offeringId?: string;
}
type Props = StoreProps & OwnProps & RouteComponentProps<RouteParams>

const TablesContainer = ({
  offering,
  session,
  tables,
  roomPxDimensions,
  match,
  setTask,
  selectTable,
  loadTempTable,
}: Props) => {
  const rowHeight = roomPxDimensions.height / gridDimensions.rows
  const columnWidth = roomPxDimensions.width / gridDimensions.columns
  const { tempTable } = session

  function handleTableClick(id: string) {
    if (session.task !== 'edit-table') {
      setTask('edit-table')
      selectTable(id)
      loadTempTable(tables[id])
    }
  }

  return (
    <Container
      xmlns="http://www.w3.org/2000/svg"
      // xlinkHref="http://www.w3.org/1999/xlink"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      id="tables-container"
      height="100%"
      width="100%"
      viewBox={`0 0 ${roomPxDimensions.width} ${roomPxDimensions.height}`}
      className="tables-container"
      editingRoom={!!match.params.roomId}
    >
      {Object.keys(tables).map((tableId) => (
        <SingleTable
          key={tableId}
          table={tables[tableId]}
          rowHeight={rowHeight}
          columnWidth={columnWidth}
          clickHandler={() => handleTableClick(tableId)}
          isBeingTemped={!!tempTable && tempTable.id === tableId}
        />
      ))}
      {/* We'll try and draw the temp table if required points are there */}
      {tempTable && !validateTempTable(tempTable).length && (
        <SingleTable
          table={tempTable as Table} // Coercing because used validateTempTable
          rowHeight={rowHeight}
          columnWidth={columnWidth}
          clickHandler={() => handleTableClick((tempTable && tempTable.id) || '')}
        />
      )}
    </Container>
  )
}

const mapState = ({
  offerings,
  session,
  tables,
}: AppState, {
  roomId,
  match,
}: OwnProps & RouteComponentProps<RouteParams>) => {
  const { offeringId } = match.params
  const offering = offeringId ? offerings[offeringId] : null
  return {
    offering,
    session,
    tables: tables[roomId] || {},
  }
}

export default withRouter(connect(mapState, {
  setTask, selectTable, loadTempTable,
})(React.memo(TablesContainer)))
