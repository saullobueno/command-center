import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { OfflineBanner } from './offline-banner'

function setOnLine(value: boolean) {
  Object.defineProperty(navigator, 'onLine', { configurable: true, value })
}

describe('OfflineBanner', () => {
  afterEach(() => {
    setOnLine(true)
  })

  it('não renderiza nada quando online', () => {
    setOnLine(true)
    const { container } = render(<OfflineBanner />)
    expect(container).toBeEmptyDOMElement()
  })

  it('mostra o aviso quando o navegador fica offline', () => {
    setOnLine(true)
    render(<OfflineBanner />)

    setOnLine(false)
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    expect(screen.getByText(/sem conexão/i)).toBeInTheDocument()
  })
})
