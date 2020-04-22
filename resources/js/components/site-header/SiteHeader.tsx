import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
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
  border-bottom: 1px solid ${props => props.theme.lightGray};
  .SiteHeader__flex-row {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    padding: 0.5em 1em;
  }
`

const SiteHeader = () => {
  const dispatch = useDispatch()
  const header = useRef<HTMLDivElement>(null)

  function handleMeasuring() {
    if (header.current) {
      dispatch(measureElement(MeasuredElements.siteHeader, header.current))
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
        <Link to="/">
          <Logo />
        </Link>
      </div>
    </Container>
  )
}

export default SiteHeader
