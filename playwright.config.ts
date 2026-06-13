import { defineConfig, devices } from '@playwright/test'

/**
 * E2E-Smoke-Tests (docs/TODO.md): klicken die kritischen Pfade einmal komplett durch.
 * Läuft gegen `vite preview` (Port 4173, Basis /badminton/) — vorher `npm run build`.
 *
 * Isolation: Playwright gibt jedem Test einen frischen Browser-Kontext,
 * localStorage ist also automatisch leer — kein manuelles Aufräumen nötig.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? 'list' : [['list'], ['html', { open: 'never' }]],
  timeout: 90_000,
  expect: { timeout: 10_000 },

  use: {
    // Trailing Slash ist wichtig, damit relative Ziele ('./#/route') funktionieren
    baseURL: 'http://localhost:4173/badminton/',
    locale: 'de-DE',
    // Service Worker (PWA-Precache) würde nur Caching-Rauschen in die Tests bringen
    serviceWorkers: 'block',
    trace: 'on-first-retry',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173/badminton/',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
