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
    expect(validarRut('12345678-K')).toBe(false)
    expect(validarRut('abc')).toBe(false)
    expect(validarRut('')).toBe(false)
  })

  it('formatea con guión', () => {
    expect(formatearRut('12.345.678-5')).toBe('12345678-5')
  })
})
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

export const DOMINIOS_PERMITIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com']
export function validarCorreo(email = '') {
  const valor = email.trim().toLowerCase()
  const match = /^[^\s@]+@([^\s@]+)$/.exec(valor)
  return Boolean(match) && DOMINIOS_PERMITIDOS.includes(match[1])
}

export const MAX_MENSAJE = 500

export function validarMensaje(mensaje = '') {
  const largo = mensaje.trim().length
  return largo > 0 && largo <= MAX_MENSAJE
}

export function validarPassword(password = '') {
  return password.length >= 6
}
import { describe, expect, it } from 'vitest'
import {
  calcularDv, formatearRut, limpiarRut, validarCorreo, validarMensaje, validarPassword, validarRut,
} from './validation.js'

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
    expect(validarRut('12345678-K')).toBe(false) 
    expect(validarRut('abc')).toBe(false)
    expect(validarRut('')).toBe(false)
  })

  it('formatea con guión', () => {
    expect(formatearRut('12.345.678-5')).toBe('12345678-5')
  })
})

describe('correo', () => {
  it('acepta dominios permitidos sin importar mayúsculas', () => {
    expect(validarCorreo('ana@duoc.cl')).toBe(true)
    expect(validarCorreo('profe@profesor.duoc.cl')).toBe(true)
    expect(validarCorreo('  Ana@Gmail.COM ')).toBe(true)
  })

  it('rechaza dominios no permitidos o correos incompletos', () => {
    expect(validarCorreo('ana@hotmail.com')).toBe(false)
    expect(validarCorreo('@duoc.cl')).toBe(false)
    expect(validarCorreo('ana@falso-duoc.cl')).toBe(false)
    expect(validarCorreo()).toBe(false)
  })
})

describe('mensaje y contraseña', () => {
  it('valida largo del mensaje', () => {
    expect(validarMensaje('hola')).toBe(true)
    expect(validarMensaje('   ')).toBe(false)
    expect(validarMensaje('a'.repeat(501))).toBe(false)
    expect(validarMensaje()).toBe(false)
  })

  it('exige 6 caracteres de contraseña', () => {
    expect(validarPassword('123456')).toBe(true)
    expect(validarPassword('123')).toBe(false)
    expect(validarPassword()).toBe(false)
  })
})

 
