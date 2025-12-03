# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NPC Tracker is a Nuxt 3 application deployed on Cloudflare Workers Edge using NuxtHub. The application features real-time location tracking and visualization using Mapbox, WebSocket communication, and Cloudflare's distributed infrastructure.

## Development Commands

### Package Manager

The lockfile is `bun.lock` and use bun to build.

### Common Commands

- `bun dev` - Start development server on http://localhost:3000
- `bun run build` - Build for production
- `bun run deploy` - Deploy to Cloudflare via NuxtHub, but the commit on main would make Github actions automatically deploy

### Database Commands

- `bun run db:generate` - Generate Drizzle migrations from schema changes
- Migrations are stored in `server/database/migrations/`
- NuxtHub automatically runs migrations on deployment

## Architecture

### Frontend Structure (`app/`)

- **Pages**: Auto-routed pages in `app/pages/`
  - `index.vue` - Main page with map/file upload toggle
  - `visitors.client.vue` - WebSocket demo page (client-only)
- **Components**: Reusable Vue components in `app/components/`
  - `Map.vue` - Mapbox integration with real-time marker animation
- **Plugins**: `app/plugins/location.server.ts` - Server plugin that extracts Cloudflare location data from request context

### Backend Structure (`server/`)

- **API Routes**: `server/api/`
  - `location.ts` - WebSocket handler for real-time location broadcasting using publish/subscribe pattern
  - `routes.get.ts` - Blob storage listing endpoint
  - `ping.ts` - Health check endpoint
- **Database**: `server/database/`
  - `schema.ts` - Drizzle ORM schema definitions (currently has a `posts` table)
  - `migrations/` - Drizzle-generated SQL migrations

### Key Technologies

**NuxtHub Integration**:

- Enables Cloudflare Workers, Blob storage, and D1 database
- Database migrations automatically run from `server/database/migrations/`
- Access to Cloudflare request context (e.g., `event.context.cf.latitude`)

**WebSocket Communication**:

- Enabled via `nitro.experimental.websocket: true` in nuxt.config.ts
- Use `defineWebSocketHandler()` for server-side WebSocket endpoints
- Client uses `@vueuse/core` `useWebSocket()` composable
- Pattern: Publish/subscribe with `peer.subscribe()` and `peer.publish()`

**Mapbox Integration**:

- Configured via `nuxt-mapbox` module
- Requires `MAPBOX_API_KEY` environment variable
- MapboxMap component with theme switching (dark/light via @nuxtjs/color-mode)
- Custom marker animation with easing functions for smooth transitions

**Database (Drizzle ORM)**:

- SQLite dialect (Cloudflare D1)
- Schema defined in TypeScript: `server/database/schema.ts`
- Generate migrations: `pnpm db:generate`
- NuxtHub handles migration application automatically

### State Management

- Uses Nuxt 3's `useState()` for shared state (e.g., location data from server plugin)
- Server plugin `location.server.ts` initializes state with Cloudflare geolocation data

### Styling

- Custom CSS in `app/assets/css/main.css` and `app/assets/css/fonts.css`
- Uses Nuxt UI (@nuxt/ui) component library
- Color mode support (dark/light) via @nuxtjs/color-mode
- Custom animations defined in component `<style>` sections (e.g., ping animation in Map.vue)

## Configuration

### Environment Variables

- `MAPBOX_API_KEY` - Required for Mapbox functionality
- See `.env.example` for template

### TypeScript

- Strict mode enabled
- Separate tsconfig for server (`server/tsconfig.json`)
- **Import Aliases**: Use `~~/` for imports from project root (e.g., `~~/server/database/schema`)

## Important Patterns

### Real-time Location Updates

The app demonstrates a pattern where:

1. Server plugin captures Cloudflare geolocation on SSR
2. Client connects via WebSocket to `/api/location`
3. Location updates are broadcast to all connected clients
4. Mapbox marker animates smoothly between positions using easing functions

### Client-Only Pages

Pages suffixed with `.client.vue` (like `visitors.client.vue`) only render on the client, useful for WebSocket demos and features requiring browser APIs.

### Cloudflare Context Access

Access Cloudflare request data via `event.context.cf` in server routes and plugins (latitude, longitude, country, etc.).
