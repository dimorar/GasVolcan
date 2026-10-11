export const REGIONES_URL = `${import.meta.env.BASE_URL}data/regiones.json`

export function comunasDeRegion(regiones, codigo) {
  return regiones?.find((r) => r.codigo === codigo)?.comunas ?? []
}
import { describe, expect, it } from 'vitest'
import { comunasDeRegion } from './regiones.js'
import { regiones } from '../test/mocks.js'

describe('regiones', () => {
  it('devuelve las comunas de una región o lista vacía', () => {
    expect(comunasDeRegion(regiones, 'RM')).toEqual(['Santiago', 'Macul'])
    expect(comunasDeRegion(regiones, 'X')).toEqual([])
    expect(comunasDeRegion(null, 'RM')).toEqual([])
  })
})
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
