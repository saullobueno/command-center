import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Device } from '@/types/device'
import { DeviceTable } from './device-table'

function makeDevice(overrides: Partial<Device> = {}): Device {
  return {
    id: 'dev-0',
    name: 'sensor-sp-0',
    type: 'sensor',
    status: 'online',
    siteId: 'site-sp',
    lat: -23.5,
    lng: -46.6,
    battery: 80,
    signal: 90,
    lastSeen: new Date('2026-01-01T00:00:00.000Z').toISOString(),
    ...overrides,
  }
}

beforeEach(() => {
  // TanStack Virtual precisa de uma dimensão não-zero do container de
  // scroll para decidir quais linhas estão "visíveis"; jsdom não faz
  // layout de verdade, então todo elemento tem offsetHeight 0 por padrão.
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    value: 600,
  })
})

describe('DeviceTable', () => {
  it('renderiza as linhas e chama onSelectDevice ao clicar', async () => {
    const devices = [
      makeDevice({ id: 'a', name: 'sensor-sp-0' }),
      makeDevice({ id: 'b', name: 'vehicle-rj-1', type: 'vehicle' }),
    ]
    const onSelectDevice = vi.fn()

    render(
      <DeviceTable devices={devices} selectedDeviceId={null} onSelectDevice={onSelectDevice} />,
    )

    const row = await screen.findByText('sensor-sp-0')
    await userEvent.click(row)

    expect(onSelectDevice).toHaveBeenCalledWith('a')
  })

  it('mostra mensagem quando não há dispositivos para os filtros atuais', () => {
    render(<DeviceTable devices={[]} selectedDeviceId={null} onSelectDevice={vi.fn()} />)
    expect(screen.getByText(/nenhum dispositivo encontrado/i)).toBeInTheDocument()
  })
})
