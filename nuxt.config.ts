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
});
