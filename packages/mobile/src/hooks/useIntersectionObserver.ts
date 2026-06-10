import { useEffect, useRef } from "react"

const useIntersectionObserver = (onIntersect: () => void, enabled = true) => {
  const ref = useRef<HTMLDivElement>(null)
  const callbackRef = useRef(onIntersect)
  callbackRef.current = onIntersect

  useEffect(() => {
    if (!enabled) {
      return
    }

    const el = ref.current

    if (!el) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callbackRef.current()
        }
      },
      { rootMargin: "200px" },
    )

    observer.observe(el)

    // oxlint-disable-next-line consistent-return
    return () => {
      observer.disconnect()
    }
  }, [enabled])

  return ref
}

export default useIntersectionObserver
