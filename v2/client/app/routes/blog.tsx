import type { MetaFunction } from 'react-router'
import { Link } from 'react-router-dom'
import { Calendar, User, ArrowRight } from 'lucide-react'
import PageHeader from '../../src/components/PageHeader'
import { getLatestPosts, blogCategories } from '../../src/lib/data/blog'

export const meta: MetaFunction = () => [
  { title: 'Blog | SoundGang' },
  {
    name: 'description',
    content: 'News, insights, and stories from the SoundGang music label.'
  }
]

export default function BlogPage() {
  const posts = getLatestPosts()

  return (
    <div className="min-h-screen bg-black">
      <PageHeader
        title="Blog"
        subtitle="News, insights, and stories from the music industry"
        backgroundVideo="https://res.cloudinary.com/dqwfjxn8g/video/upload/q_auto/f_auto/v1776634243/0_Audio_Sound_1280x720_sps4wp.mp4"
      />

      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            <button className="rounded-full border border-[#8B9D7F] bg-[#8B9D7F]/10 px-6 py-2 text-sm font-medium text-white">
              All
            </button>
            {blogCategories.map((cat) => (
              <button
                key={cat}
                className="rounded-full border border-gray-800 px-6 py-2 text-sm font-medium text-white transition-colors hover:border-[#8B9D7F] hover:bg-[#8B9D7F]/10"
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="group">
                <div className="relative mb-4 aspect-video overflow-hidden rounded-2xl bg-gray-900">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${post.gradient}`}
                    style={
                      post.coverImage
                        ? {
                            backgroundImage: `url(${post.coverImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }
                        : undefined
                    }
                  >
                    {!post.coverImage && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl opacity-20">📝</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute left-4 top-4 rounded-full bg-[#8B9D7F] px-3 py-1">
                    <span className="text-xs font-semibold text-white">{post.category}</span>
                  </div>
                </div>

                <h3 className="mb-3 line-clamp-2 text-xl font-bold text-white transition-colors group-hover:text-[#8B9D7F]">
                  {post.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm text-gray-400">{post.excerpt}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{post.date}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#8B9D7F] transition-all group-hover:gap-3">
                  Read More
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
