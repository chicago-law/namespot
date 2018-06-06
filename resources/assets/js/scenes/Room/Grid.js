import React from 'react'
import classNames from 'classnames/bind';

const Grid = ({ gridRows, gridColumns, gridRowHeight, gridColumnWidth, pointSelection, currentTables, tempTable, savePointToTempTable }) => {

  function handleBlipClick(e) {
    if (pointSelection) { // only proceed if we're choosing a blip
      const pointType = pointSelection;
      const pointKey = e.target.getAttribute('id');
      if (isBlipActive(pointKey, tempTable)) {
        console.log('blip was already active');
        console.log(pointKey, pointType);
        savePointToTempTable(null, pointType)
      } else {
        savePointToTempTable(pointKey, pointType)
      }
    }
  }

  function isBlipActive(pointKey, tempTable) {
    // is this point's key the same as either the start, end, or curve property of tempTable?
    if (tempTable.coords) {
      for (let coordType in tempTable.coords) {
        if (tempTable.coords.hasOwnProperty(coordType)) {
          if (tempTable.coords[coordType] === pointKey) {
            return coordType;
          }
        }
      }
    }
  }

  function doesBlipBelongToAnyTable(blipKey, tables) {
    // check if this blip is a part of any of the room's tables
    let included = false;
    for (let tableKey in tables) {
      for (let coordKey in tables[tableKey].coords) {
        if (tables[tableKey].coords[coordKey] === blipKey) {
          included = true;
        }
      }
    }
    return included;
  }

  function drawBlip(x, y) {
    const key = x + '_' + y;
    const blipClasses = classNames({
      'blip': true,
      'belongs-to-any-table': doesBlipBelongToAnyTable(key, currentTables),
      'belongs-to-active-table': isBlipActive(key, tempTable),
      'is-being-replaced': isBlipActive(key, tempTable) === pointSelection ? true : false
    });
    const cx = (x * gridColumnWidth).toFixed(2) + 'px';
    const cy = (y * gridRowHeight).toFixed(2) + 'px';
    const blip = <circle
      key={key}
      id={key}
      className={blipClasses}
      onClick={(e) => handleBlipClick(e)}
      r='5'
      cx={cx} cy={cy}
      x={x} y={y}
      style={{ transformOrigin: `${cx} ${cy}` }}
    />
    return blip;
  }

  function makeBlipGrid() {
    let blips = [];
    for (let i = 0; i < gridColumns; i++) {
      for (let j = 0; j < gridRows; j++) {
        blips.push(drawBlip(i, j));
      }
    }
    return blips;
  }

  const grid = makeBlipGrid();

  return (
    <g className='grid'>
      { grid }
    </g>
  );
}

export default Grid;