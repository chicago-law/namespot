import { useEffect } from 'react'

/**
 * Like useEffect, but it will only ever fire just once!
 */
const useMountEffect = (callback: () => void, onReturn?: () => void) => {
  useEffect(() => {
    callback()
    return (() => {
      if (onReturn) onReturn()
    })
  }, []) // eslint-disable-line
}

export default useMountEffect
