import { describe, expect, it } from 'vitest'
import { generateDevices } from './devices'

describe('generateDevices', () => {
  it('gera a quantidade solicitada de dispositivos com ids únicos', () => {
    const devices = generateDevices(200, 1)
    expect(devices).toHaveLength(200)
    expect(new Set(devices.map((d) => d.id)).size).toBe(200)
  })

  it('é determinístico para a mesma seed e o mesmo instante', () => {
    const now = new Date('2026-01-01T00:00:00.000Z')
    const a = generateDevices(50, 5, now)
    const b = generateDevices(50, 5, now)
    expect(a).toEqual(b)
  })

  it('dispositivos offline não têm sinal', () => {
    const devices = generateDevices(500, 3)
    for (const device of devices.filter((d) => d.status === 'offline')) {
      expect(device.signal).toBe(0)
    }
  })
})
