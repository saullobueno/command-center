export const DEVICE_COUNT = 2_500
export const DEVICE_SEED = 1

// Usados tanto pela simulação ao vivo (src/hooks/use-realtime-sync.ts)
// quanto pelo Event Replay (src/lib/mock/replay.ts) — precisam ser os
// mesmos valores nos dois lugares para o replay reproduzir exatamente o
// que aconteceu ao vivo (ver docs/decisions/0007-simulacao-tempo-real.md).
export const REALTIME_SEED = 42
export const TICK_INTERVAL_MS = 800
