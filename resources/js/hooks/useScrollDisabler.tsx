import { useEffect } from 'react'

const useScrollDisabler = () => {
  useEffect(() => {
    /* Do our best to prevent the user from scrolling, without using overflow: hidden. */

    // Scroll ya to the top and lock ya there.
    window.scrollTo(0, 0)

    // left: 37, up: 38, right: 39, down: 40,
    // space bar: 32, page up: 33, page down: 34, end: 35, home: 36
    const keys = [37, 38, 39, 40, 32, 33, 34, 35, 36]

    function preventDefault(e: Event) {
      const event = e || window.event
      if (event.preventDefault) event.preventDefault()
      event.returnValue = false
    }

    function preventDefaultForScrollKeys(e: KeyboardEvent) {
      if (keys.includes(e.keyCode)) {
        preventDefault(e)
        return false
      }
      return true
    }

    function disableScroll() {
      if (window.addEventListener) window.addEventListener('DOMMouseScroll', preventDefault, false)
      document.addEventListener('wheel', preventDefault, { passive: false })
      document.addEventListener('scroll', preventDefault, { passive: false })
      window.onwheel = preventDefault // modern standard
      window.ontouchmove = preventDefault // mobile
      document.onkeydown = preventDefaultForScrollKeys
    }

    function enableScroll() {
      if (window.removeEventListener) { window.removeEventListener('DOMMouseScroll', preventDefault, false) }
      document.removeEventListener('wheel', preventDefault) // Enable scrolling in Chrome
      document.removeEventListener('scroll', preventDefault) // Enable scrolling in Chrome
      window.onwheel = null
      window.ontouchmove = null
      document.onkeydown = null
    }

    disableScroll()
    return () => {
      enableScroll()
      window.onscroll = null
    }
  }, [])
}

export default useScrollDisabler
