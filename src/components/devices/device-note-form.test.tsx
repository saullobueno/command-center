import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { useDeviceStore } from '@/stores/device-store'
import { DeviceNoteForm } from './device-note-form'

beforeEach(() => {
  useDeviceStore.setState({ events: [] })
})

describe('DeviceNoteForm', () => {
  it('mostra erro de validação para mensagem muito curta', async () => {
    render(<DeviceNoteForm deviceId="dev-1" />)

    await userEvent.type(screen.getByLabelText(/mensagem da anotação/i), 'oi')
    await userEvent.click(screen.getByRole('button', { name: /adicionar anotação/i }))

    expect(await screen.findByText(/pelo menos 3 caracteres/i)).toBeInTheDocument()
    expect(useDeviceStore.getState().events).toHaveLength(0)
  })

  it('envia uma anotação válida e empilha o evento no store', async () => {
    render(<DeviceNoteForm deviceId="dev-1" />)

    await userEvent.type(
      screen.getByLabelText(/mensagem da anotação/i),
      'Bateria trocada manualmente',
    )
    await userEvent.click(screen.getByRole('button', { name: /adicionar anotação/i }))

    expect(await screen.findByText(/anotação adicionada/i)).toBeInTheDocument()

    const { events } = useDeviceStore.getState()
    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject({
      deviceId: 'dev-1',
      type: 'alert',
      severity: 'info',
      message: 'Bateria trocada manualmente',
    })
  })
})
