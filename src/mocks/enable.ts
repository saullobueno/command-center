/**
 * Este projeto não tem backend real — o MSW é a "API" permanente, não só
 * um mock de desenvolvimento. Por isso o worker inicia em qualquer modo
 * (dev, preview, produção), diferente do padrão comum de "mock só em dev".
 */
export async function enableMocking() {
  const { worker } = await import('./browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}
