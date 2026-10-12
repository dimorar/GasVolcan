import { useEffect, useState } from 'react'

function guardar(key, valor) {
  try {
    localStorage.setItem(key, JSON.stringify(valor))
    return true
  } catch {
    return false
  }
}

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
    guardar(key, valor)
  }, [key, valor])

  return [valor, setValor]
}
