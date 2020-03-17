import React, { useEffect } from 'react'
import { TempTable } from '../../store/session/types'
import gridDimensions from '../../utils/gridDimensions'
import ActionBarButton from './ActionBarButton'

interface OwnProps {
  tempTable: TempTable | null;
  updateTempTable: Function;
}

const NudgeControls = ({
  tempTable, updateTempTable,
}: OwnProps) => {
  function handleNudge(direction: 'up' | 'down' | 'left' | 'right') {
    if (tempTable
      && tempTable.sX !== null
      && tempTable.sY !== null
      && tempTable.eX !== null
      && tempTable.eY !== null
    ) {
      let { sX, sY, eX, eY, qX, qY } = tempTable
      switch (direction) {
        case 'up': {
          if (sY > 0 && eY > 0 && (qY === null || qY > 0)) {
            sY -= 1
            eY -= 1
            if (qY !== null) qY -= 1
          }
          break
        }
        case 'down':
          if (sY < gridDimensions.rows && eY < gridDimensions.rows && (qY === null || qY < gridDimensions.rows)) {
            sY += 1
            eY += 1
            if (qY !== null) qY += 1
          }
          break
        case 'left':
          if (sX > 0 && eX > 0 && (qX === null || qX > 0)) {
            sX -= 1
            eX -= 1
            if (qX !== null) qX -= 1
          }
          break
        case 'right':
          if (sX < gridDimensions.columns && eX < gridDimensions.columns && (qX === null || qX < gridDimensions.columns)) {
            sX += 1
            eX += 1
            if (qX !== null) qX += 1
          }
          break
        default:
      }
      updateTempTable({ sX, sY, eX, eY, qX, qY })
    }
  }

  function keyNudgeListener(e: KeyboardEvent) {
    if (e.which === 37) {
      e.preventDefault()
      handleNudge('left')
    }
    if (e.which === 38) {
      e.preventDefault()
      handleNudge('up')
    }
    if (e.which === 39) {
      e.preventDefault()
      handleNudge('right')
    }
    if (e.which === 40) {
      e.preventDefault()
      handleNudge('down')
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', keyNudgeListener)
    return () => window.removeEventListener('keydown', keyNudgeListener)
  })

  return (
    <>
      <ActionBarButton
        text={<>Nudge<br />Up</>}
        icon={['far', 'long-arrow-up']}
        handler={() => handleNudge('up')}
      />
      <ActionBarButton
        text={<>Nudge<br />Down</>}
        icon={['far', 'long-arrow-down']}
        handler={() => handleNudge('down')}
      />
      <ActionBarButton
        text={<>Nudge<br />Left</>}
        icon={['far', 'long-arrow-left']}
        handler={() => handleNudge('left')}
      />
      <ActionBarButton
        text={<>Nudge<br />Right</>}
        icon={['far', 'long-arrow-right']}
        handler={() => handleNudge('right')}
      />
    </>
  )
}

export default NudgeControls
