import { test, expect } from '@playwright/test';

test('calculator evaluates a simple expression', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: '2' }).click();
  await page.getByRole('button', { name: '+', exact: true }).click();
  await page.getByRole('button', { name: '2' }).click();
  await page.getByRole('button', { name: '=' }).click();

  await expect(page.getByRole('status')).toHaveText('4');
});
