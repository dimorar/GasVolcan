import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import StoreProvider from '../context/StoreProvider.jsx'

export function renderConStore(ui) {
  return render(
    <MemoryRouter>
      <StoreProvider>{ui}</StoreProvider>
    </MemoryRouter>,
  )
}
