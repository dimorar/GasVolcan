import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderAt } from './test/renderWithRouter.jsx'

beforeEach(() => {
  localStorage.clear()
})

describe('Navegación', () => {
  it('muestra la portada con los pasos para comprar', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tu carga de gas a un click')
    expect(screen.getByRole('heading', { name: '¿Cómo comprar?' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('muestra 404 en rutas desconocidas', () => {
    renderAt('/no-existe')
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
  })

  it('abre y cierra el menú en pantallas chicas', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const boton = screen.getByRole('button', { name: 'Menú' })
    expect(boton).toHaveAttribute('aria-expanded', 'false')
    await user.click(boton)
    expect(boton).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('navigation', { name: 'Principal' })).toHaveClass('abierto')
    await user.click(screen.getByRole('link', { name: 'Contacto/Registro' }))
    expect(boton).toHaveAttribute('aria-expanded', 'false')
  })
})
import { describe, expect, it } from 'vitest'
import {
  USUARIOS_INICIALES, autenticar, eliminarUsuario, esAdmin, guardarUsuario, validarUsuario,
} from './users.js'

const valido = {
  rut: '11.111.111-1', nombre: 'Ana Pérez', email: 'Ana@Gmail.com', password: 'secreto1', region: 'RM', comuna: 'Macul',
}

describe('usuarios', () => {
  it('no reporta errores con datos válidos', () => {
    expect(validarUsuario(valido, USUARIOS_INICIALES)).toEqual({})
  })

  it('reporta cada campo inválido', () => {
    const errores = validarUsuario({ rut: '1', nombre: ' ', email: 'x@y.com', password: '1' }, [])
    expect(Object.keys(errores).sort()).toEqual(['comuna', 'email', 'nombre', 'password', 'region', 'rut'])
  })

  it('no permite RUN duplicado, salvo el del propio usuario al editar', () => {
    const datos = { ...valido, rut: '12345678-5' }
    expect(validarUsuario(datos, USUARIOS_INICIALES).rut).toMatch(/Ya existe/)
    expect(validarUsuario({ ...datos, password: '' }, USUARIOS_INICIALES, 1)).toEqual({})
  })

  it('crea usuarios normalizados con rol Cliente', () => {
    const lista = guardarUsuario(USUARIOS_INICIALES, valido)
    expect(lista).toHaveLength(2)
    expect(lista[1]).toMatchObject({ rut: '11111111-1', email: 'ana@gmail.com', rol: 'Cliente' })
  })

  it('edita manteniendo la contraseña si viene vacía', () => {
    const editado = guardarUsuario(USUARIOS_INICIALES, { ...valido, rut: '12345678-5', password: '' }, 1)
    expect(editado[0]).toMatchObject({ nombre: 'Ana Pérez', password: 'admin123', rol: 'Admin' })
    const conPass = guardarUsuario(USUARIOS_INICIALES, { ...valido, password: 'nueva123' }, 1)
    expect(conPass[0].password).toBe('nueva123')
  })

  it('elimina, autentica y reconoce administradores', () => {
    expect(eliminarUsuario(USUARIOS_INICIALES, '1')).toEqual([])
    expect(autenticar(USUARIOS_INICIALES, ' ADMIN@duoc.cl', 'admin123')?.nombre).toBe('Admin Sistema')
    expect(autenticar(USUARIOS_INICIALES, 'admin@duoc.cl', 'mala')).toBeNull()
    expect(esAdmin({ rol: 'Admin' })).toBe(true)
    expect(esAdmin(null)).toBe(false)
  })
})
