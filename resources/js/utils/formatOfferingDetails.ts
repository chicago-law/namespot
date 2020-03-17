import { termCodeToString } from './helpers'
import { Offering } from '../store/offerings/types'

/**
 * Return a nicely formatted string of Offering details.
 */
export const formatOfferingDetails = (offering: Offering) => {
  let result = ''
  if (offering.manually_created_by) result += 'Custom Class • '
  if (offering.subject) result += `${offering.subject} `
  if (offering.section) {
    result += `${offering.catalog_nbr}-${offering.section} • `
  } else if (offering.catalog_nbr) {
    result += `${offering.catalog_nbr} • `
  }
  if (offering.instructors.length) {
    result += offering.instructors
      .map((inst) => `${inst.first_name} ${inst.last_name}`)
      .join(', ')
    result += ' • '
  }
  result += termCodeToString(offering.term_code)

  return result
}
