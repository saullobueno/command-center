import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { useUiStore } from '@/stores/ui-store'
import { DeviceFilters } from './device-filters'

beforeEach(() => {
  useUiStore.getState().resetFilters()
})

describe('DeviceFilters', () => {
  it('digitar no campo de busca atualiza o filtro de busca no store', async () => {
    render(<DeviceFilters />)

    await userEvent.type(screen.getByLabelText(/buscar dispositivo/i), 'sensor-sp')

    expect(useUiStore.getState().filters.search).toBe('sensor-sp')
  })

  it('clicar num badge de status alterna esse status no filtro', async () => {
    render(<DeviceFilters />)

    await userEvent.click(screen.getByText('Alerta'))
    expect(useUiStore.getState().filters.statuses.has('warning')).toBe(true)

    await userEvent.click(screen.getByText('Alerta'))
    expect(useUiStore.getState().filters.statuses.has('warning')).toBe(false)
  })

  it('mostra "Limpar filtros" só quando há filtro ativo', async () => {
    render(<DeviceFilters />)

    expect(screen.queryByText(/limpar filtros/i)).not.toBeInTheDocument()

    await userEvent.click(screen.getByText('Online'))
    expect(screen.getByText(/limpar filtros/i)).toBeInTheDocument()

    await userEvent.click(screen.getByText(/limpar filtros/i))
    expect(screen.queryByText(/limpar filtros/i)).not.toBeInTheDocument()
  })
})
