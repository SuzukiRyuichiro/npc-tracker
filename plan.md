# NPC Tracker Admin Location Broadcasting - Implementation Plan

## Project Goal

Create an app where a single admin user (with a secret password) can share their real-time location, which is then broadcast to all non-admin users viewing the map.

## 1. Authentication System Options

### Option A: Simple Password + HTTP-Only Cookie Session (Recommended)

**How it works:**
- Store a single hashed password in `.env` (e.g., `ADMIN_PASSWORD_HASH`)
- Create `/api/auth/login` endpoint that validates password and sets a secure httpOnly cookie
- Use Nuxt middleware to protect admin routes/features
- No database needed - just validate the cookie on each request

**Pros:**
- Simple to implement, no external dependencies
- Secure (httpOnly cookie = no XSS attacks)
- Works great with Cloudflare Workers
- No session storage needed

**Implementation:**
```
POST /api/auth/login { password }
→ validates against hash
→ sets httpOnly cookie with signed token
→ returns { isAdmin: true }
```

### Option B: Use `nuxt-auth-utils` (Modern, Simple)

**How it works:**
- `nuxt-auth-utils` is actively maintained for Nuxt 3 (not the old @nuxtjs/auth-next)
- Provides `useUserSession()` composable
- Handles httpOnly cookies and session management automatically
- Still lets you do simple password auth

**Pros:**
- Battle-tested session management
- Built-in helpers for auth state
- Still simple - no OAuth complexity needed

### Option C: HTTP Basic Auth (Simplest but Limited)

**How it works:**
- Browser's native basic auth dialog
- Middleware checks `Authorization` header
- No cookies, no sessions

**Pros:**
- Zero code for auth UI
- Extremely simple

**Cons:**
- Poor UX (browser dialog)
- Credentials sent with every request (fine over HTTPS)
- Can't easily "log out"

**Recommendation:** Go with **Option A** (DIY cookie session) or **Option B** (nuxt-auth-utils). Both are simple and appropriate for this use case.

---

## 2. Handling Multiple Simultaneous Admin Logins

### Option A: Last Writer Wins (Simplest)

**How it works:**
- Anyone with admin password can broadcast
- The most recent location broadcast becomes the "truth"
- WebSocket simply broadcasts whatever it receives from any admin

**Pros:**
- Zero extra logic needed
- Works with existing WebSocket setup

**Cons:**
- Could have conflicting locations if two admins broadcast simultaneously

### Option B: Single Active Session with Lock (Recommended)

**How it works:**
- Generate unique session ID on admin login
- Store "active broadcaster session ID" in NuxtHub KV or server memory
- Before broadcasting location:
  ```
  if (currentSessionId !== activeSessionId) {
    return { error: "Another admin is broadcasting" }
  }
  ```
- When admin starts location sharing, they claim the lock
- Other admins see: "Someone else is currently broadcasting"

**Implementation pattern:**
```typescript
// Store in KV or module-level variable
let activeBroadcasterSessionId = null;

// When admin wants to start broadcasting:
POST /api/admin/claim-broadcaster
→ sets activeBroadcasterSessionId = sessionId
→ returns success

// In WebSocket handler:
if (peer.isAdmin && peer.sessionId === activeBroadcasterSessionId) {
  peer.publish("location", message)
}
```

**Pros:**
- Prevents conflicts
- Clear ownership
- Can show UI feedback to admins

### Option C: Time-based Auto-release

**Enhancement to Option B:**
- Active session expires after 5 minutes of no location updates
- Allows automatic failover if admin closes browser
- Prevents "stuck" locks

**Recommendation:** Go with **Option B** (single active session with lock), possibly with **Option C** (time-based release) as an enhancement.

---

## Architecture Summary

### Recommended Flow

1. Admin visits site → Login page (if not authenticated)
2. Admin enters password → Sets httpOnly cookie with session ID
3. Admin enables location sharing → Claims broadcaster lock
4. Browser geolocation API → sends to WebSocket with session ID
5. Server validates session + broadcaster lock → broadcasts to all clients
6. Non-admin users just view the map → no auth needed

### Key Implementation Points

- Use `navigator.geolocation.watchPosition()` on client to track admin location
- Send location updates through WebSocket (already have this!)
- Add session ID to WebSocket messages for validation
- Store active broadcaster session in KV or server state
- Non-admin clients just subscribe, never publish

---

## Implementation Steps

### Phase 1: Authentication
1. Choose auth approach (Option A or B)
2. Create login page/component
3. Implement `/api/auth/login` endpoint
4. Set up session validation middleware
5. Create `/api/auth/logout` endpoint
6. Add auth state to app (composable or middleware)

### Phase 2: Admin Location Broadcasting
1. Create admin dashboard/control page
2. Implement "Start Broadcasting" button
3. Create `/api/admin/claim-broadcaster` endpoint
4. Implement browser geolocation tracking with `watchPosition()`
5. Send location updates through WebSocket with session validation

### Phase 3: WebSocket Update
1. Update WebSocket handler to validate admin session
2. Check broadcaster lock before publishing
3. Implement broadcaster lock in KV or server memory
4. Add time-based auto-release mechanism (optional)

### Phase 4: Client Map Updates
1. Non-admin clients auto-connect to WebSocket
2. Listen for location broadcasts
3. Update marker on map with new coordinates
4. Handle disconnection/reconnection gracefully

### Phase 5: Polish
1. Add UI feedback for admin (broadcasting status)
2. Add UI feedback for viewers (admin online/offline)
3. Error handling and edge cases
4. Testing with multiple users
