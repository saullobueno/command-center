import type { Device } from '@/types/device'
import type { DeviceFilters } from '@/stores/ui-store'

export function filterDevices(devices: readonly Device[], filters: DeviceFilters): Device[] {
  const search = filters.search.trim().toLowerCase()

  return devices.filter((device) => {
    if (search && !device.name.toLowerCase().includes(search)) return false
    if (filters.statuses.size > 0 && !filters.statuses.has(device.status)) return false
    if (filters.types.size > 0 && !filters.types.has(device.type)) return false
    if (filters.siteId && device.siteId !== filters.siteId) return false
    return true
  })
}
