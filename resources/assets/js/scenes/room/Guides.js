import React from 'react'
import PropTypes from 'prop-types'

const Guides = ({ gridColumns, gridColumnWidth, gridRows, gridRowHeight }) => {

  function makeVertGuides() {
    let guides = []
    const intervals = 8
    for (let i = 1; i < intervals; i++) {
      const blipX = Math.floor(gridColumns * (1 / intervals * i)) * gridColumnWidth
      const guide = <path key={`v_${i}`} className='guide vert' d={`M${blipX} 0 L ${blipX} ${gridRows * gridRowHeight}`} />
      guides = [...guides, guide]
    }
    return guides
  }

  function makeHorizGuides() {
    let guides = []
    const intervals = 4
    for (let i = 1; i < intervals; i++) {
      const blipY = Math.floor(gridRows * (1 / intervals * i)) * gridRowHeight
      const guide = <path key={`h_${i}`} className='guide horiz' d={`M 0 ${blipY} L ${gridColumns * gridColumnWidth} ${blipY}`} />
      guides = [...guides, guide]
    }
    return guides
  }

  const vertGuides = makeVertGuides()
  const horizGuides = makeHorizGuides()

  return (
    <g>
      {vertGuides}
      {horizGuides}
    </g>
  )

}

export default Guides

Guides.propTypes = {
  gridColumnWidth: PropTypes.number,
  gridColumns: PropTypes.number,
  gridRowHeight: PropTypes.number,
  gridRows: PropTypes.number
}