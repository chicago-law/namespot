import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Offering } from '../store/offerings/types'
import C from './constants'

const assembleSeatingChart = async (
  chartPage: HTMLElement,
  offering?: Offering,
  callback?: () => void,
) => {
  const paperDimensions = offering && offering.paper_size && offering.paper_size === 'letter'
    ? {
      width: C.letterWidth,
      height: C.letterHeight,
    } : {
      width: C.tabloidWidth,
      height: C.tabloidHeight,
    }

  // Turn multiple adjacent text nodes into one text one, because they confuse
  // html2canvas in Safari.
  chartPage.normalize()

  // SVG dimensions must be explicitly declared to show up properly on printout.
  const tableSvg = document.getElementById('tables-container')
  if (tableSvg) {
    tableSvg.setAttribute('width', (tableSvg.parentNode as HTMLElement)?.offsetWidth.toString())
    tableSvg.setAttribute('height', (tableSvg.parentNode as HTMLElement)?.offsetHeight.toString())
  }

  html2canvas(chartPage, {
    logging: false,
    scale: 4, // Cranking up scale to increase clarity.
  })
    .then(canvas => {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: offering && offering.paper_size && offering.paper_size === 'letter'
          ? 'letter'
          : 'tabloid',
      })

      // Attach the canvas to the PDF.
      // We specify the height and width of the image because we blew it up
      // much bigger than normal by increasing the "scale" attribute earlier.
      // We'll shrink it back down now.
      const imgData = canvas.toDataURL('image/jpeg', 1.0)
      // const enlarged = changedpi.changeDpiDataUrl(imgData, 300)
      pdf.addImage(imgData, 'jpeg', 0, 0, paperDimensions.width, paperDimensions.height)
      const title = offering && offering.title
        ? `Seating Chart - ${offering.title}${offering.section ? ` ${offering.section}` : ''}`
        : 'Blank Chart'

      pdf.save(`${title}.pdf`)

      if (callback) callback()
    })
}

export default assembleSeatingChart
