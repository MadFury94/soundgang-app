import type { MetaFunction } from 'react-router'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { getPostById, getLatestPosts } from '../../src/lib/data/blog'

export const meta: MetaFunction = () => [
  { title: 'Blog Post | SoundGang' },
  { name: 'description', content: 'Read SoundGang blog post.' }
]

export default function BlogPostPage() {
  const { id } = useParams()
  const post = id ? getPostById(Number(id)) : undefined

  if (!post) {
    return (
      <div className="mx-auto min-h-screen max-w-4xl px-4 py-32 text-center text-white">
        <h1 className="mb-4 text-4xl font-bold">Post Not Found</h1>
        <Link to="/blog" className="text-[#8B9D7F] hover:underline">
          Back to Blog
        </Link>
      </div>
    )
  }

  const relatedPosts = getLatestPosts(6).filter((p) => p.id !== post.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-black">
      <div className="relative min-h-[500px] h-[60vh] overflow-hidden">
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
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative mx-auto flex h-full max-w-4xl flex-col justify-end px-4 pb-16 sm:px-6 lg:px-8">
          <Link to="/blog" className="mb-8 inline-flex w-fit items-center gap-2 text-white/80 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <div className="mb-4">
            <span className="rounded-full bg-[#8B9D7F] px-4 py-2 text-sm font-semibold text-white">{post.category}</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">{post.title}</h1>

          <div className="flex items-center gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{post.date}</span>
            </div>
          </div>
        </div>
      </div>

      <article className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="border-t border-gray-800 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-3xl font-bold text-white">Related Posts</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link key={related.id} to={`/blog/${related.id}`} className="group">
                  <div className="relative mb-4 aspect-video overflow-hidden rounded-2xl bg-gray-900">
                    <div className={`absolute inset-0 bg-gradient-to-br ${related.gradient}`} />
                    <div className="absolute left-4 top-4 rounded-full bg-[#8B9D7F] px-3 py-1">
                      <span className="text-xs font-semibold text-white">{related.category}</span>
                    </div>
                  </div>
                  <h3 className="mb-2 line-clamp-2 text-xl font-bold text-white transition-colors group-hover:text-[#8B9D7F]">
                    {related.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-gray-400">{related.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
