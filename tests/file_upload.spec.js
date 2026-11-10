import { test, expect } from '@playwright/test';

test('Upload a file', async ({ page }) => {

  // Open the upload page
  await page.goto('https://the-internet.herokuapp.com/upload');

  // Select the specific file input
  await page.locator('#file-upload').setInputFiles('tests/sample.txt');

  // Click Upload
  await page.getByRole('button', { name: 'Upload' }).click();

  // Verify the upload succeeded
  await expect(page.getByText('File Uploaded!')).toBeVisible();
});