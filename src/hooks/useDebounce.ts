import {useEffect, useState} from 'react'

export const useDebounce = <T>(preset: T, delay = 1000) => {
  const [value, setValue] = useState<T>(preset)
  const [debouncedValue, setDebouncedValue] = useState<T>(preset)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return [debouncedValue, value, setValue] as [T, T, (value: T) => void]
}
