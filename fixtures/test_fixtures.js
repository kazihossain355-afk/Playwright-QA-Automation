import { test as base } from '@playwright/test';

export const test = base.extend({
  testMessage: async ({}, use) => {
    await use('Hello from my custom fixture');
  },
});