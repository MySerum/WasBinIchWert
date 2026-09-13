import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/ui',
  fullyParallel: false,
  workers: 1,
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      // Absorb small Linux runner font-rasterization differences while still
      // detecting material changes to controls, spacing and component layout.
      maxDiffPixelRatio: 0.03,
    },
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-iphone', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
    { name: 'mobile-android', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'node tests/static-server.mjs',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
  },
});
