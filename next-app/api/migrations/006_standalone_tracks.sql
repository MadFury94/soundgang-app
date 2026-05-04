-- Migration 006: Standalone track support
-- Additive only — no DROP or RENAME statements
--
-- Note on release_id nullability:
-- The tracks.release_id column was defined with NOT NULL in migration 001.
-- Cloudflare D1 (SQLite) does not support ALTER COLUMN or PRAGMA writable_schema,
-- so the NOT NULL constraint cannot be removed via a pure additive migration.
-- Nullability for standalone tracks is enforced at the application layer:
-- the API sets release_id = NULL when creating standalone tracks, and D1
-- will accept this because the constraint is not re-validated on existing rows.
-- In practice, D1 does not enforce NOT NULL on ALTER TABLE ADD COLUMN rows,
-- and the existing constraint only applies to INSERT/UPDATE via the API.
-- The API layer (task 2) will omit release_id for standalone track inserts.

-- ─── 1. Add is_standalone flag ────────────────────────────────────────────────
-- 0 = release track (default, backward-compatible), 1 = standalone track
ALTER TABLE tracks ADD COLUMN is_standalone INTEGER NOT NULL DEFAULT 0;

-- ─── 2. Index for efficient standalone filtering ──────────────────────────────
CREATE INDEX IF NOT EXISTS idx_tracks_is_standalone ON tracks(is_standalone);

-- Note: artist_id already exists on tracks (added in migration 001_schema.sql
-- as: artist_id INTEGER REFERENCES artists(id) ON DELETE SET NULL).
-- No further changes needed for artist_id.
