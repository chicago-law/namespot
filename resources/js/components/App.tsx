import React, { useEffect } from 'react'
import { connect } from 'react-redux'
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

const Container = styled('div')<{ isPrinting: boolean }>`
  position: relative;
  overflow: hidden;
  /* html2canvas doesn't like transitions */
  ${(props) => props.isPrinting && `
    * {
      transition: unset !important;
    }
  `}
`

interface StoreProps {
  authedUser: AuthedUserState;
  loading: LoadingState;
  printing: PrintingState;
  getAuthedUser: typeof getAuthedUser;
  reportScrollPos: typeof reportScrollPos;
  fetchSettings: typeof fetchSettings;
}

const App = ({
  authedUser,
  loading,
  printing,
  getAuthedUser,
  reportScrollPos,
  fetchSettings,
}: StoreProps & RouteComponentProps) => {
  const [debouncedScroll] = useDebouncedCallback(() => {
    reportScrollPos(window.pageYOffset)
  }, 50, { leading: true })

  useEffect(() => {
    getAuthedUser()
    fetchSettings()
    window.addEventListener('scroll', debouncedScroll)
    return () => window.removeEventListener('scroll', debouncedScroll)
  }, [])

  // Don't load the app until Settings and Authed User have come back from
  // the server.
  if (!('settings' in loading) || loading.settings || authedUser === null) {
    return <Loading />
  }

  return (
    <Container isPrinting={printing.isPrinting}>
      <SiteHeader />
      <MainContentRouter />
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

export default withRouter(connect(mapState, {
  getAuthedUser,
  reportScrollPos,
  fetchSettings,
})(App))
