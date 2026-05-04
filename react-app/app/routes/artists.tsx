import type { MetaFunction } from 'react-router'
import { Link } from 'react-router-dom'
import { Music2 } from 'lucide-react'
import PageHeader from '../../src/components/PageHeader'
import { artists } from '../../src/lib/data/artists'

export const meta: MetaFunction = () => [
  { title: 'Our Artists | SoundGang' },
  {
    name: 'description',
    content: 'Meet the voices shaping contemporary African music. Discover SoundGang artists.'
  }
]

export default function ArtistsPage() {
  return (
    <div className="min-h-screen bg-black">
      <PageHeader
        title="Our Artists"
        subtitle="Meet the voices shaping contemporary African music"
        backgroundVideo="https://res.cloudinary.com/dqwfjxn8g/video/upload/q_auto/f_auto/v1776634243/0_Audio_Sound_1280x720_sps4wp.mp4"
      />

      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
              <div
                key={artist.id}
                className="group overflow-hidden rounded-2xl border border-gray-800 bg-[#1a1a1a] transition-all duration-300 hover:border-[#8B9D7F]"
              >
                <div className="relative aspect-square overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${artist.gradient}`}
                    style={
                      artist.image
                        ? { backgroundImage: `url(${artist.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                        : undefined
                    }
                  >
                    {!artist.image && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-8xl opacity-20">🎤</span>
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
                    <Link
                      to={`/artists/${artist.slug}`}
                      className="rounded-lg bg-[#8B9D7F] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#7a8c6f]"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="mb-2 text-2xl font-bold text-white transition-colors group-hover:text-[#8B9D7F]">
                    {artist.name}
                  </h3>
                  <p className="mb-2 font-medium text-[#8B9D7F]">{artist.genre}</p>
                  <p className="text-sm text-gray-400">{artist.shortBio}</p>

                  <div className="mb-4 mt-3 flex items-center gap-2 text-gray-400">
                    <Music2 className="h-4 w-4" />
                    <span className="text-sm">{artist.stats.albums} Albums</span>
                  </div>

                  <div className="flex items-center gap-3 border-t border-gray-800 pt-4">
                    <a href={artist.social.instagram} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-[#8B9D7F]" aria-label="Instagram">
                      <span className="text-xs text-white">IG</span>
                    </a>
                    <a href={artist.social.twitter} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-[#8B9D7F]" aria-label="Twitter">
                      <span className="text-xs text-white">X</span>
                    </a>
                    <a href={artist.social.spotify} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-[#8B9D7F]" aria-label="Spotify">
                      <span className="text-xs text-white">SP</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
