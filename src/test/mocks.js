import { vi } from 'vitest'

export const regiones = [
  { codigo: 'RM', nombre: 'Región Metropolitana', comunas: ['Santiago', 'Macul'] },
  { codigo: 'V', nombre: 'Región de Valparaíso', comunas: ['Valparaíso', 'Viña del Mar'] },
]

export function mockFetch(routes) {
  return vi.fn(async (url) => {
    const entry = Object.entries(routes).find(([pattern]) => url.includes(pattern))
    if (!entry) return { ok: false, status: 404, json: async () => ({}) }
    return { ok: true, status: 200, json: async () => entry[1] }
  })
}
