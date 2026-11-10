import { test, expect } from '@playwright/test';

test('GET - Verify tags API', async ({ request }) => {

  // Send GET request
  const startTime = Date.now();

  const response = await request.get(
    'https://conduit-api.bondaracademy.com/api/tags'
  );

  const responseTime = Date.now() - startTime;

  // Get response body
  const responseBody = await response.json();

  // Verify status code
  expect(response.status()).toBe(200);
  // Verify every tag is a string

  for (const tag of responseBody.tags) {
  expect(typeof tag).toBe('string');
}

  // Verify response header
  expect(response.headers()['content-type'])
    .toContain('application/json');

  // Verify response body
  expect(responseBody).toHaveProperty('tags');
  expect(Array.isArray(responseBody.tags)).toBe(true);

  // Verify expected data
  expect(responseBody.tags.length).toBeGreaterThan(0);

  // Verify response time
  expect(responseTime).toBeLessThan(2000);

  console.log('Status:', response.status());
  console.log('Headers:', response.headers());
  console.log('Response Body:', responseBody);
  console.log('Response Time:', responseTime, 'ms');
});