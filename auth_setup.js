
import { chromium, expect } from '@playwright/test';

async function globalSetup() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.saucedemo.com/');

  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForURL('**/inventory.html');

  // Verify login succeeded before saving the state
  await expect(page.getByText('Products')).toBeVisible();

  // Save the authenticated browser state
  await context.storageState({ path: 'login.json' });

  await browser.close();
}

export default globalSetup;


