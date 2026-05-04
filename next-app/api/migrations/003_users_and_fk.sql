-- Migration 003: Users table and artist_id FK columns
-- Additive only — no DROP or RENAME statements

-- ─── 1. Users table ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  role          TEXT    NOT NULL DEFAULT 'artist', -- 'admin' | 'artist'
  artist_id     INTEGER REFERENCES artists(id) ON DELETE SET NULL,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── 2. Add artist_id FK columns to content tables ───────────────────────────
ALTER TABLE releases   ADD COLUMN artist_id INTEGER REFERENCES artists(id) ON DELETE SET NULL;
ALTER TABLE events     ADD COLUMN artist_id INTEGER REFERENCES artists(id) ON DELETE SET NULL;
ALTER TABLE blog_posts ADD COLUMN artist_id INTEGER REFERENCES artists(id) ON DELETE SET NULL;
ALTER TABLE videos     ADD COLUMN artist_id INTEGER REFERENCES artists(id) ON DELETE SET NULL;

-- ─── 3. Backfill artist_id from artist_slug ───────────────────────────────────
-- Rows where artist_slug does not match any artist will silently get artist_id = NULL
UPDATE releases
  SET artist_id = (SELECT id FROM artists WHERE slug = releases.artist_slug)
  WHERE artist_slug != '';

UPDATE events
  SET artist_id = (SELECT id FROM artists WHERE slug = events.artist_slug)
  WHERE artist_slug != '';

UPDATE videos
  SET artist_id = (SELECT id FROM artists WHERE slug = videos.artist_slug)
  WHERE artist_slug != '';

-- blog_posts has no artist_slug column — artist_id remains NULL for all existing posts

-- ─── 4. Indexes ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_releases_artist_id ON releases(artist_id);
CREATE INDEX IF NOT EXISTS idx_events_artist_id   ON events(artist_id);
CREATE INDEX IF NOT EXISTS idx_blog_artist_id     ON blog_posts(artist_id);
CREATE INDEX IF NOT EXISTS idx_videos_artist_id   ON videos(artist_id);

-- Unique index on email (enforces no duplicate accounts)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email  ON users(email);

-- Partial unique index: enforces one-to-one artist-user at DB level
-- while allowing multiple users with artist_id = NULL
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_artist ON users(artist_id) WHERE artist_id IS NOT NULL;
