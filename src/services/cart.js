

export function agregarAlCarrito(cart, producto, cantidad = 1) {
  const cant = Number(cantidad)
  if (!Number.isInteger(cant) || cant < 1) {
    return { cart, error: 'La cantidad debe ser un número entero mayor a 0' }
  }
  const actual = cart[producto.id] ?? 0
  if (actual + cant > producto.stock) {
    return { cart, error: `No puedes agregar más. El stock de ${producto.name} es ${producto.stock}.` }
  }
  return { cart: { ...cart, [producto.id]: actual + cant }, error: null }
}

export function cambiarCantidad(cart, producto, cambio) {
  const nueva = (cart[producto.id] ?? 0) + cambio
  if (nueva > producto.stock) {
    return { cart, error: `Alcanzaste el tope de stock (${producto.stock})` }
  }
  if (nueva <= 0) return { cart: quitarDelCarrito(cart, producto.id), error: null }
  return { cart: { ...cart, [producto.id]: nueva }, error: null }
}

export function quitarDelCarrito(cart, id) {
  const copia = { ...cart }
  delete copia[id]
  return copia
}

export function contarItems(cart) {
  return Object.values(cart).reduce((total, cant) => total + cant, 0)
}

export function lineasCarrito(cart, productos) {
  return Object.entries(cart)
    .map(([id, cantidad]) => {
      const producto = productos.find((p) => p.id === id)
      return producto ? { producto, cantidad, subtotal: producto.price * cantidad } : null
    })
    .filter(Boolean)
}

export function calcularTotal(cart, productos) {
  return lineasCarrito(cart, productos).reduce((total, linea) => total + linea.subtotal, 0)
}
