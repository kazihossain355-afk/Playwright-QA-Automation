import { test, expect } from '@playwright/test';

test('POST - Create a new article', async ({ request }) => {
  const timestamp = Date.now();
  const username = `pwtest${timestamp}`;
  const email = `${username}@example.com`;
  const password = 'Password123';

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

  expect(registerResponse.status()).toBe(201);

  const authBody = await registerResponse.json();
  const token = authBody.user.token;

  expect(token).toBeTruthy();

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
          title: 'Playwright API Test',
          description: 'Testing POST request with Playwright',
          body: 'This article was created by an automated API test.',
          tagList: ['Playwright', 'API', 'QA'],
        },
      },
    }
  );

  expect(response.status()).toBe(201);

  const responseBody = await response.json();

  expect(responseBody).toHaveProperty('article');
  expect(responseBody.article.title).toBe('Playwright API Test');

  console.log('Status:', response.status());
  console.log('Response Body:', responseBody);
});