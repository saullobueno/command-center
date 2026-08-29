import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/use-online-status'

export function OfflineBanner() {
  const isOnline = useOnlineStatus()
  if (isOnline) return null

  return (
    <div className="bg-destructive/10 text-destructive flex shrink-0 items-center justify-center gap-2 px-4 py-1.5 text-xs">
      <WifiOff className="size-3.5" aria-hidden="true" />
      Sem conexão. Os dados dos dispositivos continuam simulados localmente, mas o mapa (tiles) e as
      fontes podem não carregar.
    </div>
  )
}
