import { useState } from 'react'
import { Link, NavLink } from 'react-router'

export default function Navbar() {
  const [abierto, setAbierto] = useState(false)
  const cerrar = () => setAbierto(false)

  return (
    <header className="main-header">
      <Link to="/" className="logo" onClick={cerrar}>GasVolcan</Link>
      <button
        className="menu-toggle"
        aria-label="Menú"
        aria-expanded={abierto}
        aria-controls="menu-principal"
        onClick={() => setAbierto(!abierto)}
      >
        ☰
      </button>
      <nav id="menu-principal" className={abierto ? 'nav-menu abierto' : 'nav-menu'} aria-label="Principal">
        <NavLink to="/" end onClick={cerrar}>Inicio</NavLink>
        <NavLink to="/catalogo" onClick={cerrar}>Catálogo</NavLink>
        <NavLink to="/contacto" onClick={cerrar}>Contacto/Registro</NavLink>
      </nav>
    </header>
  )
}
