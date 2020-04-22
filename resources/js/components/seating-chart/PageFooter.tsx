import React from 'react'
import styled from '../../utils/styledComponents'
import { PrintingState } from '../../store/printing/types'

const Container = styled('div')`
  position: relative;
  text-align: center;
  h1 {
    margin: 0;
  }
  .timestamp {
    position: absolute;
    right: 0;
    bottom: 0;
    font-style: italic;
  }
`

interface OwnProps {
  printing: PrintingState;
  flipped: boolean;
}

const PageFooter = ({ printing, flipped }: OwnProps) => (
  <Container>
    <h1>
      {!flipped
        ? 'FRONT'
        : <>&nbsp;</>}
    </h1>
    {printing.isPrinting && (
      <span className="timestamp">{`Printed ${new Date().toLocaleDateString()}`}</span>
    )}
  </Container>
)

export default PageFooter
