
import { test, expect } from '@playwright/test';

test.use({ storageState: 'login.json' });

test('Verify saved authentication state', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');

  await expect(page).toHaveURL(
    'https://www.saucedemo.com/inventory.html'
  );

  await expect(page.getByText('Products')).toBeVisible();
});
