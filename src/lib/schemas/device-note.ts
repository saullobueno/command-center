import { z } from 'zod'

export const deviceNoteSchema = z.object({
  message: z
    .string()
    .trim()
    .min(3, 'Escreva pelo menos 3 caracteres.')
    .max(200, 'Máximo de 200 caracteres.'),
  severity: z.enum(['info', 'warning', 'critical']),
})

export type DeviceNoteFormValues = z.infer<typeof deviceNoteSchema>
