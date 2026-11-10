import { test } from '../fixtures/test_fixtures.js';
import { expect } from '@playwright/test';

test('Custom fixture demo', async ({ testMessage }) => {
  console.log(testMessage);

  expect(testMessage).toBe('Hello from my custom fixture');
});