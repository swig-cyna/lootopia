import { useCallback, useRef, useState } from "react"

const useDebounceCallback = <T>(
  callback: (_value: T) => void,
  delay: number,
) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return useCallback(
    (value: T) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        callback(value)
      }, delay)
    },
    [callback, delay],
  )
}

export const useDebounceValue = <T>(
  initialValue: T,
  delay: number,
): [T, (_value: T) => void] => {
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue)
  const updateDebouncedValue = useDebounceCallback(setDebouncedValue, delay)

  return [debouncedValue, updateDebouncedValue]
}
