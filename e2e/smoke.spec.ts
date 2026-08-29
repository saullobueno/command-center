import { expect, test } from '@playwright/test'

test('carrega a página inicial', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Command Center/i)
})
