import { test, expect } from '@playwright/test';

test('GET - Send and verify request headers', async ({ request }) => {

  // Send GET request with request headers
  const response = await request.get(
    'https://conduit-api.bondaracademy.com/api/tags',
    {
      headers: {
        'Accept': 'application/json',
      },
    }
  );

  // Verify status code
  expect(response.status()).toBe(200);

  // Verify response content type
  expect(response.headers()['content-type'])
    .toContain('application/json');

  // Get response body
  const responseBody = await response.json();

  // Verify response body
  expect(responseBody).toHaveProperty('tags');
  expect(Array.isArray(responseBody.tags)).toBe(true);

  console.log('Status:', response.status());
  console.log('Response Headers:', response.headers());
  console.log('Response Body:', responseBody);
});