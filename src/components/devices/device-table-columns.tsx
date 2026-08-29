import type { ColumnDef } from '@tanstack/react-table'
import { formatLastSeen, formatPercent, TYPE_LABEL } from '@/lib/device-format'
import { SITE_NAME_BY_ID } from '@/lib/mock/site-lookup'
import type { Device } from '@/types/device'
import { StatusBadge } from './status-badge'

export const deviceColumns: ColumnDef<Device>[] = [
  {
    accessorKey: 'name',
    header: 'Dispositivo',
    cell: (info) => <span className="font-medium">{info.getValue<string>()}</span>,
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: (info) => TYPE_LABEL[info.getValue<Device['type']>()],
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue<Device['status']>()} />,
  },
  {
    accessorKey: 'siteId',
    header: 'Site',
    cell: (info) => {
      const siteId = info.getValue<string>()
      return SITE_NAME_BY_ID[siteId] ?? siteId
    },
  },
  {
    accessorKey: 'battery',
    header: 'Bateria',
    cell: (info) => formatPercent(info.getValue<number>()),
  },
  {
    accessorKey: 'signal',
    header: 'Sinal',
    cell: (info) => formatPercent(info.getValue<number>()),
  },
  {
    accessorKey: 'lastSeen',
    header: 'Última atividade',
    cell: (info) => formatLastSeen(info.getValue<string>()),
  },
]
