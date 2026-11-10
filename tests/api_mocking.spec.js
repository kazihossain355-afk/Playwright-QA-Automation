import { test, expect } from '@playwright/test';

test('API Mocking - Replace real API response', async ({ page }) => {
  await page.route('https://jsonplaceholder.typicode.com/todos/1', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        userId: 999,
        id: 1,
        title: 'Mocked Todo',
        completed: true,
      }),
    });
  });

  const response = await page.goto(
    'https://jsonplaceholder.typicode.com/todos/1'
  );

  const responseBody = await response.json();

  expect(responseBody.title).toBe('Mocked Todo');
  expect(responseBody.userId).toBe(999);
  expect(responseBody.completed).toBe(true);

  console.log('Mocked Response:', responseBody);
});

// API Mocking:
// We mock an API response when we want to control the data returned to the UI.
// This allows us to test UI behavior without depending on the real backend.