# 0012 — PWA instalável sem service worker de cache/offline real

## Contexto

O briefing pedia "responsive/PWA" e "offline mode". A abordagem padrão
para isso em projetos Vite é `vite-plugin-pwa` (Workbox), que registra um
service worker próprio para cachear assets e permitir offline de verdade.

Só que este projeto já depende de um service worker — o do **MSW**
(`public/mockServiceWorker.js`, registrado em todo `MODE`, ver ADR 0011),
que intercepta todo `fetch` da aplicação e É a "API". Dois service workers
registrados na mesma origem/escopo (`/`) entram em conflito: o navegador
só mantém um controller ativo por escopo, e o registro mais recente tende
a assumir o controle, quebrando o outro de forma silenciosa e
imprevisível — no nosso caso, especificamente quebraria o MSW, do qual
literalmente toda a aplicação depende.

## Decisão

- **PWA instalável, sim**: `public/manifest.webmanifest` + `<link
rel="manifest">` + `theme-color` no `index.html`. O app pode ser
  "instalado" (ícone, `display: standalone`).
- **Sem service worker de cache/offline real**: não adicionar
  `vite-plugin-pwa`/Workbox. "Offline mode" foi implementado como um
  indicador honesto (`src/components/offline-banner.tsx`, via evento
  `online`/`offline` do navegador) que avisa quando a rede cai — os dados
  de dispositivos continuam funcionando (são simulados no cliente via
  MSW, não dependem de rede), mas os tiles do mapa (CARTO) e as fontes
  (Fontsource, carregadas de CDN) genuinamente precisam de rede e param de
  carregar.

## Consequências

- Sem "add to offline cache" de verdade — recarregar a página offline
  falha (o browser não tem o HTML/JS cacheado), diferente de um PWA
  completo com Workbox.
- Se um dia isso precisar de cache offline real, a saída é migrar o MSW
  para rodar dentro do MESMO service worker do Workbox (via
  `importScripts` ou reimplementando os handlers como estratégias de
  runtime caching do Workbox) — não dá para simplesmente somar os dois
  plugins.
