
window._ = require('lodash')
// window.Popper = require('popper.js').default;

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

// try {
  // window.$ = window.jQuery = require('jquery')

  // require('bootstrap');
// } catch (e) {}

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

let token = document.head.querySelector('meta[name="csrf-token"]')

if (token) {
  window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content
} else {
  console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token')
}

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo'

// window.Pusher = require('pusher-js');

// window.Echo = new Echo({
//   broadcaster: 'pusher',
//   key: process.env.MIX_PUSHER_APP_KEY,
//   cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//   encrypted: true
// });

/**
 * Globally-scoped custom helpers!
 */
const helpers = {

  // grab some essential data that we put into div#root as attributes
  'rootUrl': document.getElementById('root').dataset.rootUrl,
  'academicYear': parseInt(document.getElementById('root').dataset.academicYear),

  // when paper is rendered in the browser, these are the px dimensions
  // (and then doubled for greater resolution)
  'tabloidPxWidth': 3360,
  'tabloidPxHeight': 2173,
  // 'tabloidPxWidth': 3100,
  // 'tabloidPxHeight': 2000,
  'letterPxWidth': 2112,
  'letterPxHeight': 1632,

  // takes in an AIS term code, returns a nice, human-friendly string
  termCodeToString(termCode) {
    if (termCode != null) {
      // year
      const year = termCode[0] + '0' + termCode[1] + termCode[2]
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
  },

  // Takes in the first half of an academic year and returns an array
  // of the three term codes for that year.
  termCodesFromYear(year) {
    const year1 = String(year)
    const year2 = String(parseInt(year) + 1)
    const results = []
    results.push(`2${year1.substring(2,4)}8`) // autumn
    results.push(`2${year2.substring(2,4)}2`) // winter
    results.push(`2${year2.substring(2,4)}4`) // spring
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
      for (let i=1;i<=yearsBetween;i++) {
        yearList.add(years.initialYear + i)
      }
    }

    // both years in the current academic year
    yearList.add(years.academicYear)
    yearList.add(years.academicYear + 1)

    // include future years past latter academic year
    for (let j=years.futureYears;j>0;j--) {
      yearList.add(years.academicYear + 1 + j)
    }

    // return as a sorted array
    return [ ...yearList].sort()
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
    for (let year of yearList) {
      const currentTerms = helpers.termCodesFromYear(year)
      for (let term of currentTerms) {
        terms.add(term)
      }
    }

    // return as a sorted array
    return [ ...terms]
  }

}
export default helpers