import Link from 'next/link';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getPostById, getLatestPosts } from '@/lib/data/blog';
import { buildMetadata, buildBlogJsonLd } from '@/lib/seo';

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = getPostById(Number(id));
    if (!post) return buildMetadata({ title: 'Post Not Found', noIndex: true });
    return buildMetadata({
        title: post.title,
        description: post.excerpt,
        image: post.coverImage,
        url: `https://soundgang.ng/blog/${post.id}`,
        type: 'article',
    });
}

// TODO: When backend is ready, replace getPostById with an API/DB call
export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = getPostById(Number(id));

    if (!post) notFound();

    const relatedPosts = getLatestPosts(6).filter((p) => p.id !== post.id).slice(0, 3);
    const jsonLd = buildBlogJsonLd({
        title: post.title,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        author: post.author,
        publishedAt: post.isoDate,
        slug: String(post.id),
    });

    return (
        <div className="min-h-screen bg-black">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            {/* Hero */}
            <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${post.gradient}`}
                    style={
                        post.coverImage
                            ? { backgroundImage: `url(${post.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                            : undefined
                    }
                >
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                <div className="relative h-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors w-fit">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>

                    <div className="mb-4">
                        <span className="bg-[#8B9D7F] px-4 py-2 rounded-full text-sm font-semibold text-white">
                            {post.category}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">{post.title}</h1>

                    <div className="flex items-center gap-6 text-white/80">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="text-sm">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{post.date}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article */}
            <article className="py-16 lg:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-12 pb-8 border-b border-gray-800">
                        <span className="text-gray-400 text-sm font-semibold">SHARE:</span>
                        {['Facebook', 'Twitter', 'LinkedIn', 'Copy link'].map((label) => (
                            <button
                                key={label}
                                className="p-2 rounded-full border border-gray-800 text-gray-400 hover:border-[#8B9D7F] hover:text-[#8B9D7F] transition-colors"
                                aria-label={`Share on ${label}`}
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                        ))}
                    </div>

                    <div
                        className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-[#8B9D7F] prose-a:no-underline hover:prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </article>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
                <section className="py-16 lg:py-24 border-t border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-white mb-12">Related Posts</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedPosts.map((related) => (
                                <Link key={related.id} href={`/blog/${related.id}`} className="group">
                                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-gray-900">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${related.gradient}`}>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-6xl opacity-20">📝</span>
                                            </div>
                                        </div>
                                        <div className="absolute top-4 left-4 bg-[#8B9D7F] px-3 py-1 rounded-full">
                                            <span className="text-xs font-semibold text-white">{related.category}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#8B9D7F] transition-colors line-clamp-2">
                                        {related.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm line-clamp-2">{related.excerpt}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
