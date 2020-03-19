import React, { memo, useRef } from 'react'
import { connect } from 'react-redux'
import styled from '../../utils/styledComponents'
import Menu from './Menu'
import PageTitles from './PageTitles'
import Logo from './Logo'
import { measureElement } from '../../store/session/actions'
import { MeasuredElements } from '../../store/session/types'
import Errors from './Errors'
import useMountEffect from '../../hooks/useMountEffect'

const Container = styled('div')`
  position: relative;
  z-index: 10;
  background: white;
  border-bottom: 1px solid ${(props) => props.theme.lightGray};
  .SiteHeader__flex-row {
    padding: 0.5em 1em;
    display: flex;
    align-items: center;
  }
`

interface StoreProps {
  measureElement: typeof measureElement;
}

const SiteHeader = ({ measureElement }: StoreProps) => {
  const header = useRef<HTMLDivElement>(null)

  function handleMeasuring() {
    if (header.current) {
      measureElement(MeasuredElements.siteHeader, header.current)
    }
  }

  useMountEffect(() => {
    handleMeasuring()
    window.addEventListener('resize', handleMeasuring)
    return () => window.removeEventListener('resize', handleMeasuring)
  })

  return (
    <Container ref={header}>
      <Errors />
      <div className="SiteHeader__flex-row">
        <Menu />
        <PageTitles />
        <Logo />
      </div>
    </Container>
  )
}

export default memo(connect(null, {
  measureElement,
})(SiteHeader))
