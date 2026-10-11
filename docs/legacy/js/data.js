import { formatearRut, validarCorreo, validarPassword, validarRut } from './validation.js'
const initialProducts = [
    { id: 'G-05', name: 'Gas 5Kg',  price: 10500, stock: 15, stockCritico: 5, img: 'img/gas-5kg.svg' },
    { id: 'G-11', name: 'Gas 11Kg', price: 16800, stock: 3,  stockCritico: 5, img: 'img/gas-11kg.svg' },
    { id: 'G-15', name: 'Gas 15Kg', price: 21500, stock: 20, stockCritico: 5, img: 'img/gas-15kg.svg' },
    { id: 'G-45', name: 'Gas 45Kg', price: 62000, stock: 2,  stockCritico: 3, img: 'img/gas-45kg.svg' }
];

const DATA_VERSION = '2';
if (localStorage.getItem('productsVersion') !== DATA_VERSION) {
    localStorage.setItem('products', JSON.stringify(initialProducts));
    localStorage.setItem('productsVersion', DATA_VERSION);
}
export const USUARIOS_INICIALES = [
  {
    id: 1,
    rut: '12345678-5',
    nombre: 'Admin Sistema',
    email: 'admin@duoc.cl',
    password: 'admin123',
    rol: 'Admin',
    region: 'RM',
    comuna: 'Santiago',
  },
]
export function validarUsuario(datos, usuarios = [], idEditando = null) {
  const errores = {}
  if (!validarRut(datos.rut)) errores.rut = 'RUN inválido. Revisa el dígito verificador.'
  else if (
    usuarios.some((u) => u.rut === formatearRut(datos.rut) && String(u.id) !== String(idEditando))
  ) {
    errores.rut = 'Ya existe un usuario con ese RUN.'
  }
  if (!datos.nombre?.trim()) errores.nombre = 'El nombre es obligatorio.'
  if (!validarCorreo(datos.email)) {
    errores.email = 'El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.'
  }
  if (!(idEditando && !datos.password) && !validarPassword(datos.password)) {
    errores.password = 'La contraseña debe tener al menos 6 caracteres.'
  }
  if (!datos.region) errores.region = 'Selecciona una región.'
  if (!datos.comuna) errores.comuna = 'Selecciona una comuna.'
  return errores
}
export function guardarUsuario(usuarios, datos, idEditando = null) {
  const normalizado = {
    rut: formatearRut(datos.rut),
    nombre: datos.nombre.trim(),
    email: datos.email.trim().toLowerCase(),
    region: datos.region,
    comuna: datos.comuna,
  }
  if (idEditando) {
    return usuarios.map((u) =>
      String(u.id) === String(idEditando)
        ? { ...u, ...normalizado, ...(datos.password ? { password: datos.password } : {}) }
        : u,
    )
  }
  return [...usuarios, { id: Date.now(), ...normalizado, password: datos.password, rol: 'Cliente' }]
}
export function eliminarUsuario(usuarios, id) {
  return usuarios.filter((u) => String(u.id) !== String(id))
}
export function autenticar(usuarios, email, password) {
  const correo = email.trim().toLowerCase()
  return usuarios.find((u) => u.email === correo && u.password === password) ?? null
}
export function esAdmin(usuario) {
  return usuario?.rol === 'Admin'
}
