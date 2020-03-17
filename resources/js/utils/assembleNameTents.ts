import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Offering } from '../store/offerings/types'

const assembleNameTents = async (
  tents: HTMLDivElement[],
  offering: Offering,
  updateProgress: (progress: string) => void,
  callback?: () => void,
) => {
  // const [html2canvasModule, jsPdfModule] = await Promise.all([
  //   import('html2canvas'),
  //   import('jspdf'),
  // ])
  // const html2canvas = html2canvasModule.default
  // const jsPDF = jsPdfModule.default

  // We're going to loop through all the name tents and html2canvas and attach
  // to the pdf one by one. Except it's not really a loop, because that gets
  // troublesome with async operations, like html2canvas is. So we use a
  // recursive function instead.
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'in',
    format: 'letter',
  })

  let currentPage = 1
  let i = 0

  function addToPdf() {
    if (updateProgress) updateProgress(`${Math.floor((i / tents.length) * 100)}%`)

    // Normalize the HTML.
    tents[i].normalize()

    // Set pdf to current page.
    pdf.setPage(currentPage)

    html2canvas(tents[i], {
      logging: false,
      scale: 1,
    })
      .then((canvas) => {
        pdf.addImage(canvas, 'jpeg', 0, 0)

        // Increment tents and check if we need to go again.
        i += 1

        if (i < tents.length) {
          // increment our page counter and add another page
          currentPage += 1
          pdf.addPage()

          // Fire function again
          addToPdf()
        } else {
          // We're done! Save the file and mop up.
          const title = `Name Tents - ${offering.title}${offering.section ? ` ${offering.section}` : ''}`
          pdf.save(`${title}.pdf`)

          if (callback) callback()
        }
      })
  }
  addToPdf()
}

export default assembleNameTents
