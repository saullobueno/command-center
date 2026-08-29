import { describe, expect, it } from 'vitest'
import type { DeviceFilters } from '@/stores/ui-store'
import type { Device } from '@/types/device'
import { filterDevices } from './filter-devices'

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

const emptyFilters: DeviceFilters = {
  search: '',
  statuses: new Set(),
  types: new Set(),
  siteId: null,
}

describe('filterDevices', () => {
  const devices = [
    makeDevice({
      id: 'a',
      name: 'sensor-sp-0',
      type: 'sensor',
      status: 'online',
      siteId: 'site-sp',
    }),
    makeDevice({
      id: 'b',
      name: 'vehicle-rj-1',
      type: 'vehicle',
      status: 'warning',
      siteId: 'site-rj',
    }),
    makeDevice({
      id: 'c',
      name: 'meter-bh-2',
      type: 'meter',
      status: 'offline',
      siteId: 'site-bh',
    }),
  ]

  it('sem filtros, retorna todos os dispositivos', () => {
    expect(filterDevices(devices, emptyFilters)).toHaveLength(3)
  })

  it('filtra por texto de busca (case-insensitive, no nome)', () => {
    const result = filterDevices(devices, { ...emptyFilters, search: 'VEHICLE' })
    expect(result.map((d) => d.id)).toEqual(['b'])
  })

  it('filtra por conjunto de status', () => {
    const result = filterDevices(devices, {
      ...emptyFilters,
      statuses: new Set(['warning', 'offline']),
    })
    expect(result.map((d) => d.id).sort()).toEqual(['b', 'c'])
  })

  it('filtra por conjunto de tipos', () => {
    const result = filterDevices(devices, { ...emptyFilters, types: new Set(['meter']) })
    expect(result.map((d) => d.id)).toEqual(['c'])
  })

  it('filtra por site', () => {
    const result = filterDevices(devices, { ...emptyFilters, siteId: 'site-rj' })
    expect(result.map((d) => d.id)).toEqual(['b'])
  })

  it('combina múltiplos filtros (AND)', () => {
    const result = filterDevices(devices, {
      ...emptyFilters,
      statuses: new Set(['online', 'warning']),
      siteId: 'site-rj',
    })
    expect(result.map((d) => d.id)).toEqual(['b'])
  })
})
