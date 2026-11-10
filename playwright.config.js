import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  globalSetup: './auth_setup.js',

  reporter: [['html', { open: 'always' }]],

  use: {
    headless: false,
    video: 'on',
    slowMo: 500,
  },
});