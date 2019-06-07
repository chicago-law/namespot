/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios')

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */

const token = document.head.querySelector('meta[name="csrf-token"]')

if (token) {
  window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content
} else {
  console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token')
}

/**
 * Globally-scoped custom helpers!
 */
const helpers = {

  // grab some essential data that we put into div#root as attributes
  rootUrl: document.getElementById('root').dataset.rootUrl,
  // rootUrl: 'http://192.170.208.196/',
  academicYear: parseInt(document.getElementById('root').dataset.academicYear),

  // Paper is rendered in the browser with dimensions set in inches
  // in CSS (and then doubled for resolution).
  // These are those inches measured in pixels.
  tabloidPxWidth: 3360,
  tabloidPxHeight: 2173,
  letterPxWidth: 2006,
  letterPxHeight: 1550,

  // takes in an AIS term code, returns a nice, human-friendly string
  termCodeToString(termCode) {
    if (termCode != null) {
      // year
      const year = `${termCode[0]}0${termCode[1]}${termCode[2]}`
      // quarter
      let quarter = ''
      switch (String(termCode[3])) {
        case '2':
          quarter = 'Winter'
          break
        case '4':
          quarter = 'Spring'
          break
        case '8':
          quarter = 'Autumn'
          break
        default:
          quarter = termCode[3]
      }
      return `${quarter} ${year}`
    }
    return ''
  },

  // Takes in the first half of an academic year and returns an array
  // of the three term codes for that year.
  termCodesFromYear(year) {
    const year1 = String(year)
    const year2 = String(parseInt(year) + 1)
    const results = []
    results.push(`2${year1.substring(2, 4)}8`) // autumn
    results.push(`2${year2.substring(2, 4)}2`) // winter
    results.push(`2${year2.substring(2, 4)}4`) // spring
    return results
  },

  /**
   * takes in a "years" object, and returns an array of all years that
   * should be in the purview of the app.
   *
   * The years object looks like this: (as defined in Store)
   *
   * years: {
   *  initialYear: (first year of recording keeping),
   *  academicYear: (first half of current academic year),
   *  futureYears: (how many years into future to also display in year list)
   * }
   */
  getAllYears(years) {
    // first, make a Set (array of unique values) of the years we want to get term codes for
    const yearList = new Set()

    // initial year
    yearList.add(years.initialYear)

    // all the years in between the initialYear and the current academic year
    const yearsBetween = years.academicYear - years.initialYear
    if (yearsBetween) {
      for (let i = 1; i <= yearsBetween; i++) {
        yearList.add(years.initialYear + i)
      }
    }

    // both years in the current academic year
    yearList.add(years.academicYear)
    yearList.add(years.academicYear + 1)

    // include future years past latter academic year
    for (let j = years.futureYears; j > 0; j--) {
      yearList.add(years.academicYear + 1 + j)
    }

    // return as a sorted array
    return [...yearList].sort()
  },

  /**
   * Takes in a years object (see above) and returns an array of term codes
   * generated from those years
   */
  getAllTermCodes(years) {
    // get all the applicable years from the "years" Store object
    const yearList = helpers.getAllYears(years)

    // now make terms from the years
    const terms = new Set()
    for (const year of yearList) {
      const currentTerms = helpers.termCodesFromYear(year)
      for (const term of currentTerms) {
        terms.add(term)
      }
    }

    // return as a sorted array
    return [...terms]
  },

  /**
   * Takes the academic level, as returned from AIS, and gives back a more
   * nicely formatted, human-readable string.
   */
  academicLevelToString(lvl) {
    switch (lvl) {
      case 'P1':
      case 'M1':
      case 'D01':
        return 'Year 1'
      case 'P2':
      case 'M2':
      case 'D02':
        return 'Year 2'
      case 'P3':
      case 'D03':
        return 'Year 3'
      case 'D04':
        return 'Year 4'
      case 'D05':
        return 'Year 5'
      case 'D06':
        return 'Year 6'
      case 'D07':
        return 'Year 7'
      case 'D08':
        return 'Year 8'
      case 'D09':
        return 'Year 9'
      default:
        return lvl
    }
  },

  formatAcademicProgram(prog) {
    if (prog != null) {
      switch (prog) {
        case 'LALLM':
          return 'LL.M.'
        case 'LAJD':
          return 'J.D.'
        case 'LAJSD':
          return 'J.S.D.'
        case 'LAMLS':
          return 'M.L.S'
        default:
          return prog
      }
    }
    return ''
  },

  findAncestor(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el
  },

  /**
   * Takes in a date string and parses on anything not 0-9 and returns a Date object.
   */
  parseDate(dateString) {
    if (!dateString) {
      return false
    }
    const chunks = dateString.split(/[^0-9]/) // Split on anything that is not 0-9
    const date = new Date(chunks[0], chunks[1] - 1, chunks[2], chunks[3], chunks[4], chunks[5])

    return date
  },

}

export default helpers
