import { expect, test } from '@playwright/test'

test('busca um dispositivo pelo command palette (Ctrl+K) e mostra os detalhes', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Command Center' })).toBeVisible()

  // page.keyboard.press('Control+K') é interceptado pelo Chromium headless
  // antes de chegar à página (mesmo atalho da omnibox do navegador), então
  // disparamos o keydown diretamente no document — o mesmo evento que o
  // listener global de src/components/command-palette.tsx escuta.
  await page.evaluate(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))
  })

  const input = page.getByPlaceholder('Buscar dispositivo por nome...')
  await expect(input).toBeVisible()

  await input.fill('sensor')

  const firstResult = page.getByRole('option').first()
  await expect(firstResult).toBeVisible()
  const deviceName = await firstResult.locator('span').first().textContent()
  await firstResult.click()

  await expect(input).toBeHidden()
  const detailPanel = page.getByRole('complementary')
  await expect(detailPanel.getByText(deviceName!.trim(), { exact: false })).toBeVisible()
})
