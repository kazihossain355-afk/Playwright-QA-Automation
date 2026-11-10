import { test, expect } from '@playwright/test';

test('API Authentication - Valid token', async ({ request }) => {

  // Generate unique test user
  const timestamp = Date.now();
  const username = `auth${timestamp.toString().slice(-10)}`;
  const email = `${username}@example.com`;
  const password = 'Password123';

  // Register user
  const registerResponse = await request.post(
    'https://conduit-api.bondaracademy.com/api/users',
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      data: {
        user: {
          username,
          email,
          password,
        },
      },
    }
  );

  // Verify registration
  console.log('Registration status:', registerResponse.status());
  console.log('Registration response:', await registerResponse.json());
  expect(registerResponse.status()).toBe(201);

  // Extract authentication token
  const registerBody = await registerResponse.json();
  const token = registerBody.user.token;

  expect(token).toBeTruthy();

  // Send protected API request with valid token
  const response = await request.post(
    'https://conduit-api.bondaracademy.com/api/articles',
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Token ${token}`,
      },
      data: {
        article: {
          title: 'Authentication Test',
          description: 'Testing valid API authentication',
          body: 'This article verifies valid token authentication.',
          tagList: ['API', 'Auth'],
        },
      },
    }
  );

  // Verify authenticated request succeeds
  expect(response.status()).toBe(201);

  console.log('Valid token status:', response.status());
});