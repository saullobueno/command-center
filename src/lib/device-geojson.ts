import type { Device } from '@/types/device'

export interface DeviceFeatureProperties {
  id: string
  name: string
  status: Device['status']
  type: Device['type']
}

export type DeviceFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Point,
  DeviceFeatureProperties
>

export function devicesToGeoJSON(devices: readonly Device[]): DeviceFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: devices.map((device) => ({
      type: 'Feature',
      id: device.id,
      geometry: { type: 'Point', coordinates: [device.lng, device.lat] },
      properties: {
        id: device.id,
        name: device.name,
        status: device.status,
        type: device.type,
      },
    })),
  }
}
