import { useEffect, useState } from 'react'

export function useFetch(url) {
  const [result, setResult] = useState({ url: null, data: null, error: null })

  useEffect(() => {
    if (!url) return
    const controller = new AbortController()

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status} al consultar la API`)
        return res.json()
      })
      .then((data) => setResult({ url, data, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') setResult({ url, data: null, error })
      })

    return () => controller.abort()
  }, [url])

  const isCurrent = result.url === url
  return {
    data: isCurrent ? result.data : null,
    error: isCurrent ? result.error : null,
    loading: Boolean(url) && !isCurrent,
  }
}
