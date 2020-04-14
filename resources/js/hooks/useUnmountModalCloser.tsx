import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { dismissModal } from '../store/modal/actions'

function useUnmountModalCloser() {
  const dispatch = useDispatch()

  useEffect(() => () => {
    dispatch(dismissModal())
  }, [dispatch])
}

export default useUnmountModalCloser
