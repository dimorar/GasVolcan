export function limpiarRut(rut = '') {
  return String(rut).replace(/[.\-\s]/g, '').toUpperCase()
}
export function calcularDv(cuerpo) {
  let suma = 0
  let multiplicador = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador
    multiplicador = multiplicador < 7 ? multiplicador + 1 : 2
  }
  const resto = 11 - (suma % 11)
  if (resto === 11) return '0'
  if (resto === 10) return 'K'
  return String(resto)
}
export function validarRut(rut) {
  const limpio = limpiarRut(rut)
  if (!/^\d{7,8}[0-9K]$/.test(limpio)) return false
  return calcularDv(limpio.slice(0, -1)) === limpio.slice(-1)
}
export function formatearRut(rut) {
  const limpio = limpiarRut(rut)
  return `${limpio.slice(0, -1)}-${limpio.slice(-1)}`
}
import { describe, expect, it } from 'vitest'
import { calcularDv, formatearRut, limpiarRut, validarRut } from './validation.js'

describe('RUN', () => {
  it('limpia puntos, guión y pasa la K a mayúscula', () => {
    expect(limpiarRut('12.345.678-k')).toBe('12345678K')
    expect(limpiarRut()).toBe('')
  })

  it('calcula el dígito verificador, incluidos 0 y K', () => {
    expect(calcularDv('12345678')).toBe('5')
    expect(calcularDv('11111111')).toBe('1')
    expect(calcularDv('10000013')).toBe('K')
    expect(calcularDv('10000004')).toBe('0')
  })

  it('acepta RUN válidos con o sin formato', () => {
    expect(validarRut('123456785')).toBe(true)
    expect(validarRut('12.345.678-5')).toBe(true)
    expect(validarRut('10000013-k')).toBe(true)
  })

  it('rechaza RUN con dígito incorrecto o formato inválido', () => {
    expect(validarRut('12345678-K')).toBe(false) // era el admin del código legacy
    expect(validarRut('abc')).toBe(false)
    expect(validarRut('')).toBe(false)
  })

  it('formatea con guión', () => {
    expect(formatearRut('12.345.678-5')).toBe('12345678-5')
  })
})
