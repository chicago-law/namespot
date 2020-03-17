import React from 'react'
import { connect } from 'react-redux'
import styled from '../utils/styledComponents'
import animateEntrance from '../utils/animateEntrance'
import Loading from './Loading'
import useScrollDisabler from '../hooks/useScrollDisabler'
import { AppState } from '../store'
import { PrintingState } from '../store/printing/types'

const Container = styled('div')`
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  z-index: 99999999;
  ${animateEntrance('fadeExpand')};
  .fa-arrow-to-bottom {
    font-size: ${(props) => props.theme.ms(5)};
  }
`

interface StoreProps {
  printing: PrintingState;
}

const PrintingCurtain = ({ printing }: StoreProps) => {
  useScrollDisabler()

  return (
    <Container>
      <Loading />
      <h1>Preparing file. Your download will begin shortly...</h1>
      <p>Processing... {printing.progress}</p>
      <p>Depending on the number of students in the class, this may take a minute.</p>
    </Container>
  )
}

const mapState = ({ printing }: AppState) => ({
  printing,
})

export default connect(mapState)(PrintingCurtain)
