import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { DeviceStatus, DeviceType } from '@/types/device'

export const STATUS_LABEL: Record<DeviceStatus, string> = {
  online: 'Online',
  warning: 'Alerta',
  offline: 'Offline',
}

export const TYPE_LABEL: Record<DeviceType, string> = {
  sensor: 'Sensor',
  vehicle: 'Veículo',
  meter: 'Medidor',
  gateway: 'Gateway',
}

export function formatLastSeen(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: ptBR })
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}
