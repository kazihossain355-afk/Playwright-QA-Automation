import { test, expect } from '@playwright/test';

test('Integration - User service works with Article service', async ({ request }) => {
  const timestamp = Date.now();
  const username = `int${timestamp.toString().slice(-10)}`;
  const email = `${username}@example.com`;
  const password = 'Password123';

  // Module 1: User Service
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

  const registerBody = await registerResponse.json();
  const token = registerBody.user.token;

  expect(token).toBeTruthy();

  // Module 2: Article Service
  const articleResponse = await request.post(
    'https://conduit-api.bondaracademy.com/api/articles',
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Token ${token}`,
      },
      data: {
        article: {
          title: 'Integration Test Article',
          description: 'Testing User and Article services together',
          body: 'This article verifies integration between two services.',
          tagList: ['Integration', 'API', 'QA'],
        },
      },
    }
  );

  expect(articleResponse.status()).toBe(201);

  const articleBody = await articleResponse.json();

  expect(articleBody).toHaveProperty('article');
  expect(articleBody.article.title).toBe('Integration Test Article');

  console.log('User Service Status:', registerResponse.status());
  console.log('Article Service Status:', articleResponse.status());
  console.log('Article:', articleBody.article);
});