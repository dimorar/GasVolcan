
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
