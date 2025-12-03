// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: [
    "@nuxthub/core",
    "@nuxt/eslint",
    "@nuxt/ui",
    "nuxt-mapbox",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
    "@vite-pwa/nuxt",
  ],

  // https://devtools.nuxt.com
  devtools: { enabled: true },

  // Env variables - https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens
  runtimeConfig: {},
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  compatibilityDate: "2025-03-01",

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {
    blob: true,
    workers: true,
    database: true,
    databaseMigrationsDirs: ["server/database/migrations/"],
    bindings: {
      observability: {
        logs: true,
      },
    },
  },
  nitro: {
    experimental: {
      websocket: true,
    },
  },
  css: ["~/assets/css/main.css", "~/assets/css/fonts.css"],
  mapbox: {
    accessToken: process.env.MAPBOX_API_KEY!,
  },

  // Development config
  eslint: {
    config: {
      stylistic: {
        quotes: "single",
        commaDangle: "never",
      },
    },
  },

  i18n: {
    defaultLocale: "ja",
    locales: [
      { code: "ja", name: "日本語", file: "ja.json" },
      { code: "en", name: "English", file: "en.json" },
    ],
  },

  // PWA Configuration
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'NPC Tracker',
      short_name: 'NPCTracker',
      description: 'Real-time location tracking application',
      theme_color: '#1c1917', // stone-900
      background_color: '#1c1917', // stone-900
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.mapbox\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'mapbox-tiles-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/.*\.tiles\.mapbox\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'mapbox-vector-tiles-cache',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
            }
          }
        }
      ]
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  }
});
