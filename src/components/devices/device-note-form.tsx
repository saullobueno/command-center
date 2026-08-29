import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { SEVERITY_LABEL } from '@/lib/device-format'
import { deviceNoteSchema, type DeviceNoteFormValues } from '@/lib/schemas/device-note'
import { useDeviceStore } from '@/stores/device-store'
import type { EventSeverity } from '@/types/event'

const SEVERITIES: EventSeverity[] = ['info', 'warning', 'critical']

interface DeviceNoteFormProps {
  deviceId: string
}

export function DeviceNoteForm({ deviceId }: DeviceNoteFormProps) {
  const addManualEvent = useDeviceStore((state) => state.addManualEvent)

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<DeviceNoteFormValues>({
    resolver: zodResolver(deviceNoteSchema),
    defaultValues: { message: '', severity: 'info' },
  })

  function onSubmit(values: DeviceNoteFormValues) {
    // Chamado só pelo handler de submit do formulário, nunca durante o
    // render — oxlint não distingue isso e sinaliza `Date.now()` como
    // impuro de qualquer forma.
    addManualEvent({
      // oxlint-disable-next-line react/purity
      id: `note-${Date.now()}`,
      deviceId,
      type: 'alert',
      severity: values.severity,
      message: values.message.trim(),
      timestamp: new Date().toISOString(),
    })
    reset({ message: '', severity: 'info' })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 px-4 pb-4">
      <Textarea
        placeholder="Anotar uma observação sobre este dispositivo..."
        rows={2}
        aria-label="Mensagem da anotação"
        aria-invalid={Boolean(errors.message)}
        {...register('message')}
      />
      {errors.message && <p className="text-destructive text-xs">{errors.message.message}</p>}

      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="severity"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-32" aria-label="Severidade da anotação">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEVERITIES.map((severity) => (
                  <SelectItem key={severity} value={severity}>
                    {SEVERITY_LABEL[severity]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <Button type="submit" size="sm" className="ml-auto">
          Adicionar anotação
        </Button>
      </div>

      {isSubmitSuccessful && (
        <p className="text-muted-foreground text-xs" role="status">
          Anotação adicionada à timeline.
        </p>
      )}
    </form>
  )
}
