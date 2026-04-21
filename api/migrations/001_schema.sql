-- SoundGang D1 Database Schema
-- Run: npm run db:migrate (remote) or npm run db:migrate:local (local dev)

-- ─── Artists ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS artists (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT    NOT NULL UNIQUE,
  name        TEXT    NOT NULL,
  genre       TEXT    NOT NULL DEFAULT '',
  bio         TEXT    NOT NULL DEFAULT '',
  short_bio   TEXT    NOT NULL DEFAULT '',
  location    TEXT    NOT NULL DEFAULT 'Lagos, Nigeria',
  image_url   TEXT    NOT NULL DEFAULT '',
  cover_url   TEXT    NOT NULL DEFAULT '',
  gradient    TEXT    NOT NULL DEFAULT 'from-gray-700 via-gray-800 to-black',
  featured    INTEGER NOT NULL DEFAULT 0,  -- 0 = false, 1 = true
  -- Stats
  stat_albums   INTEGER NOT NULL DEFAULT 0,
  stat_singles  INTEGER NOT NULL DEFAULT 0,
  stat_awards   INTEGER NOT NULL DEFAULT 0,
  stat_followers TEXT   NOT NULL DEFAULT '0',
  -- Social
  social_instagram TEXT NOT NULL DEFAULT '',
  social_twitter   TEXT NOT NULL DEFAULT '',
  social_youtube   TEXT NOT NULL DEFAULT '',
  social_spotify   TEXT NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Releases ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS releases (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  slug          TEXT    NOT NULL UNIQUE,
  title         TEXT    NOT NULL,
  artist        TEXT    NOT NULL,
  artist_slug   TEXT    NOT NULL,
  release_date  TEXT    NOT NULL DEFAULT '',
  type          TEXT    NOT NULL DEFAULT 'Single', -- Album | EP | Single | Compilation
  cover_url     TEXT    NOT NULL DEFAULT '',
  gradient      TEXT    NOT NULL DEFAULT 'from-gray-700 via-gray-800 to-black',
  track_count   INTEGER NOT NULL DEFAULT 1,
  stream_url    TEXT    NOT NULL DEFAULT '',
  spotify_url   TEXT    NOT NULL DEFAULT '',
  apple_url     TEXT    NOT NULL DEFAULT '',
  featured      INTEGER NOT NULL DEFAULT 0,
  description   TEXT    NOT NULL DEFAULT '',
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Tracks ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tracks (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  release_id   INTEGER NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  artist_id    INTEGER REFERENCES artists(id) ON DELETE SET NULL,
  title        TEXT    NOT NULL,
  duration     TEXT    NOT NULL DEFAULT '0:00',
  audio_url    TEXT    NOT NULL DEFAULT '', -- R2 URL or external URL
  featuring    TEXT    NOT NULL DEFAULT '',
  track_number INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Events ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT    NOT NULL UNIQUE,
  title       TEXT    NOT NULL,
  artist      TEXT    NOT NULL,
  artist_slug TEXT    NOT NULL,
  venue       TEXT    NOT NULL DEFAULT '',
  location    TEXT    NOT NULL DEFAULT '',
  event_date  TEXT    NOT NULL DEFAULT '', -- Display string e.g. "Dec 15, 2024"
  iso_date    TEXT    NOT NULL DEFAULT '', -- ISO for sorting e.g. "2024-12-15"
  event_time  TEXT    NOT NULL DEFAULT '',
  ticket_url  TEXT    NOT NULL DEFAULT '/contact',
  cover_url   TEXT    NOT NULL DEFAULT '',
  gradient    TEXT    NOT NULL DEFAULT 'from-gray-700 via-gray-800 to-black',
  featured    INTEGER NOT NULL DEFAULT 0,
  description TEXT    NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Blog Posts ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT    NOT NULL UNIQUE,
  title       TEXT    NOT NULL,
  excerpt     TEXT    NOT NULL DEFAULT '',
  content     TEXT    NOT NULL DEFAULT '',
  author      TEXT    NOT NULL DEFAULT 'SoundGang',
  category    TEXT    NOT NULL DEFAULT 'News',
  cover_url   TEXT    NOT NULL DEFAULT '',
  gradient    TEXT    NOT NULL DEFAULT 'from-gray-700 via-gray-800 to-black',
  featured    INTEGER NOT NULL DEFAULT 0,
  published   INTEGER NOT NULL DEFAULT 1,
  published_at TEXT   NOT NULL DEFAULT (datetime('now')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Videos ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS videos (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  title        TEXT    NOT NULL,
  artist       TEXT    NOT NULL,
  artist_slug  TEXT    NOT NULL DEFAULT '',
  youtube_id   TEXT    NOT NULL DEFAULT '',
  thumbnail    TEXT    NOT NULL DEFAULT '',
  video_date   TEXT    NOT NULL DEFAULT '',
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_artists_slug     ON artists(slug);
CREATE INDEX IF NOT EXISTS idx_artists_featured ON artists(featured);
CREATE INDEX IF NOT EXISTS idx_releases_slug    ON releases(slug);
CREATE INDEX IF NOT EXISTS idx_releases_featured ON releases(featured);
CREATE INDEX IF NOT EXISTS idx_tracks_release   ON tracks(release_id);
CREATE INDEX IF NOT EXISTS idx_events_iso_date  ON events(iso_date);
CREATE INDEX IF NOT EXISTS idx_blog_slug        ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published   ON blog_posts(published);
