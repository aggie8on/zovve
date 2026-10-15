import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['pwa-192.svg', 'pwa-512.svg'],
      manifest: {
        "id": "/",
        "name": "Zovve",
        "short_name": "Zovve",
        "description": "One place to connect with your team.",
        "start_url": "/",
        "scope": "/",
        "display": "standalone",
        "background_color": "#f7f8fb",
        "theme_color": "#1f6feb",
        "orientation": "any",
        "icons": [
          { "src": "/pwa-192.svg", "sizes": "192x192", "type": "image/svg+xml", "purpose": "any" },
          { "src": "/pwa-512.svg", "sizes": "512x512", "type": "image/svg+xml", "purpose": "any maskable" }
        ]
      },
      workbox: {
        // Only built static assets are precached. Supabase requests and private
        // team data are intentionally left out of the service-worker cache.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
      },
    }),
  ],
})