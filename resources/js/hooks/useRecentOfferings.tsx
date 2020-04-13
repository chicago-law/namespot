import { useMemo } from 'react'
import useLocalStorage from './useLocalStorage'
import { Offering } from '../store/offerings/types'
import { termCodeToString } from '../utils/helpers'

// Snippets of offerings stored in local storage.
export interface OfferingPreview {
  id: string;
  label: string;
}

const useRecentOfferings = (): [
  OfferingPreview[],
  (offering: Offering) => void,
  (offeringId: string) => void,
] => {
  const [recentOfferingsString, setRecentOfferingsString] = useLocalStorage('namespot_recentOfferings', JSON.stringify([]))
  const recentOfferings: OfferingPreview[] = useMemo(() => JSON.parse(recentOfferingsString), [recentOfferingsString])

  const addRecentOffering = (offering: Offering) => {
    let newOffs = [...recentOfferings]

    // Make the new entry.
    const newEntry: OfferingPreview = {
      id: offering.id,
      label: `${offering.title} • ${termCodeToString(offering.term_code)}`,
    }

    // If it's already in there, move it to the front.
    if (newOffs.some(off => off.id === offering.id)) {
      newOffs = newOffs.filter(off => off.id !== offering.id)
      newOffs.unshift(newEntry)
    // If it's short enough, just add to front.
    } else if (newOffs.length < 5) {
      newOffs.unshift(newEntry)
    // If we're already at max length, remove last and add this to front.
    } else if (newOffs.length >= 5) {
      newOffs.pop()
      newOffs.unshift(newEntry)
    }

    // Set to storage.
    setRecentOfferingsString(JSON.stringify(newOffs))
  }

  const removeRecentOffering = (offeringId: string) => {
    let newOffs = [...recentOfferings]

    // Remove the passed in offering.
    newOffs = newOffs.filter(off => off.id !== offeringId)

    // Set to storage.
    setRecentOfferingsString(JSON.stringify(newOffs))
  }

  return [recentOfferings, addRecentOffering, removeRecentOffering]
}

export default useRecentOfferings
