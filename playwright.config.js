//const { defineConfig, devices } = require('@playwright/test');
import { defineConfig, devices } from '@playwright/test';
import * as os from "node:os";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  testIgnore: 'template.*',
  outputDir: './reports/test-results',
  timeout: 60 * 1000,

  expect: {
    timeout: 5 * 1000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 2,
  workers: process.env.CI ? 1 : 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html-report/', open: 'never' }],
    ['@estruyf/github-actions-reporter'],
    ['monocart-reporter', {
      name: "My Test Report",
      outputFile: 'reports/monocart-report/index.html'
    }]
  ],
  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: true,
    testIdAttribute: 'id',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      testMatch: /.*\.test\.js/,
      use: { ...devices['Desktop Chrome'],
//        headless: !!process.env.CI,
      },
    },

    // {
    //   name: 'firefox',
    //   testMatch: /.*\.test\.js/,
    //   use: { ...devices['Desktop Firefox'],
    //     headless: !!process.env.CI,
    //   },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

