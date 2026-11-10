import { test, expect } from '@playwright/test';

test('API CRUD - Create, Read, Update, Delete', async ({ request }) => {

  // Create a unique test user
  const timestamp = Date.now();
  const username = `pwtest${timestamp}`;
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

  expect(registerResponse.status()).toBe(201);

  // Extract authentication token
  const registerBody = await registerResponse.json();
  const token = registerBody.user.token;

  expect(token).toBeTruthy();

  // CREATE - POST
  const createResponse = await request.post(
    'https://conduit-api.bondaracademy.com/api/articles',
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Token ${token}`,
      },
      data: {
        article: {
          title: 'CRUD API Test',
          description: 'Testing CRUD operations with Playwright',
          body: 'This article is created for API CRUD testing.',
          tagList: ['Playwright', 'API', 'CRUD'],
        },
      },
    }
  );

  expect(createResponse.status()).toBe(201);

  const createBody = await createResponse.json();

  expect(createBody).toHaveProperty('article');

  const slug = createBody.article.slug;

  expect(slug).toBeTruthy();

  console.log('Created article slug:', slug);

  // READ - GET
  const getResponse = await request.get(
    `https://conduit-api.bondaracademy.com/api/articles/${slug}`,
    {
      headers: {
        'Accept': 'application/json',
      },
    }
  );

  expect(getResponse.status()).toBe(200);

  const getBody = await getResponse.json();

  expect(getBody.article.title).toBe('CRUD API Test');

  console.log('GET article:', getBody.article);

  // UPDATE - PUT
  const updateResponse = await request.put(
    `https://conduit-api.bondaracademy.com/api/articles/${slug}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Token ${token}`,
      },
      data: {
        article: {
          title: 'Updated CRUD API Test',
          description: 'Updated description',
          body: 'This article has been updated.',
        },
      },
    }
  );

  expect(updateResponse.status()).toBe(200);

  const updateBody = await updateResponse.json();

  expect(updateBody).toHaveProperty('article');
  expect(updateBody.article.title).toBe('Updated CRUD API Test');

  // Capture new slug
  const updatedSlug = updateBody.article.slug;

  expect(updatedSlug).toBeTruthy();

  console.log('Updated article:', updateBody.article);
  console.log('Updated slug:', updatedSlug);

  // READ - GET AFTER UPDATE
  const verifyUpdateResponse = await request.get(
    `https://conduit-api.bondaracademy.com/api/articles/${updatedSlug}`,
    {
      headers: {
        'Accept': 'application/json',
      },
    }
  );

  expect(verifyUpdateResponse.status()).toBe(200);

  const verifyUpdateBody = await verifyUpdateResponse.json();

  expect(verifyUpdateBody.article.title).toBe('Updated CRUD API Test');

  // DELETE
  const deleteResponse = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${updatedSlug}`,
    {
      headers: {
        'Accept': 'application/json',
        Authorization: `Token ${token}`,
      },
    }
  );

  expect([200, 204]).toContain(deleteResponse.status());

  console.log('Delete status:', deleteResponse.status());

  // READ AFTER DELETE
  const verifyDeleteResponse = await request.get(
    `https://conduit-api.bondaracademy.com/api/articles/${updatedSlug}`,
    {
      headers: {
        'Accept': 'application/json',
      },
    }
  );

  expect(verifyDeleteResponse.status()).toBe(404);

  console.log('Verified article was deleted.');
});