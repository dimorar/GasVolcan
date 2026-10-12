import Pedidos from '../components/admin/Pedidos.jsx'
import Inventario from '../components/admin/Inventario.jsx'
import Usuarios from '../components/admin/Usuarios.jsx'

export default function Admin() {
  return (
    <>
      <h2>Panel de administración</h2>
      <Pedidos />
      <Inventario />
      <Usuarios />
    </>
  )
}
