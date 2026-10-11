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
