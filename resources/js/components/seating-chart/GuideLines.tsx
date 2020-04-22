import React from 'react'
import styled from '../../utils/styledComponents'
import gridDimensions from '../../utils/gridDimensions'

const Container = styled('div')`
  position: absolute;
  top: 10px;
  right: 10px;
  bottom: 10px;
  left: 10px;
  overflow: hidden;
  .guide {
    position: absolute;
    top: 0;
    left: 0;
    background: ${(props) => props.theme.middleGray};
  }
  .column {
    height: 100%;
    width: 2px;
    transform: translateX(-1px);
  }
  .row {
    width: 100%;
    height: 2px;
    transform: translateY(1px);
  }
`

interface OwnProps {
  roomPxDimensions: {
    height: number;
    width: number;
  };
}

const GuideLines = ({ roomPxDimensions }: OwnProps) => {
  const verticalGuides = () => {
    const guideCount = 6
    const guides = []
    const guideWidth = gridDimensions.columns / guideCount
    for (let i = 1; i < guideCount; i += 1) {
      const left = (roomPxDimensions.width / gridDimensions.columns) * i * guideWidth
      guides.push(<div key={i} className="guide column" style={{ left: `${left}px` }} />)
    }
    return guides
  }

  const horizontalGuides = () => {
    const guideCount = 4
    const guides = []
    const guideWidth = gridDimensions.rows / guideCount
    for (let i = 1; i < guideCount; i += 1) {
      const top = (roomPxDimensions.height / gridDimensions.rows) * i * guideWidth
      guides.push(<div key={i} className="guide row" style={{ top: `${top}px` }} />)
    }
    return guides
  }

  return (
    <Container id="guide-lines-container">
      {verticalGuides()}
      {horizontalGuides()}
    </Container>
  )
}

export default GuideLines
