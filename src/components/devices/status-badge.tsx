import { cn } from '@/lib/utils'
import { STATUS_LABEL } from '@/lib/device-format'
import type { DeviceStatus } from '@/types/device'

const STATUS_DOT: Record<DeviceStatus, string> = {
  online: 'bg-emerald-500',
  warning: 'bg-amber-500',
  offline: 'bg-red-500',
}

const STATUS_TEXT: Record<DeviceStatus, string> = {
  online: 'text-emerald-700 dark:text-emerald-400',
  warning: 'text-amber-700 dark:text-amber-400',
  offline: 'text-red-700 dark:text-red-400',
}

export function StatusBadge({ status }: { status: DeviceStatus }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 text-xs font-medium', STATUS_TEXT[status])}
    >
      <span className={cn('size-1.5 rounded-full', STATUS_DOT[status])} aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  )
}
