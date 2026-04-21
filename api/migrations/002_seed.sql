-- SoundGang Seed Data
-- Migrated from lib/data/*.ts static stores
-- Run: npm run db:seed (remote) or npm run db:seed:local (local dev)

-- ─── Artists ──────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO artists (slug, name, genre, bio, short_bio, image_url, cover_url, gradient, featured, stat_albums, stat_singles, stat_awards, stat_followers, social_instagram, social_twitter, social_youtube, social_spotify)
VALUES
  ('multilord', 'Multilord', 'Afrobeats',
   'Multilord is a rising star in the Nigerian music scene, known for his unique blend of Afrobeats and contemporary sounds. His music resonates with a generation that appreciates both tradition and innovation.',
   'Rising star in the Nigerian music scene',
   'https://res.cloudinary.com/dqwfjxn8g/image/upload/v1776777969/2626_gl8jjo.jpg',
   'https://res.cloudinary.com/dqwfjxn8g/image/upload/v1776777969/2626_gl8jjo.jpg',
   'from-orange-600 via-red-500 to-pink-600', 1,
   3, 12, 4, '250K',
   'https://instagram.com/multilord', 'https://twitter.com/multilord',
   'https://youtube.com/@multilord', 'https://open.spotify.com/artist/multilord'),

  ('killa-vybz', 'Killa Vybz', 'Hip Hop',
   'Killa Vybz brings authentic Nigerian hip hop to the world, with hard-hitting bars and street-level storytelling that connects with fans across the continent.',
   'Bringing authentic Nigerian hip hop to the world',
   'https://res.cloudinary.com/dqwfjxn8g/image/upload/v1776778704/2148628992_vbzvem.jpg',
   'https://res.cloudinary.com/dqwfjxn8g/image/upload/v1776778704/2148628992_vbzvem.jpg',
   'from-gray-700 via-gray-600 to-gray-500', 1,
   2, 8, 2, '180K',
   'https://instagram.com/killavybz', 'https://twitter.com/killavybz',
   'https://youtube.com/@killavybz', 'https://open.spotify.com/artist/killavybz'),

  ('kirko-drillz', 'Kirko Drillz', 'Drill',
   'Pioneer of Nigerian drill music, Kirko Drillz has been at the forefront of bringing the drill sound to West Africa, creating a unique fusion that is entirely his own.',
   'Pioneer of Nigerian drill music',
   'https://res.cloudinary.com/dqwfjxn8g/image/upload/v1776778114/2151712079_unjyjz.jpg',
   'https://res.cloudinary.com/dqwfjxn8g/image/upload/v1776778114/2151712079_unjyjz.jpg',
   'from-indigo-600 via-purple-600 to-pink-600', 1,
   4, 20, 6, '320K',
   'https://instagram.com/kirkodrillz', 'https://twitter.com/kirkodrillz',
   'https://youtube.com/@kirkodrillz', 'https://open.spotify.com/artist/kirkodrillz');

-- ─── Releases ─────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO releases (slug, title, artist, artist_slug, release_date, type, cover_url, gradient, track_count, stream_url, featured, description)
VALUES
  ('solid-4-life', 'Solid 4 Life', 'SoundGang Compilation', 'soundgang',
   'December 2024', 'Album',
   'https://res.cloudinary.com/dqwfjxn8g/image/upload/v1776779214/2150639068_nikmvw.jpg',
   'from-cyan-500 via-blue-500 to-purple-500', 12,
   'https://wildstream.ng/solid-4-life', 1,
   'The definitive SoundGang compilation featuring all roster artists.'),

  ('mbaf', 'M.B.A.F', 'Multilord', 'multilord',
   'November 2024', 'Single', '', 'from-gray-400 via-orange-400 to-red-400', 1,
   'https://wildstream.ng/mbaf', 1,
   'Multilord''s latest single showcasing his signature Afrobeats sound.'),

  ('polaris-bro', 'Polaris Bro', 'Multilord', 'multilord',
   'October 2024', 'EP', '', 'from-purple-600 via-pink-500 to-red-500', 5,
   'https://wildstream.ng/polaris-bro', 0,
   'A 5-track EP exploring themes of ambition and street life.'),

  ('obl', 'OBL', 'Killa Vybz', 'killa-vybz',
   'September 2024', 'Single', '', 'from-gray-700 via-gray-600 to-gray-500', 1,
   'https://wildstream.ng/obl', 0,
   'Hard-hitting single from Killa Vybz.'),

  ('lagos-nights', 'Lagos Nights', 'Kirko Drillz', 'kirko-drillz',
   'August 2024', 'Album', '', 'from-indigo-600 via-purple-600 to-pink-600', 14,
   'https://wildstream.ng/lagos-nights', 1,
   'Kirko Drillz''s debut album — 14 tracks of pure Nigerian drill.');

-- ─── Tracks ───────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO tracks (release_id, title, duration, audio_url, track_number)
VALUES
  (1, 'Solid 4 Life (Intro)', '1:30', '', 1),
  (1, 'Gang Gang', '3:45', '', 2),
  (2, 'M.B.A.F', '3:12', '', 1),
  (3, 'Polaris Bro', '3:55', '', 1),
  (3, 'Night Drive', '4:10', '', 2),
  (4, 'OBL', '2:58', '', 1),
  (5, 'Honeymood', '3:30', '', 1),
  (5, 'Dangote Cover', '3:15', '', 2);

-- ─── Events ───────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO events (slug, title, artist, artist_slug, venue, location, event_date, iso_date, event_time, ticket_url, gradient, featured, description)
VALUES
  ('multilord-eko-hotel-dec-2024', 'Multilord Live at Eko Hotel',
   'Multilord', 'multilord', 'Eko Hotel & Suites', 'Lagos, Nigeria',
   'Dec 15, 2024', '2024-12-15', '8:00 PM', '/contact',
   'from-orange-600 via-red-500 to-pink-600', 1,
   'An unforgettable night with Multilord performing his biggest hits live.'),

  ('killa-vybz-terra-kulture-dec-2024', 'Killa Vybz at Terra Kulture',
   'Killa Vybz', 'killa-vybz', 'Terra Kulture', 'Lagos, Nigeria',
   'Dec 22, 2024', '2024-12-22', '7:00 PM', '/contact',
   'from-gray-700 via-gray-600 to-gray-500', 0,
   'Killa Vybz brings the heat to Terra Kulture for a night of pure hip hop.'),

  ('soundgang-allstars-freedom-park-dec-2024', 'SoundGang All Stars NYE',
   'SoundGang All Stars', 'soundgang', 'Freedom Park', 'Lagos, Nigeria',
   'Dec 31, 2024', '2024-12-31', '9:00 PM', '/contact',
   'from-yellow-500 via-orange-500 to-red-500', 1,
   'Ring in the New Year with the entire SoundGang roster at Freedom Park.');

-- ─── Blog Posts ───────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO blog_posts (slug, title, excerpt, content, author, category, gradient, featured, published_at)
VALUES
  ('soundgang-2024-year-in-review',
   'SoundGang 2024: A Year in Review',
   'From chart-topping singles to sold-out shows, 2024 was a landmark year for SoundGang and our artists.',
   'Full article content goes here...',
   'SoundGang Team', 'News',
   'from-gray-700 via-gray-800 to-black', 1,
   '2024-12-20 00:00:00'),

  ('multilord-mbaf-behind-the-scenes',
   'Behind the Scenes: Multilord''s M.B.A.F',
   'We sat down with Multilord to talk about the making of his latest single and what''s next.',
   'Full article content goes here...',
   'SoundGang Team', 'Artist Spotlight',
   'from-orange-600 via-red-500 to-pink-600', 1,
   '2024-11-15 00:00:00'),

  ('kirko-drillz-lagos-nights-album',
   'Kirko Drillz Drops Debut Album Lagos Nights',
   'The pioneer of Nigerian drill delivers a 14-track masterpiece that cements his place in the game.',
   'Full article content goes here...',
   'SoundGang Team', 'Release',
   'from-indigo-600 via-purple-600 to-pink-600', 0,
   '2024-08-10 00:00:00');

-- ─── Videos ───────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO videos (title, artist, artist_slug, youtube_id, video_date)
VALUES
  ('HONEYMOOD', 'KIRKO DRILLZ', 'kirko-drillz', 'dQw4w9WgXcQ', 'May 24, 2019'),
  ('DANGOTE COVER', 'KIRKO DRILLZ', 'kirko-drillz', 'dQw4w9WgXcQ', 'May 24, 2019'),
  ('BEATBOX FREESTYLE', 'MULTILORD', 'multilord', 'dQw4w9WgXcQ', 'May 24, 2019'),
  ('$150K', 'MULTILORD', 'multilord', 'dQw4w9WgXcQ', 'May 24, 2019');
