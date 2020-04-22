import { useEffect } from 'react'

function useReturnKeyListener(handler: Function) {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.which === 13) {
      handler(e)
      e.stopPropagation()
      e.preventDefault()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })
}

export default useReturnKeyListener
