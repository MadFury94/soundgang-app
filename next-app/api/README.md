# SoundGang API

Cloudflare Worker + D1 + R2 backend for the SoundGang website.

## Setup

```bash
cd soundgang-app/api
npm install
```

## Deploy

### 1. Run the database migration (creates all tables)
```bash
npm run db:migrate
```

### 2. Seed the database with initial data
```bash
npm run db:seed
```

### 3. Deploy the Worker
```bash
npm run deploy
```

After deploying, Wrangler will print your worker URL:
`https://soundgang-api.YOUR_SUBDOMAIN.workers.dev`

Copy that URL and update `soundgang-app/.env.local`:
```
NEXT_PUBLIC_API_URL=https://soundgang-api.YOUR_SUBDOMAIN.workers.dev
```

Also add it to your Cloudflare Pages environment variables.

## Local Development

```bash
# Run migrations locally first
npm run db:migrate:local
npm run db:seed:local

# Start local worker
npm run dev
```

Worker runs at http://localhost:8787

## R2 Public URL

Once you enable public access on the `soundgang-media` bucket:
1. Copy the public URL (e.g. `https://pub-xxxx.r2.dev`)
2. Update `wrangler.toml` → `R2_PUBLIC_URL`
3. Redeploy: `npm run deploy`

## Admin Secret (for uploads)

Set a secret for the upload endpoints:
```bash
wrangler secret put ADMIN_SECRET
```
Then use `Authorization: Bearer YOUR_SECRET` when calling `/api/upload/*`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| GET | /api/artists | All artists |
| GET | /api/artists/:slug | Single artist + releases |
| GET | /api/releases | All releases (add ?featured=true or ?limit=4) |
| GET | /api/releases/:slug | Single release + tracks |
| GET | /api/tracks | All tracks (for player queue) |
| GET | /api/events | All events (add ?featured=true) |
| GET | /api/blog | All posts (add ?featured=true or ?limit=3) |
| GET | /api/blog/:slug | Single post |
| GET | /api/videos | All videos |
| POST | /api/upload/audio | Upload audio to R2 (admin) |
| POST | /api/upload/image | Upload image to R2 (admin) |
