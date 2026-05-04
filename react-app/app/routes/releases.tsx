import type { MetaFunction } from 'react-router'
import { Link } from 'react-router-dom'
import { Calendar, Play } from 'lucide-react'
import PageHeader from '../../src/components/PageHeader'
import { releases } from '../../src/lib/data/releases'
import { usePlayer } from '../../src/lib/player-context'

export const meta: MetaFunction = () => [
  { title: 'Releases | SoundGang' },
  {
    name: 'description',
    content: 'Fresh sounds from the SoundGang roster.'
  }
]

export default function ReleasesPage() {
  const { play } = usePlayer()

  return (
    <div className="min-h-screen bg-black">
      <PageHeader
        title="Releases"
        subtitle="Fresh sounds from our roster"
        backgroundVideo="https://res.cloudinary.com/dqwfjxn8g/video/upload/q_auto/f_auto/v1776634243/0_Audio_Sound_1280x720_sps4wp.mp4"
      />

      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-white lg:text-3xl">All Releases</h2>
              <p className="mt-1 text-gray-400">{releases.length} releases available</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {releases.map((release) => (
              <div key={release.id} className="group">
                <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-gray-900">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${release.gradient}`}
                    style={
                      release.coverImage
                        ? {
                            backgroundImage: `url(${release.coverImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }
                        : undefined
                    }
                  >
                    {!release.coverImage && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl opacity-20">🎵</span>
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button
                      onClick={() => release.tracks[0] && play(release.tracks[0], release.tracks)}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8B9D7F] transition-colors hover:bg-[#7a8c6f]"
                      aria-label={`Play ${release.title}`}
                    >
                      <Play className="h-8 w-8 fill-white text-white" />
                    </button>
                  </div>

                  <div className="absolute right-3 top-3 rounded-full bg-black/80 px-3 py-1 backdrop-blur-sm">
                    <span className="text-xs font-semibold text-white">{release.type}</span>
                  </div>
                </div>

                <h3 className="mb-1 line-clamp-1 text-lg font-bold text-white transition-colors hover:text-[#8B9D7F]">
                  <Link to="#">{release.title}</Link>
                </h3>
                <p className="mb-2 line-clamp-1 text-sm text-gray-400">{release.artist}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{release.releaseDate}</span>
                  </div>
                  <span>
                    {release.trackCount} {release.trackCount === 1 ? 'Track' : 'Tracks'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
