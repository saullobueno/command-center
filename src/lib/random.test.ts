import { describe, expect, it } from 'vitest'
import { createRng, pick, range } from './random'

describe('createRng', () => {
  it('produz a mesma sequência para a mesma seed', () => {
    const a = createRng(42)
    const b = createRng(42)
    const sequenceA = Array.from({ length: 5 }, () => a())
    const sequenceB = Array.from({ length: 5 }, () => b())
    expect(sequenceA).toEqual(sequenceB)
  })

  it('produz sequências diferentes para seeds diferentes', () => {
    const a = createRng(1)
    const b = createRng(2)
    expect(a()).not.toBe(b())
  })

  it('gera valores entre 0 e 1', () => {
    const rng = createRng(7)
    for (let i = 0; i < 50; i++) {
      const value = rng()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })
})

describe('pick', () => {
  it('sempre retorna um item da lista', () => {
    const rng = createRng(3)
    const items = ['a', 'b', 'c'] as const
    for (let i = 0; i < 20; i++) {
      expect(items).toContain(pick(rng, items))
    }
  })
})

describe('range', () => {
  it('respeita os limites min/max', () => {
    const rng = createRng(9)
    for (let i = 0; i < 20; i++) {
      const value = range(rng, 10, 20)
      expect(value).toBeGreaterThanOrEqual(10)
      expect(value).toBeLessThanOrEqual(20)
    }
  })
})
