import { useEffect, useState } from 'react'


export function useLocalStorage(key, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(key)
      return guardado !== null ? JSON.parse(guardado) : valorInicial
    } catch {
      return valorInicial 
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(valor))
    } catch {
    }
  }, [key, valor])

  return [valor, setValor]
}
