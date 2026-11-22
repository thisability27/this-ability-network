import { defineConfig } from '@playwright/test';

const baseURL = 'http://127.0.0.1:8776';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: {
    baseURL,
    browserName: 'chromium',
    launchOptions: { executablePath: process.env.TAO_CHROME_PATH },
    reducedMotion: 'reduce',
  },
  webServer: {
    command: 'hugo --panicOnWarning --destination public && python3 -m http.server 8776 --bind 127.0.0.1 --directory public',
    url: baseURL,
    timeout: 60_000,
    stderr: 'ignore',
  },
});
