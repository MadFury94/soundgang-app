-- ─── Seed Admin User ──────────────────────────────────────────────────────────
-- Default credentials:
--   Email:    admin@soundgang.ng
--   Password: SoundGang2024!
--
-- IMPORTANT: Change the password after first login.
-- To generate a new hash: node -e "require('bcryptjs').hash('newpassword', 10).then(console.log)"

INSERT OR IGNORE INTO users (email, password_hash, role, artist_id)
VALUES (
  'admin@soundgang.ng',
  '$2b$10$sODMevTEC8V3n/tggBSZMOIPBtikvg.jga.stZB4VXMm67cWjRbRW',
  'admin',
  NULL
);
