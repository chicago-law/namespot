import { useState } from 'react'

// Thanks Gabe Ragland
// https://usehooks.com/useLocalStorage/
function useLocalStorage(key: string, initialValue: string): [string, (value: string) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue.
      if (item) return JSON.parse(item)
      // Instantiate storage with the initial value.
      window.localStorage.setItem(key, JSON.stringify(initialValue))
      return initialValue
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: string | Function) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function
        ? value(storedValue)
        : value

      // Save state
      setStoredValue(valueToStore)

      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      // eslint-disable-next-line
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

export default useLocalStorage
