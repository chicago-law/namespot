import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Offering } from '../store/offerings/types'

const assembleRoster = async (
  page: HTMLElement,
  elements: HTMLElement[],
  offering?: Offering | null,
  program?: string,
  updateProgress?: (progress: string) => void,
  callback?: () => void,
) => {
  // const [html2canvasModule, jsPdfModule] = await Promise.all([
  //   import('html2canvas'),
  //   import('jspdf'),
  // ])
  // const html2canvas = html2canvasModule.default
  // const jsPDF = jsPdfModule.default

  const pdf = new jsPDF({
    unit: 'in',
    format: 'letter',
  })

  // We need to figure out the conversion between pixels on our screen and inches.
  // It's probably 96 dppi, but we're going to do it here just in case. We know the
  // the page width is 8.5 in, so we'll get its computed styled here and figure out
  // the ratio that way.
  const pageWidthPx = parseFloat(getComputedStyle(page).getPropertyValue('width'))
  const conversion = pageWidthPx / 8.5
  function pxToInches(pxValue: number) {
    return pxValue / conversion
  }

  const pageHeight = 11
  const columnCount = 3
  const pagePadding = 0.5
  const columnWidth = (pxToInches(pageWidthPx) - pagePadding - pagePadding) / columnCount

  // Use these to track where we are as we loop through everything
  let i = 0
  let remainingSpace = pageHeight - pagePadding
  let currentPage = 1
  let currentColumn = 1

  function addToPdf() {
    if (updateProgress) updateProgress(`${Math.floor((i / elements.length) * 100)}%`)

    // Turn multiple adjacent text nodes into one text one, because they confuse
    // html2canvas in Safari.
    elements[i].normalize()

    // If we add the height of the element plus the page's bottom padding, is
    // it more than the remaining space?
    const elCSS = window.getComputedStyle(elements[i])
    const elHeight = pxToInches(parseFloat(elCSS.getPropertyValue('height')))
    if (elHeight + pagePadding < remainingSpace) {
      // It will fit! Proceed with adding to the PDF.
      html2canvas(elements[i], {
        scale: 4,
      }).then((canvas) => {
        pdf.addImage(
          canvas,
          'jpeg',
          // Distance from left edge of page.
          pagePadding + (columnWidth * (currentColumn - 1)),
          // Distance from top of page.
          pageHeight - remainingSpace,
          columnWidth,
          elHeight,
        )

        // K, element added. Now we need to subtract its height from remainingSpace
        remainingSpace -= elHeight

        // If there are more to go still, re-run the function the loop, otherwise Save.
        if (i < elements.length - 1) {
          i += 1
          addToPdf()
        } else { // We're done!!
          const title = offering
            ? `Roster - ${offering.title}${offering.section ? ` ${offering.section}` : ''}`
            : `Roster - ${program ? `${program} Student` : 'All Students'}`

          pdf.save(`${title}.pdf`)

          if (callback) callback()
        }
      })
    } else if (currentColumn === 1) {
      // Doesn't fit! But are we still only on the first column?
      // Switch to column 2, take us back to the top of the page, and try again.
      currentColumn = 2
      remainingSpace = pageHeight - pagePadding
      addToPdf()
    } else if (currentColumn === 2) {
      // Doesn't fit, and we've filled up column 2, so let's do three.
      // Switch to column 3
      currentColumn = 3
      remainingSpace = pageHeight - pagePadding
      addToPdf()
    } else {
      // Doesn't fit, and we've already filled all the columns. New page!
      // Okay, we'll add a new page and fully reset, and start again.
      pdf.addPage()
      currentPage += 1
      pdf.setPage(currentPage)
      remainingSpace = pageHeight - pagePadding
      currentColumn = 1
      addToPdf()
    }
  }

  // Start the whole shebang.
  addToPdf()
}

export default assembleRoster
