import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Offering } from '../store/offerings/types'
import { termCodeToString } from './helpers'
import C from './constants'

const assembleFlashCards = async (
  cards: HTMLDivElement[],
  offering: Offering,
  namesOnReverse: boolean,
  updateProgress?: (progress: string) => void,
  callback?: () => void,
) => {
  const pdf = new jsPDF({
    format: 'letter',
    unit: 'in',
  })

  // Number of cards per page of the PDF.
  const perPage = 3

  // The page that we're on.
  let currentPage = 1

  // Counter for all the flash cards. Keep in mind that if we're doing
  // names on reverse, then both the front and the back count as a flash card.
  let i = 0

  // The position on the page of the of the current flash card. If it's
  // three cards to page, then the top card is 0, the next will be 1,
  // and then 2.
  let pagePos = 0

  if (namesOnReverse) {
    // add another page for the names, since pics are first page
    pdf.addPage()
    // switch back to first page
    pdf.setPage(1)
  }

  function addToPdf() {
    if (updateProgress) updateProgress(`${Math.floor((i / cards.length) * 100)}%`)

    let even = false

    if (i % 2 === 0) {
      even = true
    }

    // Turn multiple adjacent text nodes into one text one, because they confuse
    // html2canvas in Safari.
    cards[i].normalize()

    html2canvas(cards[i], {
      logging: false,
      scale: 3,
    }).then((canvas) => {
      if (namesOnReverse) {
        // Add to PDF with names on reverse.
        // If the counter is even, then add face pic to current
        // If it's odd, then we have a name, so add it to current + 1
        if (even) {
          pdf.setPage(currentPage)
          // Formatted for Avery Template #5388:
          // left margin of 1.75 in, top margin of 1 inch plus position in page x 3 in.
          pdf.addImage(canvas, 'jpeg', 1.75, ((pagePos * 3) + 1), C.cardWidth, C.cardHeight)
        } else {
          pdf.setPage(currentPage + 1)
          pdf.addImage(canvas, 'jpeg', 1.75, ((pagePos * 3) + 1), C.cardWidth, C.cardHeight)

          // Increment pagePos every other one (aka only on the odds),
          // because we're effectively doing sets of six instead of three
          // (Subtract 1 because pagePos is zero-based, perPage isn't)
          if (pagePos === perPage - 1) {
            pagePos = 0
          } else {
            pagePos += 1
          }
        }
      } else { // Add to PDF for names on same side
        pdf.setPage(currentPage)
        pdf.addImage(canvas, 'jpeg', 1.75, ((pagePos * 3) + 1), C.cardWidth, C.cardHeight)

        if (pagePos === perPage - 1) {
          pagePos = 0
        } else {
          pagePos += 1
        }
      }

      // We do a recursive, manual loop so we only go as fast as the canvases are created
      // increment the count and then check if we need to run the function again.

      // Increment i and check if we need to go again.
      i += 1
      if (i < cards.length) {
        // Yes, we need to go again, but first we need to check if more pages
        // are needed. How we do this depends on namesOnReverse.

        if (namesOnReverse) {
          if (i % (perPage * 2) === 0) {
            currentPage += 2
            pdf.addPage()
            pdf.addPage()
            pdf.setPage(currentPage)
          }
        } else if (i % perPage === 0) {
          currentPage += 1
          pdf.addPage()
          pdf.setPage(currentPage)
        }

        // Fire function again
        // setTimeout(() => {
        addToPdf()
        // }, 100)
      } else {
        // We're done! Save the file and mop up.
        const title = offering.title
          ? `Flash Cards - ${offering.title}${offering.section ? ` ${offering.section}` : ''}`
          : `Flash Cards - Student Body${offering.term_code ? ` ${termCodeToString(offering.term_code)}` : ''}`
        pdf.save(`${title}.pdf`)

        if (callback) callback()
      }
    })
  }

  // Start!
  addToPdf()
}

export default assembleFlashCards
