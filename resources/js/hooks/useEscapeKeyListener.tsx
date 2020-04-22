import { useEffect } from 'react'

function useEscapeKeyListener(handler: Function) {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.which === 27) {
      handler(e)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })
}

export default useEscapeKeyListener
