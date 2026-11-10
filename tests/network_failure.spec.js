import { test, expect } from '@playwright/test';

test('Network Failure - Simulate HTTP 500 error', async ({ page }) => {

  // Intercept the API request and return a server error
  await page.route(
    'https://jsonplaceholder.typicode.com/todos/1',
    async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error',
        }),
      });
    }
  );

  const response = await page.goto(
    'https://jsonplaceholder.typicode.com/todos/1'
  );

  expect(response.status()).toBe(500);

  console.log('Simulated Status:', response.status());
});

// Why Network Failure Testing?
// To verify how the application behaves when the backend or network fails.