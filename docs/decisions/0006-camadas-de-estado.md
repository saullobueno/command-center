# 0006 — TanStack Query para dados de servidor, Zustand para estado ao vivo

## Contexto

O stack já definia TanStack Query e Zustand juntos, sem especificar a
fronteira entre os dois. Sem uma convenção clara, é fácil acabar
duplicando o mesmo dado nos dois lugares ou usando o hook errado para o
caso errado.

## Decisão

- **TanStack Query** é dono de qualquer dado que vem de uma requisição
  (`/api/devices`, `/api/sites`, histórico de eventos): cache, loading,
  erro, refetch. Componentes leem esses dados via os hooks em `src/hooks/`
  (ex.: `useDevicesQuery`).
- **Zustand** (`src/stores/device-store.ts`) é dono do estado que muda ao
  vivo depois da carga inicial — o status de cada dispositivo conforme a
  simulação de tempo real avança, e a fila de eventos recentes. Ele é
  _hidratado_ a partir do resultado da query (`hydrate()`), não busca dados
  sozinho.
- Estado de UI (filtro selecionado, item aberto, aba ativa) também vai em
  Zustand quando precisar ser compartilhado entre componentes distantes;
  estado local de um único componente continua em `useState`.

## Consequências

- Um dispositivo tem exatamente uma fonte de verdade em cada momento: os
  dados "frios" (nome, tipo, site) vêm da query; os dados "quentes"
  (status, bateria, sinal, `lastSeen`) vivem no store depois da hidratação.
- Componentes que só precisam da lista estática (ex.: um seletor de sites)
  podem usar a query diretamente sem depender do store.
