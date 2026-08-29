import { describe, expect, it } from 'vitest'
import { createRng } from '@/lib/random'
import type { Device } from '@/types/device'
import { simulateTick } from './realtime'

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

describe('simulateTick', () => {
  it('produz um evento cujo deviceId pertence à lista informada', () => {
    const devices = [makeDevice({ id: 'a' }), makeDevice({ id: 'b' })]
    const rng = createRng(1)
    const { event } = simulateTick(devices, rng, 'evt-1')
    expect(['a', 'b']).toContain(event.deviceId)
  })

  it('nunca transiciona um dispositivo online direto para offline', () => {
    const devices = [makeDevice({ status: 'online' })]
    const rng = createRng(1)
    const { patch } = simulateTick(devices, rng, 'evt-1')
    expect(patch.status).not.toBe('offline')
  })

  it('dispositivo que fica offline perde sinal', () => {
    // seed escolhida por tentativa para cair no ramo warning -> offline
    const devices = [makeDevice({ status: 'warning' })]
    let found = false
    for (let seed = 0; seed < 50 && !found; seed++) {
      const rng = createRng(seed)
      const { patch } = simulateTick(devices, rng, 'evt-1')
      if (patch.status === 'offline') {
        expect(patch.signal).toBe(0)
        found = true
      }
    }
    expect(found).toBe(true)
  })

  it('é determinístico para a mesma seed', () => {
    const devices = [makeDevice({ id: 'a' }), makeDevice({ id: 'b' })]
    const a = simulateTick(devices, createRng(99), 'evt-1', new Date(0))
    const b = simulateTick(devices, createRng(99), 'evt-1', new Date(0))
    expect(a).toEqual(b)
  })
})
