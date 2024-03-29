import React from 'react'
import { connect, useDispatch } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'
import styled from '../utils/styledComponents'
import { getAuthedUser } from '../store/authedUser/actions'
import SiteHeader from './site-header'
import MainContentRouter from './MainContentRouter'
import Modals from './modals'
import { reportScrollPos } from '../store/session/actions'
import { AppState } from '../store'
import { PrintingState } from '../store/printing/types'
import PrintingCurtain from './PrintingCurtain'
import { fetchSettings } from '../store/settings/actions'
import { LoadingState } from '../store/loading/types'
import Loading from './Loading'
import { AuthedUserState } from '../store/authedUser/types'
import useMountEffect from '../hooks/useMountEffect'
import SiteFooter from './SiteFooter'

const Container = styled('div')<{ isPrinting: boolean }>`
  position: relative;
  min-width: 1000px;
  /* html2canvas doesn't like transitions */
  ${props => props.isPrinting && `
    overflow: hidden;
    * {
      transition: unset !important;
    }
  `}
`

interface StoreProps {
  authedUser: AuthedUserState;
  loading: LoadingState;
  printing: PrintingState;
}

const App = ({
  authedUser,
  loading,
  printing,
}: StoreProps & RouteComponentProps) => {
  const dispatch = useDispatch()
  const [debouncedScroll] = useDebouncedCallback(() => {
    dispatch(reportScrollPos(window.pageYOffset))
  }, 50, { leading: true })

  useMountEffect(() => {
    dispatch(getAuthedUser())
    dispatch(fetchSettings())
    window.addEventListener('scroll', debouncedScroll)
    return () => window.removeEventListener('scroll', debouncedScroll)
  })

  // Don't load the app until Settings and Authed User have come back from
  // the server.
  if (loading.settings || authedUser === null) {
    return <Loading />
  }

  return (
    <Container isPrinting={printing.isPrinting}>
      <SiteHeader />
      <MainContentRouter />
      <SiteFooter />
      <Modals />
      {printing.showCurtain && (
        <PrintingCurtain />
      )}
    </Container>
  )
}

const mapState = ({ authedUser, printing, loading }: AppState) => ({
  authedUser,
  loading,
  printing,
})

export default withRouter(connect(mapState)(App))
