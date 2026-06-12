import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Lokale Einzeldatei-Version (npm run build:lokal):
 * baut die App so, dass sie per Doppelklick direkt im Browser läuft (file://).
 * Daher: relative Basis, alles inline (siehe scripts/baue-lokal.mjs),
 * kein Service Worker — der PWA-Hook wird durch einen Stub ersetzt.
 * Die GitHub-Pages-Version (vite.config.ts) bleibt davon unberührt.
 */
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'virtual:pwa-register/react': fileURLToPath(
        new URL('./src/pwaStub.ts', import.meta.url),
      ),
    },
  },
  build: {
    outDir: 'lokal',
    assetsInlineLimit: 100_000_000, // Schriften & Bilder als Daten-URLs einbetten
    cssCodeSplit: false,
    rollupOptions: { output: { inlineDynamicImports: true } }, // ein einziges JS
  },
})
