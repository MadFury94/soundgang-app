import { Hono } from 'hono'
import { cors } from 'hono/cors'

// Type definitions for Cloudflare bindings
type Bindings = CloudflareBindings & {
  DB: D1Database
  MEDIA: R2Bucket
  R2_PUBLIC_URL: string
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS middleware
app.use('/*', cors())

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Artists endpoints
app.get('/api/artists', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM artists ORDER BY featured DESC, name ASC'
  ).all()

  return c.json(results)
})

app.get('/api/artists/:slug', async (c) => {
  const slug = c.req.param('slug')

  const artist = await c.env.DB.prepare(
    'SELECT * FROM artists WHERE slug = ?'
  ).bind(slug).first()

  if (!artist) {
    return c.json({ error: 'Artist not found' }, 404)
  }

  // Get artist's releases
  const { results: releases } = await c.env.DB.prepare(
    'SELECT * FROM releases WHERE artist_slug = ? ORDER BY release_date DESC'
  ).bind(slug).all()

  return c.json({
    ...artist,
    releases
  })
})

// Releases endpoints
app.get('/api/releases', async (c) => {
  const limit = c.req.query('limit')
  const featured = c.req.query('featured')

  let query = 'SELECT * FROM releases'
  const params: any[] = []

  if (featured === 'true') {
    query += ' WHERE featured = 1'
  }

  query += ' ORDER BY release_date DESC'

  if (limit) {
    query += ' LIMIT ?'
    params.push(parseInt(limit))
  }

  const { results } = await c.env.DB.prepare(query).bind(...params).all()

  return c.json(results)
})

app.get('/api/releases/:slug', async (c) => {
  const slug = c.req.param('slug')

  const release = await c.env.DB.prepare(
    'SELECT * FROM releases WHERE slug = ?'
  ).bind(slug).first()

  if (!release) {
    return c.json({ error: 'Release not found' }, 404)
  }

  // Get tracks
  const { results: tracks } = await c.env.DB.prepare(
    'SELECT * FROM tracks WHERE release_id = ? ORDER BY track_number ASC'
  ).bind(release.id).all()

  return c.json({
    ...release,
    tracks
  })
})

// Events endpoints
app.get('/api/events', async (c) => {
  const featured = c.req.query('featured')

  let query = 'SELECT * FROM events'
  if (featured === 'true') {
    query += ' WHERE featured = 1'
  }
  query += ' ORDER BY iso_date ASC'

  const { results } = await c.env.DB.prepare(query).all()

  return c.json(results)
})

// Blog endpoints
app.get('/api/blog', async (c) => {
  const limit = c.req.query('limit')
  const featured = c.req.query('featured')

  let query = 'SELECT * FROM blog_posts WHERE published = 1'
  const params: any[] = []

  if (featured === 'true') {
    query += ' AND featured = 1'
  }

  query += ' ORDER BY published_at DESC'

  if (limit) {
    query += ' LIMIT ?'
    params.push(parseInt(limit))
  }

  const { results } = await c.env.DB.prepare(query).bind(...params).all()

  return c.json(results)
})

app.get('/api/blog/:slug', async (c) => {
  const slug = c.req.param('slug')

  const post = await c.env.DB.prepare(
    'SELECT * FROM blog_posts WHERE slug = ? AND published = 1'
  ).bind(slug).first()

  if (!post) {
    return c.json({ error: 'Post not found' }, 404)
  }

  return c.json(post)
})

// Videos endpoints
app.get('/api/videos', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM videos ORDER BY created_at DESC'
  ).all()

  return c.json(results)
})

// Tracks endpoints
app.get('/api/tracks', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM tracks ORDER BY created_at DESC'
  ).all()

  return c.json(results)
})

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error(`Error: ${err}`)
  return c.json({ error: 'Internal server error' }, 500)
})

export default app
