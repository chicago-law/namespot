import { Offering } from '../store/offerings/types'
import { theme } from './theme'

const calcSeatFontSize = (offering: Offering | null) => {
  // Start with the standard size.
  let size = theme.ms(0)

  // Adjust for the offering's font size preference.
  if (offering && offering.font_size) {
    switch (offering.font_size) {
      case 'smaller':
        size = theme.ms(-1)
        break
      case 'larger':
        size = theme.ms(1)
        break
      case 'x-large':
        size = theme.ms(2)
        break
      case 'default':
      default:
    }
  }

  // If we're printing to a letter, shrink the size a bit.
  if (offering && offering.paper_size === 'letter') {
    size = `${parseFloat(size) * 0.65}px`
  }

  return size
}

export default calcSeatFontSize
