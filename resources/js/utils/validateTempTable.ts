import { TempTable } from '../store/session/types'

export function validateTempTable(table: TempTable): string[] {
  const errors = []

  // Must have a valid start point
  if (!('sX' in table) || table.sX === null || table.sY === null) {
    errors.push('Must have a valid start point')
  }

  // Must have a valid end point
  if (!('eX' in table) || table.eX === null || table.eY === null) {
    errors.push('Must have a valid end point')
  }

  return errors
}
