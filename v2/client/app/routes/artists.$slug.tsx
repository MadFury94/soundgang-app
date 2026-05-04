import type { MetaFunction } from 'react-router'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Music, MapPin, Users, Play } from 'lucide-react'
import { getArtistBySlug } from '../../src/lib/data/artists'

export const meta: MetaFunction = () => [
  { title: 'Artist Profile | SoundGang' },
  { name: 'description', content: 'Artist profile on SoundGang.' }
]

export default function ArtistDetailPage() {
  const { slug } = useParams()
  const artist = slug ? getArtistBySlug(slug) : undefined

  if (!artist) {
    return (
      <div className="mx-auto min-h-screen max-w-4xl px-4 py-32 text-center text-white">
        <h1 className="mb-4 text-4xl font-bold">Artist Not Found</h1>
        <Link to="/artists" className="text-[#8B9D7F] hover:underline">
          Back to Artists
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative min-h-[70vh] overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${artist.gradient}`}
          style={
            artist.coverImage
              ? {
                  backgroundImage: `url(${artist.coverImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center top'
                }
              : undefined
          }
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-36 sm:px-6 lg:px-8">
          <Link to="/artists" className="mb-10 inline-flex w-fit items-center gap-2 text-sm text-white/70 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to Artists
          </Link>

          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end lg:gap-10">
            <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl border-4 border-white/20 bg-gray-900 shadow-2xl sm:h-44 sm:w-44">
              {artist.image ? (
                <img src={artist.image} alt={artist.name} className="h-full w-full object-cover" />
              ) : (
                <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${artist.gradient}`}>
                  <Music className="h-16 w-16 text-white/30" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#8B9D7F]">Artist</p>
              <h1 className="mb-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">{artist.name}</h1>
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-1.5">
                  <Music className="h-4 w-4 text-[#8B9D7F]" />
                  <span>{artist.genre}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#8B9D7F]" />
                  <span>Lagos, Nigeria</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-[#8B9D7F]" />
                  <span>{artist.stats.followers} Followers</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={artist.social.spotify} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-[#8B9D7F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7a8c6f]">
                  <Play className="h-3.5 w-3.5 fill-white" />
                  Spotify
                </a>
                <a href={artist.social.instagram} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            <div><div className="mb-1 text-3xl font-bold text-[#8B9D7F] sm:text-4xl">{artist.stats.albums}</div><div className="text-sm text-gray-400">Albums</div></div>
            <div><div className="mb-1 text-3xl font-bold text-[#8B9D7F] sm:text-4xl">{artist.stats.singles}</div><div className="text-sm text-gray-400">Singles</div></div>
            <div><div className="mb-1 text-3xl font-bold text-[#8B9D7F] sm:text-4xl">{artist.stats.awards}</div><div className="text-sm text-gray-400">Awards</div></div>
            <div><div className="mb-1 text-3xl font-bold text-[#8B9D7F] sm:text-4xl">{artist.stats.followers}</div><div className="text-sm text-gray-400">Followers</div></div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-bold lg:text-3xl">Biography</h2>
          <p className="text-base leading-relaxed text-gray-300 lg:text-lg">{artist.bio}</p>
        </div>
      </section>
    </div>
  )
}
