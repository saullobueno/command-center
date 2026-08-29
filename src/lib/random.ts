/**
 * PRNG determinístico (mulberry32). Usado para gerar os dispositivos e a
 * simulação de eventos de forma reprodutível — essencial para o Event
 * Replay, onde a mesma janela de tempo precisa produzir sempre a mesma
 * sequência de estados.
 */
export function createRng(seed: number) {
  let state = seed
  return function rng() {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]!
}

export function range(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min)
}
