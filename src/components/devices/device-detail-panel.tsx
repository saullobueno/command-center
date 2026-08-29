import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatLastSeen, formatPercent, TYPE_LABEL } from '@/lib/device-format'
import { SITE_NAME_BY_ID } from '@/lib/mock/site-lookup'
import type { Device } from '@/types/device'
import { StatusBadge } from './status-badge'

interface DeviceDetailPanelProps {
  device: Device | null
}

export function DeviceDetailPanel({ device }: DeviceDetailPanelProps) {
  if (!device) {
    return (
      <p className="text-muted-foreground p-4 text-sm">
        Selecione um dispositivo no mapa, na tabela ou pelo atalho <kbd>Ctrl</kbd>+<kbd>K</kbd>.
      </p>
    )
  }

  const rows: [string, ReactNode][] = [
    ['Status', <StatusBadge key="status" status={device.status} />],
    ['Tipo', TYPE_LABEL[device.type]],
    ['Site', SITE_NAME_BY_ID[device.siteId] ?? device.siteId],
    ['Bateria', formatPercent(device.battery)],
    ['Sinal', formatPercent(device.signal)],
    ['Última atividade', formatLastSeen(device.lastSeen)],
  ]

  return (
    <Card className="rounded-none border-0 border-b shadow-none">
      <CardHeader>
        <CardTitle>{device.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
