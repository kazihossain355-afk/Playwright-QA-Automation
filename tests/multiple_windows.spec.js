import { test, expect } from '@playwright/test';

test('Handle multiple windows', async ({ page, context }) => {

  // Open the page that contains the link to the new window
  await page.goto('https://the-internet.herokuapp.com/windows');

  // Wait for a new Page (tab/window) to be created
  const newPagePromise = context.waitForEvent('page');

  // Click the link that opens the new window
  await page.getByText('Click Here').click();

  // Get the newly opened Page
  const newPage = await newPagePromise;

  // Wait until the new page finishes loading
  await newPage.waitForLoadState();

  // Verify we are on the new window
  await expect(newPage.getByText('New Window')).toBeVisible();

  // Verify the original page is still available
  await expect(page.getByText('Opening a new window')).toBeVisible();

  // Close the new window
  await newPage.close();
});