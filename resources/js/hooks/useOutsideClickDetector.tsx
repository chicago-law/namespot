import { useEffect } from 'react'

function useOutsideClickDetector(
  containerRef: HTMLElement | null,
  handler: Function,
) {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const { target } = e
      if (containerRef && target && !containerRef.contains(target as Element)) {
        handler()
      }
    }

    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [containerRef, handler])
}

export default useOutsideClickDetector
