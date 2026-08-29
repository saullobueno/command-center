# 0010 — Error boundary dedicado ao redor do mapa

## Contexto

`maplibre-gl` exige um contexto WebGL. Isso pode falhar por razões reais
(hardware antigo, aceleração de GPU desativada, `prefers-reduced-motion`
combinado com certas extensões de navegador) e falha **sempre** em jsdom
(ambiente de teste), que não implementa WebGL — `new MapLibreMap(...)`
lança de forma síncrona dentro de um `useEffect`, o que derruba o `render()`
inteiro do Testing Library se nada capturar o erro.

## Decisão

Envolver `<DeviceMap />` com um `<ErrorBoundary>` (`src/components/error-boundary.tsx`)
com um fallback textual, em vez de deixar a falha propagar. Isso não é
polimento adiado para a Fase 4 — sem isso, o app inteiro fica em tela
branca se o WebGL falhar, e os testes de `App.test.tsx`/`device-map.test.tsx`
não rodam.

## Consequências

- Falha de WebGL degrada graciosamente: mapa mostra uma mensagem, tabela e
  timeline continuam funcionando.
- Testes que renderizam `<App />` ou `<DeviceMap />` em jsdom usam um mock
  de `maplibre-gl` (`src/test/setup.ts`) — o error boundary é uma segunda
  camada de proteção, não uma dependência do mock funcionar.
- `ErrorBoundary` é genérico o suficiente para ser reaproveitado por outras
  partes da UI que dependem de APIs de navegador arriscadas, sem precisar
  de uma nova abstração por caso de uso.
