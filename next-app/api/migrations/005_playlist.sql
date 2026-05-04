-- Migration 005: Playlists and playlist_tracks tables
-- Additive only — no DROP or RENAME statements

-- ─── playlists ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS playlists (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL DEFAULT 'default',
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── playlist_tracks ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS playlist_tracks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  playlist_id INTEGER NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  track_id    INTEGER NOT NULL REFERENCES tracks(id)    ON DELETE CASCADE,
  position    INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist ON playlist_tracks(playlist_id, position);

-- ─── Seed default playlist ────────────────────────────────────────────────────
INSERT OR IGNORE INTO playlists (id, name) VALUES (1, 'default');
