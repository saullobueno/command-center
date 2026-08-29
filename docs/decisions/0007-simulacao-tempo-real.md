# 0007 — Tempo real simulado com `setInterval` determinístico, não WebSocket real

## Contexto

O briefing pede "WebSocket simulado". Não há backend real neste projeto
(é uma peça de portfólio), e o MSW 2.x tem suporte a interceptar
WebSocket, mas ele é feito para simular um servidor WS que o cliente se
conecta via `new WebSocket(...)` de verdade — ainda assim exige escrever
um protocolo de mensagens arbitrário nos dois lados sem nenhum ganho real
de fidelidade, já que o "servidor" interceptado roda no mesmo processo do
browser.

## Decisão

Simular o fluxo de eventos em tempo real com um `setInterval` (
`useRealtimeSync`, `src/hooks/use-realtime-sync.ts`) que, a cada tick,
sorteia um dispositivo, decide sua próxima transição de status via uma
função pura (`simulateTick`, `src/lib/mock/realtime.ts`) alimentada por um
gerador pseudoaleatório com seed (`src/lib/random.ts`), e aplica o
resultado no `device-store` do Zustand.

## Consequências

- Toda a "aleatoriedade" é determinística dado um seed — pré-requisito
  para o **Event Replay**: gravar/repetir uma janela de tempo significa
  apenas re-rodar a mesma sequência de ticks a partir da mesma seed, sem
  precisar armazenar cada evento gerado.
- Não há um protocolo de mensagens de rede para manter, testar ou
  documentar — a "camada de transporte" simulada é só a função `tick`
  chamada em intervalo, o que também a torna trivial de testar (chamar a
  função diretamente, sem mocks de rede).
- Se um dia isso precisar parecer mais com uma conexão real (latência,
  desconexão, reconexão), dá para adicionar esse comportamento na própria
  função de tick sem tocar no restante da aplicação — os consumidores só
  enxergam eventos chegando no store.
