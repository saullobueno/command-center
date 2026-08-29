import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { Device } from '@/types/device'
import { deviceColumns } from './device-table-columns'

const ROW_HEIGHT = 40

interface DeviceTableProps {
  devices: Device[]
  selectedDeviceId: string | null
  onSelectDevice: (id: string) => void
}

export function DeviceTable({ devices, selectedDeviceId, onSelectDevice }: DeviceTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  const table = useReactTable({
    data: devices,
    columns: deviceColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
  })

  const rows = table.getRowModel().rows

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 12,
  })

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border">
      {table.getHeaderGroups().map((headerGroup) => (
        <div role="row" key={headerGroup.id} className="bg-muted/50 flex border-b">
          {headerGroup.headers.map((header) => {
            const sorted = header.column.getIsSorted()
            return (
              <button
                key={header.id}
                type="button"
                onClick={header.column.getToggleSortingHandler()}
                className="text-muted-foreground hover:text-foreground flex-1 px-3 py-2 text-left text-xs font-medium"
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {sorted === 'asc' && ' ↑'}
                {sorted === 'desc' && ' ↓'}
              </button>
            )
          })}
        </div>
      ))}

      <div ref={scrollRef} className="flex-1 overflow-auto" data-testid="device-table-scroll">
        {devices.length === 0 ? (
          <p className="text-muted-foreground p-6 text-center text-sm">
            Nenhum dispositivo encontrado para os filtros atuais.
          </p>
        ) : (
          <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index]
              if (!row) return null
              return (
                <div
                  key={row.id}
                  role="row"
                  onClick={() => onSelectDevice(row.original.id)}
                  className={cn(
                    'hover:bg-muted/50 absolute top-0 left-0 flex w-full cursor-pointer items-center border-b text-sm',
                    row.original.id === selectedDeviceId && 'bg-muted',
                  )}
                  style={{
                    height: virtualRow.size,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <div key={cell.id} role="cell" className="flex-1 truncate px-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
