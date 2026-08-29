export type DeviceStatus = 'online' | 'offline' | 'warning'

export type DeviceType = 'sensor' | 'vehicle' | 'meter' | 'gateway'

export interface Site {
  id: string
  name: string
  lat: number
  lng: number
}

export interface Device {
  id: string
  name: string
  type: DeviceType
  status: DeviceStatus
  siteId: string
  lat: number
  lng: number
  battery: number
  signal: number
  lastSeen: string
}
