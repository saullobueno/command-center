import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { STATUS_LABEL, TYPE_LABEL } from '@/lib/device-format'
import { SITES } from '@/lib/mock/sites'
import { useUiStore } from '@/stores/ui-store'
import type { DeviceStatus, DeviceType } from '@/types/device'

const STATUSES: DeviceStatus[] = ['online', 'warning', 'offline']
const TYPES: DeviceType[] = ['sensor', 'vehicle', 'meter', 'gateway']

export function DeviceFilters() {
  const filters = useUiStore((state) => state.filters)
  const setSearch = useUiStore((state) => state.setSearch)
  const toggleStatus = useUiStore((state) => state.toggleStatus)
  const toggleType = useUiStore((state) => state.toggleType)
  const setSiteId = useUiStore((state) => state.setSiteId)
  const resetFilters = useUiStore((state) => state.resetFilters)

  const hasActiveFilters =
    filters.search !== '' ||
    filters.statuses.size > 0 ||
    filters.types.size > 0 ||
    filters.siteId !== null

  return (
    <div className="flex flex-wrap items-center gap-2 border-b p-3">
      <Input
        placeholder="Buscar dispositivo..."
        value={filters.search}
        onChange={(event) => setSearch(event.target.value)}
        className="w-56"
        aria-label="Buscar dispositivo"
      />

      <div className="flex items-center gap-1" role="group" aria-label="Filtrar por status">
        {STATUSES.map((status) => (
          <button key={status} type="button" onClick={() => toggleStatus(status)}>
            <Badge variant={filters.statuses.has(status) ? 'default' : 'outline'}>
              {STATUS_LABEL[status]}
            </Badge>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1" role="group" aria-label="Filtrar por tipo">
        {TYPES.map((type) => (
          <button key={type} type="button" onClick={() => toggleType(type)}>
            <Badge variant={filters.types.has(type) ? 'default' : 'outline'}>
              {TYPE_LABEL[type]}
            </Badge>
          </button>
        ))}
      </div>

      <Select
        value={filters.siteId ?? 'all'}
        onValueChange={(value) => setSiteId(value === 'all' ? null : value)}
      >
        <SelectTrigger className="w-48" aria-label="Filtrar por site">
          <SelectValue placeholder="Todos os sites" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os sites</SelectItem>
          {SITES.map((site) => (
            <SelectItem key={site.id} value={site.id}>
              {site.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Limpar filtros
        </Button>
      )}
    </div>
  )
}
