
import { test, expect } from '@playwright/test';

test('Compare authenticated and unauthenticated contexts', async ({ browser }) => {
  // Context A: Load the saved login state
  const authenticatedContext = await browser.newContext({
    storageState: 'login.json',
  });

  const authenticatedPage = await authenticatedContext.newPage();

  await authenticatedPage.goto(
    'https://www.saucedemo.com/inventory.html'
  );

  console.log('Authenticated page URL:', authenticatedPage.url());
  console.log('Page content:', (await authenticatedPage.locator('body').innerText()).slice(0, 500));

  // Context B: Start without the saved login state
  const unauthenticatedContext = await browser.newContext();

  const unauthenticatedPage = await unauthenticatedContext.newPage();

  await unauthenticatedPage.goto(
    'https://www.saucedemo.com/inventory.html'
  );

  await expect(unauthenticatedPage.getByRole('button', {
    name: 'Login',
  })).toBeVisible();

  // Close both contexts
  await authenticatedContext.close();
  await unauthenticatedContext.close();
});
