import { test, expect } from '@playwright/test'

test('return 200', async ({ page }) => {
  const res = await page.goto('/')
  expect(res?.status()).toBe(200)
})
