import { defineConfig, devices } from '@playwright/test';

export const BASE_URL = 'https://opensource-demo.orangehrmlive.com';
export const AUTH_STATE = '.auth/state.json';

/**
 * Shared public demo: run serially (workers: 1) so our own tests cannot
 * perturb each other's feed state (e.g. TC-008's Like changing TC-004's sort),
 * and never retry — a retry would hide a flaky or genuine failure.
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['json', { outputFile: 'reports/results.json' }],
    ['html', { outputFolder: 'reports/playwright-html', open: 'never' }],
  ],
  use: {
    baseURL: BASE_URL,
    viewport: { width: 1440, height: 1000 },
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    // Traces stay off: a trace records fill() arguments, and the setup project
    // types the demo credentials. Screenshots are the failure evidence instead.
    trace: 'off',
    video: 'off',
  },
  projects: [
    {
      name: 'setup',
      testDir: './utils',
      testMatch: /auth\.setup\.ts/,
      use: { screenshot: 'off' },
    },
    {
      name: 'buzz',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 }, storageState: AUTH_STATE },
    },
  ],
});
