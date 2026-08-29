import { beforeEach, describe, expect, it } from 'vitest'
import type { Device } from '@/types/device'
import type { DeviceEvent } from '@/types/event'
import { useDeviceStore } from './device-store'

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
    lastSeen: new Date(0).toISOString(),
    ...overrides,
  }
}

function makeEvent(overrides: Partial<DeviceEvent> = {}): DeviceEvent {
  return {
    id: 'evt-1',
    deviceId: 'dev-0',
    type: 'status-change',
    severity: 'warning',
    message: 'teste',
    timestamp: new Date(0).toISOString(),
    ...overrides,
  }
}

describe('useDeviceStore', () => {
  beforeEach(() => {
    useDeviceStore.setState({ devices: {}, events: [], tickCount: 0, simulationStartedAt: null })
  })

  it('hydrate popula devices indexados por id', () => {
    useDeviceStore.getState().hydrate([makeDevice({ id: 'a' }), makeDevice({ id: 'b' })])
    const { devices } = useDeviceStore.getState()
    expect(Object.keys(devices)).toEqual(['a', 'b'])
  })

  it('applyUpdate aplica o patch e empilha o evento', () => {
    useDeviceStore.getState().hydrate([makeDevice({ id: 'dev-0', status: 'online' })])
    useDeviceStore.getState().applyUpdate(makeEvent(), { status: 'warning' })

    const { devices, events, tickCount, simulationStartedAt } = useDeviceStore.getState()
    expect(devices['dev-0']?.status).toBe('warning')
    expect(events).toHaveLength(1)
    expect(events[0]?.id).toBe('evt-1')
    expect(tickCount).toBe(1)
    expect(simulationStartedAt).toBe(new Date(0).toISOString())
  })

  it('applyUpdate ignora eventos de dispositivos inexistentes', () => {
    useDeviceStore.getState().hydrate([makeDevice({ id: 'dev-0' })])
    useDeviceStore
      .getState()
      .applyUpdate(makeEvent({ deviceId: 'nao-existe' }), { status: 'warning' })

    const { devices, events, tickCount } = useDeviceStore.getState()
    expect(devices['dev-0']?.status).toBe('online')
    expect(events).toHaveLength(0)
    expect(tickCount).toBe(0)
  })

  it('addManualEvent empilha o evento sem tocar em devices/tickCount/statusHistory', () => {
    useDeviceStore.getState().hydrate([makeDevice({ id: 'dev-0' })])
    useDeviceStore.getState().addManualEvent(makeEvent({ id: 'note-1', type: 'alert' }))

    const { devices, events, tickCount, statusHistory } = useDeviceStore.getState()
    expect(events).toHaveLength(1)
    expect(events[0]?.id).toBe('note-1')
    expect(devices['dev-0']?.status).toBe('online')
    expect(tickCount).toBe(0)
    expect(statusHistory).toHaveLength(0)
  })
})
