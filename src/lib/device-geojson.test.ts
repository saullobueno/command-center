import { describe, expect, it } from 'vitest'
import type { Device } from '@/types/device'
import { devicesToGeoJSON } from './device-geojson'

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

describe('devicesToGeoJSON', () => {
  it('converte dispositivos em uma FeatureCollection de pontos [lng, lat]', () => {
    const geojson = devicesToGeoJSON([makeDevice({ id: 'a', lat: -23.5, lng: -46.6 })])

    expect(geojson.type).toBe('FeatureCollection')
    expect(geojson.features).toHaveLength(1)
    expect(geojson.features[0]?.geometry.coordinates).toEqual([-46.6, -23.5])
    expect(geojson.features[0]?.properties.id).toBe('a')
  })

  it('lista vazia produz FeatureCollection vazia', () => {
    expect(devicesToGeoJSON([]).features).toEqual([])
  })
})
