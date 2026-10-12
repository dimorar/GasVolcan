import { screen, within } from '@testing-library/react'

export async function llenarUsuario(user, { rut, nombre, email, password, region = 'RM', comuna = 'Macul' }) {
  await screen.findByRole('option', { name: 'Región Metropolitana' })
  
  const form = within(screen.getByLabelText('RUN').closest('form'))
  for (const [label, valor] of [['RUN', rut], ['Nombre completo', nombre], ['Correo', email]]) {
    const input = form.getByLabelText(label)
    await user.clear(input)
    await user.type(input, valor)
  }
  if (password) await user.type(form.getByLabelText('Contraseña'), password)
  await user.selectOptions(form.getByLabelText('Región'), region)
  await user.selectOptions(form.getByLabelText('Comuna'), comuna)
}

export async function iniciarSesion(user, email, password) {
  await user.type(screen.getByLabelText('Correo'), email)
  await user.type(screen.getByLabelText('Contraseña'), password)
  await user.click(screen.getByRole('button', { name: 'Ingresar' }))
}
