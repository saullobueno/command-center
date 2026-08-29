import { useQuery } from '@tanstack/react-query'
import type { Device } from '@/types/device'

async function fetchDevices(): Promise<Device[]> {
  const response = await fetch('/api/devices')
  if (!response.ok) throw new Error(`Falha ao carregar dispositivos: ${response.status}`)
  return response.json()
}

export function useDevicesQuery() {
  return useQuery({
    queryKey: ['devices'],
    queryFn: fetchDevices,
  })
}
