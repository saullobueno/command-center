import { render } from '@testing-library/react'
import { describe, it, vi } from 'vitest'
import type { Device } from '@/types/device'
import { DeviceMap } from './device-map'

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
    lastSeen: new Date().toISOString(),
    ...overrides,
  }
}

describe('DeviceMap', () => {
  it('monta e desmonta sem lançar erros (maplibre-gl mockado, sem WebGL real)', () => {
    const { unmount, rerender } = render(
      <DeviceMap
        devices={[makeDevice()]}
        selectedDeviceId={null}
        onSelectDevice={vi.fn()}
        theme="light"
      />,
    )
    rerender(
      <DeviceMap
        devices={[makeDevice()]}
        selectedDeviceId={null}
        onSelectDevice={vi.fn()}
        theme="dark"
      />,
    )
    unmount()
  })
})
