import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/FriendsTime/',
  plugins: [
    tailwindcss(),
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      includeAssets: ['favicon.ico', 'favicon.svg', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'FriendsTime',
        short_name: 'FriendsTime',
        description: 'A world clock app for your friends',
        display: 'standalone',
        start_url: '/FriendsTime/', // Explicit start URL
        scope: '/FriendsTime/', // Important for GitHub Pages
        background_color: '#ffffff',
        theme_color: '#3eaf7c',
        icons: [
          {
            src: '/FriendsTime/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/FriendsTime/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        screenshots: [
          {
            src: '/FriendsTime/screenshot-mobile.png',
            sizes: '836x1438',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Mobile view of FriendsTime',
          },
          {
            src: '/FriendsTime/screenshot-desktop.png',
            sizes: '2372x1436',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Desktop view of FriendsTime',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        globIgnores: ['**/node_modules/**/*'],
        navigateFallback: '/FriendsTime/index.html', // Explicit fallback
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
})
