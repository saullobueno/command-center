import { http, HttpResponse } from 'msw'
import { DEVICE_COUNT, DEVICE_SEED } from '@/lib/mock/config'
import { generateDevices } from '@/lib/mock/devices'
import { SITES } from '@/lib/mock/sites'

export const handlers = [
  http.get('/api/health', () => HttpResponse.json({ status: 'ok' })),

  http.get('/api/devices', () => HttpResponse.json(generateDevices(DEVICE_COUNT, DEVICE_SEED))),

  http.get('/api/sites', () => HttpResponse.json(SITES)),
]
