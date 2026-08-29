import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { describe, expect, it } from 'vitest'
import { useDevicesQuery } from './use-devices-query'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useDevicesQuery', () => {
  it('busca dispositivos via /api/devices (mockado pelo MSW)', async () => {
    const { result } = renderHook(() => useDevicesQuery(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.length).toBeGreaterThan(0)
    expect(result.current.data?.[0]).toHaveProperty('status')
  })
})
