import { test, expect } from '@playwright/test';

test('Handle iframe', async ({ page }) => {

  // Open the page containing the iframe
  await page.goto('https://the-internet.herokuapp.com/iframe');

  // Locate the iframe
  const iframe = page.frameLocator('#mce_0_ifr');

  // Verify the text inside the iframe
  await expect(
    iframe.locator('body')
  ).toContainText('Your content goes here.');

});