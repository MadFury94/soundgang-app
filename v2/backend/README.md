# SoundGang API v2 - Hono.js Backend

A modern, lightweight API built with Hono.js running on Cloudflare Workers.

## ✅ Setup Complete

All dependencies installed and configured:
- ✅ Hono.js 4.12.16
- ✅ Cloudflare Workers types
- ✅ D1 database connected (`soundgang-db`)
- ✅ R2 bucket connected (`soundgang-media`)
- ✅ TypeScript configured
- ✅ All API endpoints implemented

## Quick Start

```bash
# Install dependencies
pnpm install

# Run local dev server
pnpm dev

# Deploy to Cloudflare
pnpm deploy

# Generate types
pnpm run cf-typegen
```

## API Endpoints (All Implemented!)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/artists` | All artists |
| GET | `/api/artists/:slug` | Artist details + releases |
| GET | `/api/releases?limit=4&featured=true` | Releases with filters |
| GET | `/api/releases/:slug` | Release details + tracks |
| GET | `/api/tracks` | All tracks |
| GET | `/api/events?featured=true` | Events with filters |
| GET | `/api/blog?limit=3&featured=true` | Blog posts with filters |
| GET | `/api/blog/:slug` | Single blog post |
| GET | `/api/videos` | All videos |

## Test It

```bash
# Run dev server
pnpm dev

# Test endpoints
curl http://localhost:8787/api/health
curl http://localhost:8787/api/artists
curl http://localhost:8787/api/releases?limit=4
```

## Why Hono vs Old API?

**Old API** (next-app/api): 1,112 lines, manual routing
**New API** (v2/backend): 182 lines, clean Hono routes

- ✅ 84% less code
- ✅ Better TypeScript support
- ✅ Built-in middleware (CORS, error handling)
- ✅ Easier to maintain and extend
