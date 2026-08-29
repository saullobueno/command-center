import { STATUS_LABEL } from '@/lib/device-format'
import { useDeviceStore } from '@/stores/device-store'
import type { DeviceStatus } from '@/types/device'

const STAT_CLASS: Record<DeviceStatus, string> = {
  online: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  offline: 'text-red-600 dark:text-red-400',
}

export function DeviceStats() {
  const devices = useDeviceStore((state) => state.devices)
  const list = Object.values(devices)
  const counts: Record<DeviceStatus, number> = { online: 0, warning: 0, offline: 0 }
  for (const device of list) counts[device.status]++

  return (
    <div className="flex items-center gap-4 text-xs">
      <span className="text-muted-foreground">{list.length} dispositivos</span>
      {(Object.keys(counts) as DeviceStatus[]).map((status) => (
        <span key={status} className={STAT_CLASS[status]}>
          {counts[status]} {STATUS_LABEL[status].toLowerCase()}
        </span>
      ))}
    </div>
  )
}
