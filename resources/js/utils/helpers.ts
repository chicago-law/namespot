/**
 * Guesses the current quarter based on the date. Note that we're just
 * hard-coding some approximations for when the terms start and end because
 * they change a little each year. Feel free to tweak these dates.
 */
export const guessCurrentTerm = (): number => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const beginSpring = new Date(`March 1, ${currentYear}`)
  const beginAutumn = new Date(`August 15, ${currentYear}`)
  const beginWinter = new Date(`December 1, ${currentYear}`)
  const yearAbbrev = currentYear.toString().substr(-2)

  // Note:

  // Winter
  if (now < beginSpring) {
    return parseInt(`2${yearAbbrev}2`)
  }
  // Spring
  if (now < beginAutumn) {
    return parseInt(`2${yearAbbrev}4`)
  }
  // Autumn Quarter
  if (now < beginWinter) {
    return parseInt(`2${yearAbbrev}8`)
  }
  // Winter of next year
  return parseInt(`2${yearAbbrev + 1}2`)
}

/**
 * Takes a term code and returns a human readable term and year.
 */
export const termCodeToString = (termCode: number | string): string => {
  const tc = termCode.toString()
  const year = tc.substr(-3, 2)
  const quarter = tc.substr(-1)
  switch (quarter) {
    case '2':
      return `Winter 20${year}`
    case '4':
      return `Spring 20${year}`
    case '6':
      return `Summer 20${year}`
    case '8':
      return `Autumn 20${year}`
    default:
      return 'Error parsing term code'
  }
}

/**
 * Takes in a date string and parses it in a cross-browser way and returns a
 * Date object. *cough*Safari*cough*.
 */
export const parseDate = (dateString: string) => {
  if (!dateString) {
    return null
  }
  const chunks = dateString.split(/[^0-9]/) // Split on anything that is not 0-9
  const date = new Date(
    parseInt(chunks[0]),
    parseInt(chunks[1]) - 1,
    parseInt(chunks[2]),
    parseInt(chunks[3]),
    parseInt(chunks[4]),
    parseInt(chunks[5]),
  )

  return date
}

/**
 * Get term codes for a given academic year.
 */
export function getTermCodesFromYear(year: number) {
  const termCodes = []
  const year1 = year
  const year2 = year + 1

  // Concat together the term codes.
  termCodes.push(`2${year1.toString().substring(2)}8`) // Autumn
  termCodes.push(`2${year2.toString().substring(2)}4`) // Spring
  termCodes.push(`2${year2.toString().substring(2)}2`) // Winter

  // Return as numbers.
  return termCodes.map((code) => parseInt(code))
}

/**
 * Get an array of terms, starting from when Namespot launched through the
 * current term.
 */
export const getTermCodeRange = (
  startYear = 2017,
  endYear = new Date().getFullYear(),
) => {
  let termCodes: number[] = []

  for (let y = startYear; y <= endYear + 1; y += 1) {
    termCodes = [...termCodes, ...getTermCodesFromYear(y)]
  }

  return termCodes.sort()
}

/**
 * Look at the current date and create an array of past and future years.
 */
export const getYears = () => {
  const startYear = 2017
  const currentYear = new Date().getFullYear()
  const results = []

  for (let i = startYear; i < currentYear + 3; i += 1) {
    results.push(i)
  }

  return results
}
