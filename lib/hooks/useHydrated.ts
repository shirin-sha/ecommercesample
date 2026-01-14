import { useEffect, useState } from 'react'

/**
 * Returns true after the component has mounted on the client.
 * Useful to avoid SSR/CSR mismatches for client-only state (e.g. localStorage).
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
}



