import { expect, test } from '@playwright/test'

test('dashboard to detail smoke flow', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Featured shows' })).toBeVisible()

  const firstShowCard = page.locator('.row .card').first()
  await expect(firstShowCard).toBeVisible()
  await firstShowCard.click()

  await expect(page).toHaveURL(/\/show\/\d+/)
  await expect(page.getByRole('link', { name: /Back to home/i })).toBeVisible()
})
