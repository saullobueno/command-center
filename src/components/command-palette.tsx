import { useEffect, useMemo, useState } from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useDevicesQuery } from '@/hooks/use-devices-query'
import { STATUS_LABEL } from '@/lib/device-format'
import { useUiStore } from '@/stores/ui-store'

const MAX_RESULTS = 50

export function CommandPalette() {
  const open = useUiStore((state) => state.commandPaletteOpen)
  const setOpen = useUiStore((state) => state.setCommandPaletteOpen)
  const selectDevice = useUiStore((state) => state.selectDevice)
  const { data: devices } = useDevicesQuery()
  const [query, setQuery] = useState('')

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, setOpen])

  const results = useMemo(() => {
    if (!devices) return []
    const normalizedQuery = query.trim().toLowerCase()
    const matches = normalizedQuery
      ? devices.filter((device) => device.name.toLowerCase().includes(normalizedQuery))
      : devices
    return matches.slice(0, MAX_RESULTS)
  }, [devices, query])

  function handleSelect(id: string) {
    selectDevice(id)
    setOpen(false)
    setQuery('')
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Buscar dispositivo"
      description="Digite para buscar um dispositivo pelo nome"
    >
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Buscar dispositivo por nome..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>Nenhum dispositivo encontrado.</CommandEmpty>
          <CommandGroup heading="Dispositivos">
            {results.map((device) => (
              <CommandItem
                key={device.id}
                value={device.id}
                onSelect={() => handleSelect(device.id)}
              >
                <span>{device.name}</span>
                <span className="text-muted-foreground ml-auto text-xs">
                  {STATUS_LABEL[device.status]}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
