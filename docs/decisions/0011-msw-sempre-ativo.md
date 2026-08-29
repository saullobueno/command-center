# 0011 — MSW ativo em todos os modos, não só em desenvolvimento

## Contexto

O padrão usual (inclusive sugerido pela própria documentação do MSW) é
iniciar o worker só em desenvolvimento (`import.meta.env.MODE ===
'development'`), já que em produção existiria um backend real. O scaffold
inicial deste projeto seguiu esse padrão.

Isso causou um bug real: rodando `npm run build && npm run preview` (o
mesmo fluxo usado pelos testes e2e do Playwright e por qualquer deploy do
site), o worker nunca iniciava, `/api/devices` nunca era interceptado, e o
app ficava preso no skeleton de carregamento para sempre — descoberto
porque o teste e2e do command palette (que espera o header renderizar)
falhava, enquanto o smoke test antigo (que só checa `document.title`)
passava sem perceber o problema.

## Decisão

`enableMocking()` (`src/mocks/enable.ts`) inicia o worker MSW
incondicionalmente, em qualquer `MODE`. Este projeto não tem — e nunca
terá — um backend real para substituir o mock; o MSW _é_ a API permanente.

## Consequências

- `dist/mockServiceWorker.js` (copiado de `public/` no build) precisa estar
  presente em qualquer deploy — é gerado por `npx msw init public --save`
  e já está versionado.
- Testes que só checam `document.title` ou outro elemento estático do
  `index.html` **não pegam** esse tipo de regressão — pelo menos um teste
  e2e precisa esperar por algo que depende de dados carregados via
  `/api/*` (ver `e2e/command-palette.spec.ts`).
