import { beforeEach, describe, expect, it } from 'vitest'
import { useReplayStore } from './replay-store'

describe('useReplayStore', () => {
  beforeEach(() => {
    useReplayStore.getState().exit()
  })

  it('activate liga o modo replay com o índice inicial em rangeStart', () => {
    useReplayStore.getState().activate(10, 50)
    const state = useReplayStore.getState()
    expect(state.active).toBe(true)
    expect(state.isPlaying).toBe(false)
    expect(state.rangeStart).toBe(10)
    expect(state.rangeEnd).toBe(50)
    expect(state.currentIndex).toBe(10)
  })

  it('setRange recorta currentIndex para dentro da nova janela', () => {
    useReplayStore.getState().activate(0, 100)
    useReplayStore.getState().setCurrentIndex(90)

    useReplayStore.getState().setRange(20, 60)
    expect(useReplayStore.getState().currentIndex).toBe(60)

    useReplayStore.getState().setCurrentIndex(5)
    useReplayStore.getState().setRange(20, 60)
    expect(useReplayStore.getState().currentIndex).toBe(20)
  })

  it('play/pause alternam isPlaying sem afetar o restante do estado', () => {
    useReplayStore.getState().activate(0, 10)
    useReplayStore.getState().play()
    expect(useReplayStore.getState().isPlaying).toBe(true)

    useReplayStore.getState().pause()
    expect(useReplayStore.getState().isPlaying).toBe(false)
  })

  it('exit reseta tudo, inclusive replayDevices', () => {
    useReplayStore.getState().activate(0, 10)
    useReplayStore.getState().setReplayDevices({ a: {} as never })
    useReplayStore.getState().play()

    useReplayStore.getState().exit()

    const state = useReplayStore.getState()
    expect(state.active).toBe(false)
    expect(state.isPlaying).toBe(false)
    expect(state.replayDevices).toBeNull()
  })
})
