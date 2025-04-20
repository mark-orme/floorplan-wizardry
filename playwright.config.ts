import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  retries: process.env.CI ? 2 : 0,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['json', { 
      outputFile: 'playwright-report/accessibility-violations.json',
      includeTestCases: true,
      includeAttachments: true
    }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['html', { open: 'never', outputFolder: 'reports/html' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:8080',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        contextOptions: {
          logger: {
            isEnabled: (name, severity) => true,
            log: (name, severity, message, args) => {
              if (name === 'Browser.accessibility') {
                console.log(`[Accessibility] ${message}`);
              }
            }
          }
        }
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
  },
});
